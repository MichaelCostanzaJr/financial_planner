import json
from flask import Flask, Response, abort, request
# from mock_data import budgets
from config import database
from bson import ObjectId
from flask_cors import CORS

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
        print(data['user_name'])
        user = database.users.find_one({"user_name": user_name})
    
        if not user:
            return abort(400, "User not valid")
        
        if user['user_password'] != data['user_password']:
            return abort(400, "Incorrect password")
        
        user['_id'] = str(user['_id'])
        return json.dumps(user)

    except Exception as e:
        return Response(f"Unexpected error: {e}", status=500)

#get budgets from the database
@app.get("/api/budgets")
def get_budgets():
    results = []
    cursor = database.budgets.find({})

    for budget in cursor:
        budget["_id"] = str(budget["_id"])
        results.append(budget)
    return json.dumps(results)


# Add a budget to the database
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


        

        
        
    




app.run(debug=True)