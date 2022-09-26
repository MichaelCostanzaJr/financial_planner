import json
from flask import Flask, Response, abort, request
# from mock_data import budgets
from config import database
from bson import ObjectId
from flask_cors import CORS
import hashlib
import os
import math
import datetime
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
    count = 1
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
            if round(debt['current_principle_balance'], 2) > 0:
                print('current principle: ')
                print(round(debt['current_principle_balance'], 2))
                working = True
                
                monthly_interest = round(round(debt['current_principle_balance'], 2) * debt['monthly_interest_rate'], 2)
                print(monthly_interest)
                principle = round(debt['adjusted_payment'], 2) - round(monthly_interest, 2)
                print('monthly payment amount:')
                print(round(monthly_interest + principle, 2))
                print(principle) 
                principle = principle + snowball + overpayment
                overpayment = 0
                
                debt['total_principle_paid'] += round(principle, 2)
                debt['total_interest_paid_snowball'] += round(monthly_interest, 2)
                debt['current_principle_balance'] -= round(principle, 2)
                debt['total_paid'] += round(principle + monthly_interest, 2) 
                debt['current_principle_balance'] = round(debt['current_principle_balance'], 2)
                
                if round(debt['current_principle_balance'], 2) <= 0:
                    print(debt['current_principle_balance'])
                    overpayment = round(debt['current_principle_balance'], 2) * -1
                    debt['current_principle_balance'] = 0
                    debt['total_paid'] -= round(overpayment, 2)
                    debt['total_principle_paid'] -= round(overpayment, 2)
                    debt['total_principle_paid'] = round(debt['total_principle_paid'], 2)
                    debt['new_end_point'] = count
                    debt['total_interest_paid_snowball'] = round(debt['total_interest_paid_snowball'], 2)
                    debt['total_paid'] = round(debt['total_paid'], 2)
                    debt['total_principle_paid'] = round(debt['total_principle_paid'], 2)
                    returnData.append(debt)
                    print("A debt has been paid off after:")
                    print(count)
                    snowball = snowball + round(float(debt['expenseValue']), 2)
                    
        count = count + 1
        
    return json.dumps(returnData)
    
@app.post('/api/calculate-expense')
def calculate_expense():
    returnData = {}
    data = request.get_json()
    
    #  ********  Date conversions  *********
    # need front end to provide year, month, and day as a number
    # keys:  month = %m  year = %Y  
    
    start_date = datetime.datetime(data['loan_start_date_year'], data['loan_start_date_month'], data['loan_start_date_day'])
    today = datetime.datetime.now()
    today_years = int(today.strftime("%Y"))
    today_months = int(today.strftime("%m"))
    start_date_years = int(start_date.strftime("%Y"))
    start_date_months = int(start_date.strftime("%m"))
    
    paid_years = today_years - start_date_years
    paid_months = today_months - start_date_months
    
    if start_date_months > today_months or paid_months == 0:
        paid_years -= 1
        paid_months += 12
        
    total_paid_months = (paid_years * 12) + paid_months
    data['months_paid'] = total_paid_months
    data['months_to_paid'] = data['term'] - total_paid_months
    
    # convert apr to monthly interest
    monthly_interest_rate = (data['apr'] / 100) / 12
    data['monthly_interest_rate'] = monthly_interest_rate
    
    # compute interest utility
    i1 = math.pow(1 + monthly_interest_rate, data['term'])
    
    # compute monthly expense
    
    monthly_payment = data['financed_amount'] * ((monthly_interest_rate * i1) / (i1 - 1))
    
    data['adjusted_payment'] = round(monthly_payment, 2)
    
    # calculate payment already made info
    total_interest_paid = 0
    total_principle_paid = 0
    pay_off_value = 0
    
    for i in range(data['term']):
        print("starting financed amount")
        print(data['financed_amount'])
        monthly_payment_interest = round(data['financed_amount'], 2) * monthly_interest_rate
        monthly_payment_principle = round(data['adjusted_payment'], 2) - round(monthly_payment_interest, 2)
        
        total_interest_paid += round(monthly_payment_interest, 2)
        total_principle_paid += round( monthly_payment_principle, 2)
        
        data['financed_amount'] -= round(monthly_payment_principle, 2) 
        data['financed_amount'] = round(data['financed_amount'], 2)
        print("Ending financed amount")
        print(data['financed_amount'])
        pay_off_value += round(data['adjusted_payment'], 2)
    
    data['total_interest_at_min_payment'] = round(total_interest_paid, 2)
    data['pay_off_value'] = round(pay_off_value, 2)
    
    data['financed_amount'] = round(data['loan_amount'], 2)
    total_interest_paid = 0
    total_principle_paid = 0
    
    for i in range(total_paid_months):
        monthly_payment_interest = round(data['financed_amount'], 2) * monthly_interest_rate
        monthly_payment_principle = round(data['adjusted_payment'], 2) - round(monthly_payment_interest, 2)
        
        total_interest_paid += round(monthly_payment_interest, 2)
        total_principle_paid += round(monthly_payment_principle, 2)
        
        data['financed_amount'] -= round(monthly_payment_principle, 2) 
        data['financed_amount'] = round(data['financed_amount'], 2)

    data['total_principle_paid'] = round(total_principle_paid, 2)
    data['total_interest_paid_snowball'] = round(total_interest_paid, 2)
    data['current_principle_balance'] -= round(total_principle_paid, 2)
    data['current_principle_balance'] = round(data['current_principle_balance'], 2)
    data['total_paid'] += round(total_interest_paid + total_principle_paid, 2)
    data['financed_amount'] = round(data['loan_amount'], 2)
    
    if data['is_mortgage'] == 'yes':
        property_tax = round((data['property_tax'] / 12), 2)
        data['expenseValue'] = round(monthly_payment + data['insurance'] + data['mortgage_insurance'] + property_tax, 2)
    else:
        data['expenseValue'] = round(monthly_payment, 2)
        
    returnData = data
    return json.dumps(returnData)
        
    
