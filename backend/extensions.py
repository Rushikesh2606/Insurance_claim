from flask_cors import CORS
from pymongo import MongoClient
import os

cors   = CORS()
mongo  = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/InsuranceClaimDB"))
db = mongo.get_database()