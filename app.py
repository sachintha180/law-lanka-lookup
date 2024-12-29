from flask import Flask, render_template
from data import features

app = Flask(__name__)


@app.route("/")
def landing():
    return render_template("landing.html", features=features)


@app.route("/register")
def register():
    return render_template("register.html")


@app.route("/login")
def login():
    return render_template("login.html")


if __name__ == "__main__":
    app.run(debug=True)
