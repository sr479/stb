# -*- coding: utf-8 -*-
from flask import Flask, request, Response
import requests

app = Flask(__name__)
BASE_URL = "http://222.221.25.243:6166/"

@app.before_request
def before_request():
    request_url = BASE_URL + request.url.split("/")[3]
    r = requests.get(request_url)
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-type":"application/json"
        }
    return Response(r.text, mimetype='application/json', headers=headers)

if __name__ == "__main__":
    app.run(port=5000, debug=True)