import os
import sqlite3


class SQLiteDatabase:
    def __init__(self, database_url=None):
        # Get the database URL
        self.database_url = database_url
        if self.database_url is None:
            self.database_url = os.getenv("DATABASE_URL")

    def get_connection(self):
        # Establish a new SQLite connection
        conn = sqlite3.connect(self.database_url)

        # Enable row factory to access columns by name
        conn.row_factory = sqlite3.Row

        return conn

    def initialize_db(self):
        # Get database connection
        conn = self.get_connection()

        status = {}
        try:
            # Drop tables
            conn.execute("DROP TABLE IF EXISTS users")

            # Create tables
            conn.execute(
                """
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    full_name TEXT,
                    occupation TEXT,
                    password TEXT
                )
            """
            )
            conn.commit()

            # Update status
            status = {"success": True, "message": "Database reset successfully."}

        except sqlite3.Error as e:
            # Update status
            status = {"success": False, "message": str(e)}

        finally:
            # Close database connection
            conn.close()

        return status

    def insert_user(self, user_data, hashed_password):
        # Get database connection
        conn = self.get_connection()

        status = {}
        try:
            # Try to insert user into database
            conn.execute(
                """
                INSERT INTO users (email, full_name, occupation, password)
                VALUES (?, ?, ?, ?)
                """,
                (
                    user_data["email"],
                    user_data["full_name"],
                    user_data["occupation"],
                    hashed_password,
                ),
            )
            conn.commit()

            # Update status
            status = {"success": True, "message": "User registered successfully."}

        except sqlite3.IntegrityError:
            # Update status
            status = {
                "success": False,
                "message": "User already exists, please try again with a different email.",
            }

        except sqlite3.Error as e:
            # Update status
            status = {"success": False, "message": str(e)}

        finally:
            # Close database connection
            conn.close()

        return status

    def select_user(self, user_id=None, email=None):
        # Get database connection
        conn = self.get_connection()

        status = {}
        try:
            # Try to select user from database
            cursor = conn.execute(
                """
                SELECT * FROM users
                WHERE id = ? OR email = ?
                """,
                (user_id, email),
            )
            user = cursor.fetchone()

            # Check if user doesn't exist
            if user is None:
                raise sqlite3.Error("User does not exist, please register first.")

            # Update status w/ user data
            status = {
                "success": True,
                "message": "User retrieved successfully.",
                "user": dict(user),
            }

        except sqlite3.Error as e:
            # Update status
            status = {"success": False, "message": str(e)}

        finally:
            # Close database connection
            conn.close()

        return status

    def update_user(self, user_id, user_data, hashed_password):
        # Get database connection
        conn = self.get_connection()

        status = {}
        try:
            # Try to update user in database
            conn.execute(
                """
                UPDATE users
                SET full_name = ?, email = ?, occupation = ?, password = ?
                WHERE id = ?
                """,
                (
                    user_data["full_name"],
                    user_data["email"],
                    user_data["occupation"],
                    hashed_password,
                    user_id,
                ),
            )
            conn.commit()

            # Update status
            status = {"success": True, "message": "User updated successfully."}

        except sqlite3.Error as e:
            # Update status
            status = {"success": False, "message": str(e)}

        finally:
            # Close database connection
            conn.close()

        return status

    def delete_user(self, user_id):
        # Get database connection
        conn = self.get_connection()

        status = {}
        try:
            # Try to delete user from database
            conn.execute(
                """
                DELETE FROM users
                WHERE id = ?
                """,
                (user_id,),
            )
            conn.commit()

            # Update status
            status = {"success": True, "message": "User deleted successfully."}

        except sqlite3.Error as e:
            # Update status
            status = {"success": False, "message": str(e)}

        finally:
            # Close database connection
            conn.close()

        return status
