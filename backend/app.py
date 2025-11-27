from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
from config import DB_HOST, DB_USER, DB_PASS, DB_NAME

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )

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

# Ruta para obtener los usuarios
@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_usuario, nombre, correo FROM usuarios")
    factores = cursor.fetchall()
    conn.close()
    return jsonify(factores)

# -------------------------------------------------------------------------
# HU1: VISUALIZAR COTIZACIONES PREVIAS
# Tarea 1: Crear endpoint GET /cotizaciones/:usuario
# -------------------------------------------------------------------------
@app.route('/api/cotizaciones/<int:id_usuario>', methods=['GET'])
def obtener_historial_usuario(id_usuario):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Hacemos JOIN para traer el nombre del tipo de construcción
        query = """
            SELECT 
                c.id_cotizacion, 
                c.nombre AS nombre_proyecto, 
                c.fecha, 
                c.metros, 
                c.total, 
                tc.nombre AS tipo_construccion 
            FROM cotizaciones c
            JOIN tiposconstruccion tc ON c.tipo = tc.id_tipo
            WHERE c.id_usuario = %s
            ORDER BY c.fecha DESC
        """
        cursor.execute(query, (id_usuario,))
        cotizaciones = cursor.fetchall()
        return jsonify(cotizaciones), 200
    except mysql.connector.Error as err:
        print(f"Error al obtener historial: {err}")
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()
        
# -------------------------------------------------------------------------
# Ruta para guardar una cotización
# HU3: GUARDAR COTIZACIÓN
# Tarea 1: Crear endpoint para guardar cotizaciones
# -------------------------------------------------------------------------
@app.route('/api/guardar_cotizacion', methods=['POST'])
def guardar_cotizacion():
    data = request.get_json()

    # Extracción de datos del cuerpo de la petición
    id_usuario = data.get('id_usuario')
    nombre = data.get('nombre')
    metros = data.get('metros')
    tipo = data.get('tipo')
    factor = data.get('factor')
    total = data.get('total')

    # --- TAREA 2: VALIDACIÓN DE CAMPOS ---
    
    # 1. Validar que todos los campos obligatorios existan
    if not all([id_usuario, nombre, metros, tipo, factor, total]):
        return jsonify({'error': 'Todos los campos son obligatorios (id_usuario, nombre, metros, tipo, factor, total)'}), 400

    # 2. Validar tipos de datos y rangos lógicos
    try:
        metros_float = float(metros)
        factor_float = float(factor)
        total_float = float(total)
        tipo_int = int(tipo)

        if metros_float <= 0:
            return jsonify({'error': 'Los metros cuadrados deben ser mayores a 0'}), 400
        
        if total_float <= 0:
            return jsonify({'error': 'El costo total debe ser mayor a 0'}), 400

    except ValueError:
        return jsonify({'error': 'Error en el formato de los datos numéricos'}), 400

    # 3. Validar longitud del nombre (según base de datos VARCHAR(150))
    if len(nombre) > 150:
        return jsonify({'error': 'El nombre de la cotización es demasiado largo (máx 150 caracteres)'}), 400


    # --- TAREA 3: INSERTAR EN BASE DE DATOS ---
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO cotizaciones (id_usuario, nombre, metros, tipo, factor, total)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (id_usuario, nombre, metros_float, tipo_int, factor_float, total_float))
        conn.commit()
        
        return jsonify({'message': 'Cotización guardada correctamente', 'id_cotizacion': cursor.lastrowid}), 201

    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Error BD: {err}")
        return jsonify({'error': 'Error al guardar en la base de datos'}), 500
        
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=False)
