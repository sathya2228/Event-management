import re
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from bson import ObjectId 
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb+srv://sathyasihub:jCWPhwGYF64FzGAR@cluster0.wu7hypd.mongodb.net/")
db = client['event_db']
admin_collection = db['users']
user_collection = db['users']  

@csrf_exempt
def user_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            username = data.get('username', '').strip()
            email = data.get('email', '').strip()
            password = data.get('password', '').strip()
            confirm_password = data.get('confirm_password', '').strip()

            # ✅ Validate name (only letters and spaces)
            if not username or not re.match(r'^[A-Za-z ]+$', username):
                return JsonResponse({'error': 'Name is required and must contain only letters and spaces.'}, status=400)

            # ✅ Validate email
            if not email:
                return JsonResponse({'error': 'Email is required.'}, status=400)

            # ✅ Validate password
            if not password or password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match.'}, status=400)

            # ✅ Check if email already exists in MongoDB
            if admin_collection.find_one({'email': email}):
                return JsonResponse({'error': 'Email already registered.'}, status=400)

            # ✅ Insert into MongoDB
            hashed_password = make_password(password)
            admin_collection.insert_one({
                'username': username,
                'email': email,
                'password': hashed_password
            })

            return JsonResponse({'message': 'User registered successfully.'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Input validation
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)

            # Find user by email
            user = user_collection.find_one({'email': email})
            if not user:
                return JsonResponse({'error': 'Invalid email or password.'}, status=401)

            # Validate password
            if not check_password(password, user['password']):
                return JsonResponse({'error': 'Invalid email or password.'}, status=401)

            return JsonResponse({
                'message': 'Login successful',
                'user': {
                    'id': str(user['_id']),
                    'username': user.get('username'),
                    'email': user.get('email'),
                }
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)