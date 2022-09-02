import json
from flask import Flask, Response, abort, request
# from mock_data import budgets
from config import database
from bson import ObjectId
from flask_cors import CORS
import hashlib
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask("Financial_Planner_React")
CORS(app)

@app.route("/")
def home():
    return "This is the home"

@app.post("/register")

def save_user():
    try:
        user = request.get_json()

        # User must have email
        if not "user_email" in user:
            return abort(400, "You must put in a valid email")

        # User must create User Name
        if not "user_name" in user or len(user["user_name"]) < 4:
            return abort(400, "You must have a User Name with at least 4 characters")

        # User must have a Password
        if not "user_password" in user or len(user["user_password"]) < 6:
            return abort(400, "You must have a password with at least 6 characters")

        # Encrypt password
        password = user['user_password'].encode()
        hashPassword = hashlib.sha256(password)
        hashPassword = hashPassword.hexdigest()
        user["user_password"] = str(hashPassword)
        database.users.insert_one(user)
        
        user["_id"] = str(user["_id"])
        print(user)
        return json.dumps(user)
    
    except Exception as e:
        return Response(f"Unexpected error: {e}", status=500)

@app.post("/user/<user_name>")
def get_user(user_name):
    print("this works")
    try:
        data = request.get_json()
        print(data)
        user = database.users.find_one({"user_name": user_name})
        returnData = []
    
        if not user:
            returnData.append(False)
            returnData.append("Invalid user")
            return json.dumps(returnData)
            
        password = data['user_password'].encode()
        hashPassword = hashlib.sha256(password)
        hashPassword = hashPassword.hexdigest()
        data["user_password"] = str(hashPassword)
        
        if user['user_password'] != data['user_password']:
            returnData.append(False)
            returnData.append("Incorrect Password")
            return json.dumps(returnData)
        
        user['_id'] = str(user['_id'])
        returnData.append(True)
        returnData.append({'user_name': user['user_name'], "user_email": user['user_email']})
        return json.dumps(returnData)

    except Exception as e:
        return Response(f"Unexpected error: {e}", status=500)


@app.get("/api/budgets/<user_name>")
def get_budgets(user_name):
    results = []
    cursor = database.budgets.find({"owner": user_name})

    for budget in cursor:
        budget["_id"] = str(budget["_id"])
        results.append(budget)
        
    print(results)
    return json.dumps(results)


@app.post("/api/budgets")
def save_budget():
    try:
        budget = request.get_json()

        # must have a title at least 3 chars long
        if not "title" in budget or len(budget["title"]) < 3:
            return abort(400, "Title is required and should have at least 3 chars")

        database.budgets.insert_one(budget)

        budget["_id"] = str(budget["_id"])

        print(budget)
        return json.dumps(budget)

    except Exception as e:
        return Response(f"Unexpected error: {e}", status=500)

@app.post('/api/recover-username')
def send_recovery():
    responseData = []
    data = request.get_json()
    user = database.users.find_one({"user_email": data['user_email']})
    
    if not user:
        responseData.append(False)
        responseData.append("Email not found...")
        return json.dumps(responseData)
    
    username = user['user_name']
    message = Mail(
        from_email ='finsternavy@gmail.com',
        to_emails = str(user['user_email']),
        subject='Financial Planner Account Recovery',
        html_content=f'<strong>Your username is: {username}</strong>'
    )
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        
        responseData.append(True)
        return json.dumps(responseData)
    
    except Exception as e:
        return Response(f"Unexpected error: {e}", status=500)
        
@app.post('/api/recover-password')
def send_password_recovery():
    recoverData = []
    data = request.get_json()
    user = database.users.find_one({"user_email": data['user_email']})
    
    if not user:
        recoverData.append(False)
        recoverData.append("The data you entered does not match our records...")
        return json.dumps(recoverData)
    
    if user['user_name'] != data['user_name']:
        recoverData.append(False)
        recoverData.append("The data you entered does not match our records...")
        return json.dumps(recoverData)
    
    # make a copy of the user to replace later
    update = user
    
    # change user's password to 'reset' encrypted.
    password = 'reset'.encode()
    hashPassword = hashlib.sha256(password)
    hashPassword = hashPassword.hexdigest()
    
    database.users.find_one_and_update({'user_name': data['user_name']}, { '$set': {'user_password': hashPassword}})
    
    message = Mail(
        from_email ='finsternavy@gmail.com',
        to_emails = str(user['user_email']),
        subject='Financial Planner Account Recovery',
        html_content=f'<strong>Your temporary password is: reset </strong>'
    )
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        
        recoverData.append(True)
        return json.dumps(recoverData)
    
    except Exception as e:
        return Response(f"Unexpected error: {e}", status=500)
        
        
@app.post('/api/reset-password')
def reset_password():
    recoverData = []
    
    data = request.get_json()
    
    password = data['temp_password'].encode()
    hashPassword = hashlib.sha256(password)
    hashPassword = hashPassword.hexdigest()
    data["temp_password"] = str(hashPassword)
    
    user = database.users.find_one({"user_password": hashPassword})
    
    if not user:
        recoverData.append(False)
        recoverData.append("Incorrect temporary password. Please verify and try again.")
        return json.dumps(recoverData)
    
    newPassword = data['new_password'].encode()
    hashNewPassword = hashlib.sha256(newPassword).hexdigest()
    
    
    database.users.find_one_and_update({"user_password": data['temp_password']}, { '$set' : {'user_password': hashNewPassword}})

    recoverData.append(True)
    return json.dumps(recoverData)


app.run(debug=True)