import mysql.connector
from flask import Flask, render_template, request, jsonify, url_for
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

# CONFIGURACIÓN DE BASE DE DATOS
def conectar_db():
    return mysql.connector.connect(
        host=os.getenv('MYSQLHOST', 'yamabiko.proxy.rlwy.net'),
        user=os.getenv('MYSQLUSER', 'root'),
        password=os.getenv('MYSQLPASSWORD', 'LoMnmisPxQJryOqMgmboWKKPfoZYbrVf'),
        database=os.getenv('MYSQLDATABASE', 'railway'),
        port=int(os.getenv('MYSQLPORT', 11478))
    )

# RUTAS DE NAVEGACIÓN
@app.route('/')
def presentacion(): 
    return render_template('presentacion.html')

@app.route('/productos')
def productos():
    return render_template('productos.html')

@app.route('/iniciarSesion')
def iniciarSesion():
    return render_template('iniciarSesion.html')

@app.route('/registro')
def registro():
    return render_template('registro.html')

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/form')
def form():
    return render_template('form.html')

# RUTAS DE LA API
@app.route('/api/registro', methods=['POST'])
def api_registro():
    datos = request.json
    conexion = None
    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        id_automatico = random.randint(100, 999999)
        
        query = """
            INSERT INTO usuarios (id_usuario, nombre_completo, correo, contrasenia) 
            VALUES (%s, %s, %s, %s)
        """
        valores = (id_automatico, datos['nombre_completo'], datos['correo'], datos['contrasenia'])
        
        cursor.execute(query, valores)
        conexion.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    finally:
        if conexion and conexion.is_connected():
            cursor.close()
            conexion.close()

@app.route('/api/login', methods=['POST'])
def api_login():
    datos = request.json
    conexion = None
    try:
        conexion = conectar_db()
        cursor = conexion.cursor(dictionary=True)
        query = "SELECT * FROM usuarios WHERE correo = %s AND contrasenia = %s"
        cursor.execute(query, (datos['correo'], datos['contrasenia']))
        usuario = cursor.fetchone()
        
        if usuario:
            return jsonify({'success': True, 'user': usuario})
        else:
            return jsonify({'success': False, 'message': 'Credenciales incorrectas'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    finally:
        if conexion and conexion.is_connected():
            cursor.close()
            conexion.close()

# ARRANQUE DEL SERVIDOR
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)