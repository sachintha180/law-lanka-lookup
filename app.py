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


@app.route("/dashboard")
def dashboard():
    return render_template(
        "dashboard.html",
        user={
            "first_name": "Sachintha",
            "name": "Sachintha Senanayake",
            "email": "sachintha@gmail.com",
            "expertise": "Conveyancer",
        },
        latest_reads=[
            {
                "name": "Document 1",
                "type": "pdf",
                "date": "2021-01-01",
            },
            {
                "name": "Document 2",
                "type": "pdf",
                "date": "2021-01-02",
            },
            {
                "name": "Document 3",
                "type": "docx",
                "date": "2021-01-03",
            },
            {
                "name": "Document 4",
                "type": "docx",
                "date": "2021-01-04",
            },
        ],
        last_online=[
            {
                "name": "Alice",
                "expertise": "Lawyer",
                "last_online": "2021-01-01",
            },
            {
                "name": "Bob",
                "expertise": "Litigator",
                "last_online": "2021-01-02",
            },
            {
                "name": "Charlie",
                "expertise": "Conveyancer",
                "last_online": "2021-01-03",
            },
            {
                "name": "David",
                "expertise": "Lawyer",
                "last_online": "2021-01-04",
            },
        ],
    )


if __name__ == "__main__":
    app.run(debug=True)
