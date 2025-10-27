from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from routes import auth_bp
from routes.claims import claims_bp   # <-- import blueprint
from routes.claims_routes import claims_bp

app = Flask(__name__)

# config
app.config["MONGO_URI"] = "mongodb://localhost:27017/InsuranceClaimDB"

# initialise extensions
mongo = PyMongo(app)
cors  = CORS(app)

# expose DB globally (if you still want the shortcut)
app.db = mongo.db

# register blueprints
app.register_blueprint(auth_bp)

app.register_blueprint(claims_bp, url_prefix="/api")

@app.get('/')
def index():
    return {"message": "Insurance Claim System API running"}

if __name__ == '__main__':
    app.run(debug=True)