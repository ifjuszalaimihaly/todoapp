## How to Run the Project

1. **Create `.env` files:**
   - Create `.env` files in the **root**, **backend**, and **frontend** directories based on their respective `.env.example` files.

2. **Configure MYSQL root password:**
   - In the **root `.env` file**, set the `MYSQL_ROOT_PASSWORD` to a 32-character long password.
   - Ensure this password matches the one in the **backend `.env` file**.

3. **Generate JWT secret:**
   - In the **backend `.env` file**, generate and set a 40-character log string for the `jwt_secret` variable.

4. **Build and run the Docker containers:**
   - Run the following command to build and start the Docker containers:
     ```bash
     docker compose up --build -d
     ```

## Component URLs
- **Backend**: [http://localhost:88/](http://localhost:88/)
- **Frontend**: [http://localhost:81/](http://localhost:81/)
- **phpMyAdmin**: [http://localhost:82/](http://localhost:82/)

## Test Users

You can use the following test users to verify functionality:

- **Test User 1:**
  - **Username**: `testuser1`
  - **Password**: `AvtCZfb5WsKTG9qhxkFejgVQEm2zY4SB`

- **Test User 2:**
  - **Username**: `testuser2`
  - **Password**: `UHGaRky4WBX7m25V3wS9Y8zbdrJFuEft`

**Note**: These test users' passwords are encrypted in the database.

## Functionality

- Users can **register** an account.
- Users can **log in** and **log out**.
- Users can **create todos** with a title and a due date.
- Users can **edit** the title and due date of their todos.
- Users can **delete** todos.
- Users can mark todos as **pinned** (complete) or **unpin** them, indicating they are complete or incomplete.