@app.post('/api/update-expense')
def update_expense():
    responseData = []
    data = request.get_json()
    # data = request[1]
    index = 0
    debts = []
    
    
    for i, debt in enumerate(data):
        debts.append(debt)
    
    for debt in debts:
        if debt['expensePriority'] == '5':
            # ****** Local Variable setup  ********
            debt['debt_index'] = index
            index += 1
            debt['total_paid'] = 0
            
            #  ********  Date conversions  *********
            # need front end to provide year, month, and day as a number
            # keys:  month = %m  year = %Y  
            
            start_date = datetime.datetime(debt['loan_start_date_year'], debt['loan_start_date_month'], debt['loan_start_date_day'])
            today = datetime.datetime.now()
            today_years = int(today.strftime("%Y"))
            today_months = int(today.strftime("%m"))
            start_date_years = int(start_date.strftime("%Y"))
            start_date_months = int(start_date.strftime("%m"))
            
            paid_years = today_years - start_date_years
            paid_months = today_months - start_date_months
            
            if start_date_months > today_months or paid_months == 0:
                paid_years -= 1
                paid_months += 12
                
            total_paid_months = (paid_years * 12) + paid_months
            debt['months_paid'] = total_paid_months
            debt['months_to_paid'] = debt['term'] - total_paid_months
    
            monthly_interest_rate = debt['monthly_interest_rate']
            
            # compute interest utility
            i1 = math.pow(1 + monthly_interest_rate, debt['term'])
            
            # compute monthly expense
            
            monthly_payment = round(debt['financed_amount'] * ((monthly_interest_rate * i1) / (i1 -1)), 2)
            
            debt['adjusted_payment'] = round(monthly_payment, 2)
            
            # calculate payment already made info
            total_interest_paid = 0
            total_principle_paid = 0
            
            for i in range(total_paid_months):
                monthly_payment_interest = debt['financed_amount'] * monthly_interest_rate
                monthly_payment_principle = monthly_payment - monthly_payment_interest
                
                total_interest_paid += monthly_payment_interest
                total_principle_paid += monthly_payment_principle
                
                debt['financed_amount'] -= monthly_payment_principle 

            debt['total_principle_paid'] = round(total_principle_paid, 2)
            debt['todays_principle'] = round(debt['financed_amount'], 2)
            debt['total_interest_paid_snowball'] = round(total_interest_paid, 2)
            debt['current_principle_balance'] = round(debt['financed_amount'], 2)
            debt['total_paid'] += round(total_interest_paid + total_principle_paid, 2)
            debt['financed_amount'] = round(debt['loan_amount'], 2)
            
            if debt['is_mortgage'] == 'yes':
                property_tax = round((debt['property_tax'] / 12), 2)
                debt['expenseValue'] = round(monthly_payment + debt['insurance'] + debt['mortgage_insurance'] + property_tax, 2)
            else:
                debt['expenseValue'] = round(monthly_payment, 2)
    
    for i in range(1, len(debts)):
        if debts[i - 1]['months_to_paid'] > debts[i]['months_to_paid']:
            temp = debts[i]
            debts[i] = debts[i - 1]
            debts[i - 1] = temp
    responseData = debts
    return json.dumps(responseData)
            
    
    
    
        
        
    
    

app.run(debug=True)