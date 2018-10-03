from flask import (
    Flask,
    render_template,
    redirect,
    jsonify)

import pandas as pd
import numpy as np
import requests as requests
from pprint import pprint
from itertools import islice
from flask_pymongo import PyMongo
from config import password
from pymongo import MongoClient
import json

app = Flask(__name__)

app.config["MONGO_URI"] = f"mongodb://Brian:{password}@ds011281.mlab.com:11281/uprooted_db"
# client = pymongo.MongoClient(conn)
mongo = PyMongo(app)

@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route("/refugees_origin_destination/<ocode>")
def refugees_origin_destination(ocode):
    """Info on countries related to the country of origin"""
    collection = mongo.db.refugees_coo_cod

    keyCountries = collection.find({ocode: {'$exists':True}})
    return_array = list(keyCountries)
    del return_array[0]['_id']
    print(return_array)

    return jsonify(return_array[0])

if __name__=='__main__':
    app.run(debug=True)