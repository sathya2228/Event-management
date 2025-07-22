import json
import re
import uuid
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from bson import ObjectId
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
import google.generativeai as genai

# MongoDB connection
client = MongoClient("mongodb+srv://sathyasihub:jCWPhwGYF64FzGAR@cluster0.wu7hypd.mongodb.net/")
db = client['event_db']
admin_collection = db['admins']
event_collection = db['events']

# Gemini API configuration
genai.configure(api_key="AIzaSyBJVI1xmjIkSMyFQA-ftECnZgbrT_Zb-JA")
model = genai.GenerativeModel("gemini-1.5-flash")

# Helper: Validate email
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

# Helper: Validate name
def is_valid_name(name):
    return re.match(r"^[A-Za-z\s]+$", name)

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('adminname')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            # 1. Validate name
            if not name or not is_valid_name(name):
                return JsonResponse({'error': 'Name is required and must be alphabetic.'}, status=400)

            # 2. Validate email
            if not email or not is_valid_email(email):
                return JsonResponse({'error': 'Email is not valid.'}, status=400)

            # 3. Validate password
            if not password or not confirm_password:
                return JsonResponse({'error': 'Password and confirm password are required.'}, status=400)
            if password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match.'}, status=400)
            if len(password) < 8:
                return JsonResponse({'error': 'Password must be at least 8 characters long.'}, status=400)

            # 4. Check duplicate email
            if admin_collection.find_one({'email': email}):
                return JsonResponse({'error': 'Email already exists.'}, status=400)

            # 5. Hash password
            hashed_password = make_password(password)

            # 6. Insert into DB
            admin_data = {
                "_id": str(uuid.uuid4()),
                "name": name,
                "email": email,
                "password": hashed_password,
                "created_at": datetime.utcnow()
            }
            admin_collection.insert_one(admin_data)

            return JsonResponse({'message': 'Admin registered successfully.'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Validate input
            if not email or not password:
                return JsonResponse({'error': 'Email and password are required.'}, status=400)

            # Find admin by email
            admin = admin_collection.find_one({'email': email})
            if not admin:
                return JsonResponse({'error': 'Invalid email or password.'}, status=401)

            # Check password
            if not check_password(password, admin['password']):
                return JsonResponse({'error': 'Invalid email or password.'}, status=401)

            return JsonResponse({
                'message': 'Login successful',
                'admin': {
                    'id': admin['_id'],
                    'name': admin['name'],
                    'email': admin['email'],
                }
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def generate_event_description(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            venue = data.get('venue')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            cost = data.get('cost')

            if not title or not venue:
                return JsonResponse({'error': 'Title and venue are required.'}, status=400)

            # Validate dates
            if start_date and end_date:
                try:
                    start = datetime.strptime(start_date, '%Y-%m-%d')
                    end = datetime.strptime(end_date, '%Y-%m-%d')
                    if end < start:
                        return JsonResponse({'error': 'End date cannot be before start date.'}, status=400)
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

            prompt = f"""Generate a single, professional, and engaging event description as a concise paragraph (50-70 words) using the following details:
            - Event Title: {title}
            - Venue: {venue}
            - Start Date: {start_date or 'TBD'}
            - End Date: {end_date or 'TBD'}
            - Cost: {cost or 'Free'} INR
            Return only the paragraph without any additional options, notes, placeholders (e.g., [Link to registration]), or formatting markers (e.g., **bold**). Ensure the description is exciting and suitable for event promotion.
            """
            response = model.generate_content(prompt)
            description = response.text.strip()
            return JsonResponse({'description': description}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def create_event(request):
    if request.method == 'POST':
        try:
            # Parse JSON body
            data = json.loads(request.body)

            # Extract fields
            title = data.get('title')
            venue = data.get('venue')
            start_time = data.get('start_time')
            end_time = data.get('end_time')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            cost = data.get('cost')
            image_base64 = data.get('image_base64')  # Expect Base64 string
            use_ai = data.get('use_ai', False)
            description = data.get('description')

            # Validate required fields
            if not all([title, venue, start_time, end_time, start_date, end_date, cost, description]):
                return JsonResponse({'error': 'All fields except image are required.'}, status=400)

            # Generate description using AI if requested
            if use_ai:
                description = generate_event_description(title, venue, start_time, end_time, cost)

            # Create event dictionary
            event = {
                "_id": str(uuid.uuid4()),
                "title": title,
                "venue": venue,
                "start_time": start_time,
                "end_time": end_time,
                "start_date": start_date,
                "end_date": end_date,
                "cost": float(cost) if cost else 0,
                "image_base64": image_base64,  # Store Base64 string
                "description": description,
                "created_at": datetime.utcnow()
            }

            # Insert into MongoDB
            event_collection.insert_one(event)

            return JsonResponse({'message': 'Event created successfully!', 'event_id': event['_id']}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get_events(request):
    if request.method == 'GET':
        try:
            events = list(event_collection.find())
            for event in events:
                event['_id'] = str(event['_id'])
                if 'created_at' in event and isinstance(event['created_at'], datetime):
                    event['created_at'] = event['created_at'].isoformat()
            return JsonResponse({'events': events}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)