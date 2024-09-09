from flask import Flask, jsonify, request, send_file
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
from models import create_db_connection, User, Todo, TodoSchema
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.exc import SQLAlchemyError
from utils import set_time_zone, set_jwt_token
import datetime

set_time_zone()


session = create_db_connection()

# Serializer object for validation and conversion
todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins":[
        "http://127.0.0.1:*",
        "http://localhost:*",
        "https://127.0.0.1:*",
        "https://localhost:*"
    ]}}
)

app.config['JWT_SECRET_KEY'] = set_jwt_token()
app.config['JWT_BLACKLIST_ENABLED'] = True  # Engedélyezzük a tiltólistát
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']  # Csak az access tokeneket figyeljük
jwt = JWTManager(app)


# Blacklist eltárolása (egyszerű megoldásként egy szettben)
blacklist = set()

# Callback függvény a blacklist ellenőrzéséhez
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']  # A token azonosítója (JTI)
    return jti in blacklist  # True ha a token a tiltólistában van

#new_user = User(username='testuser2')
#new_user.set_password('securepassword')  # Beállítjuk a jelszót hash formában

# Adjuk hozzá az új felhasználót az adatbázishoz
#session.add(new_user)
#session.commit()

@app.route('/', methods=["POST", "GET"])
def hello():
    return jsonify("hello"), 200

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Keressük meg a felhasználót az adatbázisban
    user = session.query(User).filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Ha sikeres, hozzunk létre egy JWT tokent
    access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(hours=1))
    
    return jsonify({"token": access_token}), 200


@app.route('/auth/register', methods=['POST'])
def register():
    try:
        # Kérésből beérkező adatok
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Ellenőrizzük, hogy a felhasználónév és jelszó nincs-e üresen
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Ellenőrizzük, hogy létezik-e már ilyen felhasználónév az adatbázisban
        existing_user = session.query(User).filter_by(username=username).first()
        if existing_user:
            return jsonify({"error": "Username already exists"}), 400

        # Jelszó hash-elése biztonságosan
        hashed_password = generate_password_hash(password)

        # Új felhasználó létrehozása
        new_user = User(username=username, password_hash=hashed_password)
        session.add(new_user)
        session.commit()

        # (Opcionális) Automatikus bejelentkezés regisztráció után: JWT token létrehozása
        access_token = create_access_token(identity=new_user.id, expires_delta=datetime.timedelta(hours=1))

        # Visszaküldjük a tokent vagy sikeres regisztrációs üzenetet
        return jsonify({"message": "User registered successfully", "token": access_token}), 201

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/auth/logout', methods=['POST'])
@jwt_required()  # Csak bejelentkezett felhasználók
def logout():
    # Lekérjük a token azonosítóját (JTI)
    jti = get_jwt()['jti']

    # Hozzáadjuk a token azonosítót a blacklist-hez
    blacklist.add(jti)

    return jsonify({"message": "Successfully logged out"}), 200


# Create - Új tétel hozzáadása
@app.route('/todos', methods=['POST'])
@jwt_required()  # Bejelentkezés szükséges
def create_todo():
    try:
        data = request.json

        # Lekérjük a bejelentkezett felhasználó azonosítóját a JWT-ből
        user_id = get_jwt_identity()

        # Létrehozunk egy új Todo-t a bejelentkezett felhasználóhoz
        new_todo = Todo(
            title=data.get('title'),
            user_id=user_id  # Felhasználó ID hozzárendelése a todo-hoz
        )
        session.add(new_todo)
        session.commit()

        return jsonify(todo_schema.dump(new_todo)), 201

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

# Read - Minden tétel lekérdezése
@app.route('/todos', methods=['GET'])
@jwt_required()  # Bejelentkezés szükséges
def get_todos():
    try:
        # Lekérjük a bejelentkezett felhasználó azonosítóját a JWT-ből
        user_id = get_jwt_identity()

        # Csak a bejelentkezett felhasználó todo-it kérjük le
        todos = session.query(Todo).filter_by(user_id=user_id).all()

        return jsonify([todo_schema.dump(todo) for todo in todos]), 200

    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Read - Egy adott tétel lekérdezése ID alapján
@app.route('/todos/<int:id>', methods=['GET'])
@jwt_required()  # Bejelentkezés szükséges
def get_todo(id):
    try:
        # Lekérjük a bejelentkezett felhasználó azonosítóját a JWT-ből
        user_id = get_jwt_identity()

        # Csak a bejelentkezett felhasználó todo-ját kérjük le
        todo = session.query(Todo).filter_by(id=id, user_id=user_id).first()

        if todo is None:
            return jsonify({"error": "Todo not found"}), 404

        return jsonify(todo_schema.dump(todo)), 200

    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Update - Tétel frissítése ID alapján
@app.route('/todos/<int:id>', methods=['PUT'])
@jwt_required()  # Bejelentkezés szükséges
def update_todo(id):
    try:
        # Lekérjük a bejelentkezett felhasználó azonosítóját a JWT-ből
        user_id = get_jwt_identity()

        # Csak a bejelentkezett felhasználó todo-ját kérjük le
        todo = session.query(Todo).filter_by(id=id, user_id=user_id).first()

        if todo is None:
            return jsonify({"error": "Todo not found"}), 404
        
        data = request.json

        # Frissítjük a 'title' és 'completed' mezőket, ha a kérés tartalmazza azokat
        if 'title' in data and data['title'] is not None:
            todo.title = data['title']
        if 'completed' in data and data['completed'] is not None:
            todo.completed = data['completed']

        session.commit()
        return jsonify(todo_schema.dump(todo)), 200

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete - Tétel törlése ID alapján
@app.route('/todos/<int:id>', methods=['DELETE'])
@jwt_required()  # Bejelentkezés szükséges
def delete_todo(id):
    try:
        # Lekérjük a bejelentkezett felhasználó azonosítóját a JWT-ből
        user_id = get_jwt_identity()

        # Csak a bejelentkezett felhasználó todo-ját kérjük le
        todo = session.query(Todo).filter_by(id=id, user_id=user_id).first()

        if todo is None:
            return jsonify({"error": "Todo not found"}), 404
        
        session.delete(todo)
        session.commit()
        return jsonify({"message": "Todo deleted successfully"}), 200

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

app.run(host='0.0.0.0', port=88, debug=True)