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
    # need to modify to make sure the active user matches the owner of the budget
    try:
        budget = request.get_json()
        response = []
        old_budget = database.budgets.find_one({"title": budget['title']})
        
        if not old_budget:
            
            if not budget['title']:
                response.append(False)
                response.append("ERROR! Budget must have a title")
                return json.dumps(response)
                
            database.budgets.insert_one(budget)
            response.append(True)
            response.append('New budget posted.')
            return json.dumps(response)
        
        database.budgets.find_one_and_delete({"title": budget['title']})
        database.budgets.insert_one(budget)
        
        message = "Budget has been updated successfully!"
        response.append(True)
        response.append(message)
        return json.dumps(message)
        
    except Exception as e:
        return Response(f"Unexpected error: {e}", status=500) 


@app.post('/api/budget/delete/<user_name>')
def delete_budget(user_name):
    try:
        data = request.get_json()
        response = []
        
        print(data)
        cursor = database.budgets.find({"title": data['title']})
        if not cursor:
            response.append(False)
            response.append("Budget does not exist")
            return json.dumps(response)
        
        found = False
        print(data['title'])
        for budget in cursor:
            print(budget['owner'])
            if budget['owner'] == data['owner']:
                found = True
                # database.budgets.delete_one({'title':data['tile'], 'owner':data['owner']})
        
        if not found:
            response.append(False)
            response.append("You are not the owner of this budget")
            return json.dumps(response)
            
        database.budgets.delete_one({'title':data['title'], 'owner':data['owner']})
        
        response.append(True)
        response.append("Budget deleted successfully!")
        
        return json.dumps(response)
        
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

@app.post('/api/debt-snowball')
def debt_snowball():
    
    returnData = []
    data = request.get_json()
    # print(data)
    working = True
    count = 0
    snowball = data[0]
    print(data)
    overpayment = 0
    debts = []
    
    for i, debt in enumerate(data):
        if i != 0:
            debts.append(debt)
    
    while working:
        working = False
        for debt in debts:
            if debt['current_principle_balance'] > 0:
                working = True
                
                monthly_interest = debt['adjusted_payment'] * (debt['apr'] / 12)
                principle = debt['adjusted_payment'] - monthly_interest
                principle = principle + snowball + overpayment
                overpayment = 0
                debt['current_principle_balance'] -= principle
                debt['total_payments_made'] += debt['expenseValue']
                # debt['current_principle_balance'] = debt['total_payments_made']
                
                if debt['current_principle_balance'] <= 0:
                    print(snowball)
                    overpayment = debt['current_principle_balance'] * -1
                    print('overpayment value')
                    print(overpayment)
                    debt['current_principle_balance'] = 0
                    debt['total_payments_made'] -= overpayment
                    debt['new_end_point'] = count
                    # debt['months_to_paid'] = count
                    returnData.append(debt)
                    print("A debt has been paid off after:")
                    print(count)
                    snowball = snowball + float(debt['expenseValue'])
    
        count = count + 1
        
    return json.dumps(returnData)
    

app.run(debug=True)