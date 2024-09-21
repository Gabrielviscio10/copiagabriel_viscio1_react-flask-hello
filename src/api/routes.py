from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)
CORS(api)

# Configuración de JWT
# Mueve esto a app.py para evitar duplicación
# app = Flask(__name__)
# app.config['JWT_SECRET_KEY'] = 'clave'  # Cambia esto por una clave más segura
# jwt = JWTManager(app)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{"id": user.id, "email": user.email} for user in users]
    return jsonify(users_list), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "Usuario ya registrado"}), 400

    new_user = User(email=email,password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado con éxito"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validar que se envíen el email y la contraseña
    if not email or not password:
        return jsonify({'message': 'Email y contraseña son requeridos'}), 400

    # Buscar usuario por email
    user = User.query.filter_by(email=email).first()

    # Validar si el usuario existe
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    # Verificar si la contraseña coincide
    if user.password != password:
        return jsonify({'message': 'Contraseña incorrecta'}), 401

    # Generar token de acceso
    access_token = create_access_token(identity=user.id)
    return jsonify({'token': access_token}), 200

@api.route('/validate', methods=['GET'])
@jwt_required()  # Proteger la ruta con JWT
def validate_token():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({"id": user.id, "email": user.email}), 200
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404

@api.route('/logout', methods=['POST'])
def handle_logout():
    return jsonify({"message": "Cierre de sesión exitoso"}), 200
