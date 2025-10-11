from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

@app.route("/", methods=['POST', 'GET'])
def home():
    return render_template('index.html')

@app.route("/pre_dashboard", methods=['POST', 'GET'])
def pre_dashboard():
    return render_template('pre_dashboard.html')


@app.route("/post_dashboard", methods=['POST', 'GET'])
def post_dashboard():
    return render_template('post_dashboard.html')


@app.route("/farmers_market", methods=['POST', 'GET'])
def farmers_market():
    return render_template('farmers_market.html')


@app.route("/insurance_page", methods=['POST', 'GET'])
def insurance_page():
    return render_template('insurance_page.html')


@app.route("/vision", methods=['POST', 'GET'])
def vision():
    return render_template('vision.html')

@app.route("/account", methods=['POST', 'GET'])
def account():
    return render_template('account.html')

if __name__ == "__main__":
    app.run(debug=True)