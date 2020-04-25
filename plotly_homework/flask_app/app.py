# 1. import Flask
import os
from flask import Flask, render_template, json, jsonify, current_app as app

# 2. Create an app, being sure to pass __name__
app = Flask(__name__)

list = [1, 2, 3]
# 3. Define what to do when a user hits the index route
@app.route("/")
def home():
    filename = os.path.join('static', 'samples.json')

    with open(filename) as test_file:
        data = json.load(test_file)

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)



