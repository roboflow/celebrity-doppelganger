print("INIT DOPPELGANGER SERVICE")

from flask import Flask, request, jsonify
import tempfile
import os

app = Flask(__name__)

@app.route('/')
def index():
    return "Ok."

@app.route("/python/go", methods=["POST"])
def go():

    print("=====================")
    print("DOPPELGANGER REQUEST STARTED")
    print("=====================")

    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
