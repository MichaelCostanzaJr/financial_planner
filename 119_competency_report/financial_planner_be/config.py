import pymongo
import certifi

# the string will be the link for the mongodb
connection_string = "mongodb+srv://costanza:OUgzQ1c7RkqcNEpG@financialplannerdb.azlh9n9.mongodb.net/?retryWrites=true&w=majority"

client = pymongo.MongoClient(connection_string, tlsCAFile=certifi.where())

# the name will be whatever we name the DB
database = client.get_database("FinancialPlannerDB")