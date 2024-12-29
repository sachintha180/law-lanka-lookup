from flask import Flask, render_template
from data import features

app = Flask(__name__)


@app.route("/")
def landing():
    return render_template("landing.html", features=features)


if __name__ == "__main__":
    app.run(debug=True)
