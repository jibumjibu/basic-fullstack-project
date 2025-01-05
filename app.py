from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'database.db'

# Initialize database
def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL
            )
        ''')

# Home route
@app.route('/')
def index():
    return render_template('index.html')

# Add user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    name, email = data['name'], data['email']
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('INSERT INTO users (name, email) VALUES (?, ?)', (name, email))
    return jsonify({'success': True})

# Get users
@app.route('/get_users', methods=['GET'])
def get_users():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.execute('SELECT * FROM users')
        users = [{'id': row[0], 'name': row[1], 'email': row[2]} for row in cursor.fetchall()]
    return jsonify(users)

# Delete user
@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    return jsonify({'success': True})

# Update user
@app.route('/update_user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    name, email = data['name'], data['email']
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', (name, email, user_id))
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
