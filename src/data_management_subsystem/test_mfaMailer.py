from flask import Flask
from flask_mail import Mail, Message

import os

flask_app = Flask(__name__)
flask_app.config['MAIL_SERVER'] = os.environ.get("MFA_Mail_Server")
flask_app.config['MAIL_PORT'] = os.environ.get("MFA_Mail_Port")
if flask_app.config['MAIL_SERVER'] is None:
            raise AssertionError("Could not get MFA_Mail_Server environment variable. Please ensure that the environment variables are set up on the frontend server.")
flask_app.config['MAIL_USERNAME'] = os.environ.get("MFA_Test_Mail_Uname")
flask_app.config['MAIL_PASSWORD'] = os.environ.get("MFA_Test_Mail_Password")
flask_app.config['MAIL_USE_TLS'] = True
flask_app.config['MAIL_USE_SSL'] = False

mail = Mail(flask_app)

email_addr = "david.e.chavarro@outlook.com"
username="Mike"
code=123456
code_exp_time_str = "4/27/2024 2:53 PM"


if __name__ == "__main__":
    with flask_app.app_context():
        msg = Message(subject="Your Authentication Code for Signing Into Aletheianomous AI", sender="aletheianomous-ai@demomailtrap.com", recipients=[email_addr])
        msg.body = ("Hello " + username + ",\nYour authentication code is " + str(code) + ".It will expire on " + 
            code_exp_time_str + ".\nPlease DO NOT SHARE this code with anyone. Aletheianomous AI will never ask for your six-digit code.\n" + 
            "If you were not signing in, you can safely ignore this email.\n\nBest regards,\nAletheianomous AI")
        html_msg = ("""
        <p>Hello """ + username + """,<br>
        Your authentication code is <b>""" + str(code)+ """</b>. It will expire on <b>""" + code_exp_time_str+ """</b>.<br>
        Please <b>DO NOT SHARE</b> this code with anyone. Aletheianomous AI will never ask for your six-digit code.<br>
        If you were not signing in, you can safely ignore this email. <br><br>Best regards,<br> Aletheianomous AI</p>
        """
        )
        msg.html = (html_msg)
        mail.send(msg)