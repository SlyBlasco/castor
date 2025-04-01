from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
from config import get_db_connection

app = Flask(__name__)
CORS(app)

# Endpoint de registro
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not (nombre and correo and contrasena):
        return jsonify({'error': 'Faltan datos'}), 400

    # Hashea la contraseña
    hashed = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = "INSERT INTO usuarios (nombre, correo, contrasena) VALUES (%s, %s, %s)"
        cursor.execute(query, (nombre, correo, hashed.decode('utf-8')))
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Usuario registrado correctamente'}), 201

# Endpoint de inicio de sesión
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not (correo and contrasena):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM usuarios WHERE correo = %s"
    cursor.execute(query, (correo,))
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Verifica la contraseña
    if bcrypt.checkpw(contrasena.encode('utf-8'), usuario['contrasena'].encode('utf-8')):
        # Aquí podrías generar un token JWT en un escenario real
        return jsonify({'message': 'Inicio de sesión exitoso', 'usuario': usuario}), 200
    else:
        return jsonify({'error': 'Contraseña incorrecta'}), 401
    
# Ruta para obtener los costos por metro cuadrado según el tipo de construcción
@app.route('/api/costos', methods=['GET'])
def obtener_costos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
      SELECT cmc.id_tipo, cmc.costo, tc.descripcion 
      FROM costosmetrocuadrado AS cmc
      JOIN tiposconstruccion AS tc ON cmc.id_tipo = tc.id_tipo
    """
    cursor.execute(query)
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
