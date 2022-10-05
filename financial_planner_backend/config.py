import pymongo
import certifi
import os

# the string will be the link for the mongodb
connection_string = os.environ.get('SERVER_CONNECTION_STRING')

client = pymongo.MongoClient(connection_string, tlsCAFile=certifi.where())

# the name will be whatever we name the DB
database = client.get_database("FinancialPlannerDB")