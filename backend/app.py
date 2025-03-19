from flask import Flask, jsonify
from flask_cors import CORS
from config import get_db_connection

app = Flask(__name__)
CORS(app)  # Permite que React pueda hacer peticiones al backend

# Ruta para obtener los costos por metro cuadrado según el tipo de construcción
@app.route('/api/costos', methods=['GET'])
def obtener_costos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_tipo, costo FROM costosmetrocuadrado")
    costos = cursor.fetchall()
    conn.close()
    return jsonify(costos)

# Ruta para obtener los factores interciudad
@app.route('/api/factores', methods=['GET'])
def obtener_factores():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_factor, ciudad, factor FROM factoresinterciudad")
    factores = cursor.fetchall()
    conn.close()
    return jsonify(factores)

if __name__ == '__main__':
    app.run(debug=True)