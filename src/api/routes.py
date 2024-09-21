"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import hmac
import base64
import json
import time

api = Blueprint('api', __name__)
CORS(api)

SECRET_KEY = 'tu_clave_secreta'  # Cambia esto por una clave más segura

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': time.time() + 3600  # Token válido por 1 hora
    }
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    signature = hmac.new(SECRET_KEY.encode(), payload_encoded.encode(), 'sha256').hexdigest()
    token = f"{payload_encoded}.{signature}"
    return token

def verify_token(token):
    try:
        payload_encoded, signature = token.split('.')
        expected_signature = hmac.new(SECRET_KEY.encode(), payload_encoded.encode(), 'sha256').hexdigest()
        
        if not hmac.compare_digest(expected_signature, signature):
            return None
        
        payload = json.loads(base64.urlsafe_b64decode(payload_encoded).decode())
        if payload['exp'] < time.time():
            return None  # Token expirado
        
        return payload['user_id']
    except Exception:
        return None

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "Usuario ya registrado"}), 400

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado con éxito"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({"message": "Credenciales incorrectas"}), 401

    token = generate_token(user.id)
    return jsonify({'token': token})

@api.route('/validate', methods=['GET'])
def validate_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"message": "Authorization header is missing"}), 400

    token = auth_header.split()[1]
    user_id = verify_token(token)
    if user_id is None:
        return jsonify({"message": "Token inválido o expirado"}), 401
    
    user = User.query.get(user_id)
    if user:
        return jsonify({"id": user.id, "email": user.email}), 200
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404

@api.route('/logout', methods=['POST'])
def handle_logout():
    # Lógica para invalidar el token (si es necesario)
    return jsonify({"message": "Cierre de sesión exitoso"}), 200
