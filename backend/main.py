from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from models import create_db_connection, Todo, TodoSchema
from sqlalchemy.exc import SQLAlchemyError
from utils import set_time_zone

set_time_zone()


session = create_db_connection()
#session.close()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins":[
        "http://127.0.0.1:*",
        "http://localhost:*",
        "https://127.0.0.1:*",
        "https://localhost:*"
    ]}}
)

@app.route('/', methods=["POST", "GET"])
def hello():
    return jsonify("hello"), 200


# Serializer object for validation and conversion
todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)

# Create - Új tétel hozzáadása
@app.route('/todos', methods=['POST'])
def create_todo():
    try:
        data = request.json
        new_todo = Todo(
            title=data.get('title')
        )
        session.add(new_todo)
        session.commit()
        return jsonify(todo_schema.dump(new_todo)), 201
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

# Read - Minden tétel lekérdezése
@app.route('/todos', methods=['GET'])
def get_todos():
    try:
        todos = session.query(Todo).all()
        return jsonify(todos_schema.dump(todos)), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Read - Egy adott tétel lekérdezése ID alapján
@app.route('/todos/<int:id>', methods=['GET'])
def get_todo(id):
    try:
        todo = session.query(Todo).filter_by(id=id).first()
        if todo is None:
            return jsonify({"error": "Todo not found"}), 404
        return jsonify(todo_schema.dump(todo)), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

# Update - Tétel frissítése ID alapján
@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    try:
        todo = session.query(Todo).filter_by(id=id).first()
        if todo is None:
            return jsonify({"error": "Todo not found"}), 404
        
        data = request.json

        # Frissítjük a 'title' és 'completed' mezőket, ha a kérés tartalmazza azokat, és nem 'null'
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
def delete_todo(id):
    try:
        todo = session.query(Todo).filter_by(id=id).first()
        if todo is None:
            return jsonify({"error": "Todo not found"}), 404
        
        session.delete(todo)
        session.commit()
        return jsonify({"message": "Todo deleted successfully"}), 200
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

app.run(host='0.0.0.0', port=88, debug=True)