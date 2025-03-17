from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite que React pueda hacer peticiones al backend

@app.route('/api/saludo')
def saludo():
    return jsonify({'mensaje': 'Hola desde Flask'})

if __name__ == '__main__':
    app.run(debug=True)