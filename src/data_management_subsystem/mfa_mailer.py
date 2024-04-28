from .SQLDatabaseWrapper import SQLDatabaseWrapper as sdw
from datetime import datetime as dt, timedelta as td
from flask_mail import Mail, Message

import os
import pyodbc

class MFAMailer(sdw):

    def __init__(self, userID, flask_app, test_mode=False):
        super().__init__(userID)
        self.flask_app = flask_app
        self.flask_app.config['MAIL_SERVER'] = os.environ.get("MFA_Mail_Server")
        self.flask_app.config['MAIL_PORT'] = os.environ.get("MFA_Mail_Port")
        self.test_mode = test_mode
        if self.flask_app.config['MAIL_SERVER'] is None:
            raise AssertionError("Could not get MFA_Mail_Server environment variable. Please ensure that the environment variables are set up on the frontend server.")
        if self.test_mode:
            self.flask_app.config['MAIL_USERNAME'] = os.environ.get("MFA_Test_Mail_Uname")
            self.flask_app.config['MAIL_PASSWORD'] = os.environ.get("MFA_Test_Mail_Password")
        else:
            self.flask_app.config['MAIL_USERNAME'] = os.environ.get("MFA_Mail_Uname")
            self.flask_app.config['MAIL_PASSWORD'] = os.environ.get("MFA_Mail_Password")
        self.flask_app.config['MAIL_USE_TLS'] = True
        self.flask_app.config['MAIL_USE_SSL'] = False
        self.mail = Mail(self.flask_app)
        print("Mail Server:", self.flask_app.config['MAIL_SERVER'])
        print("Mail port: ", self.flask_app.config['MAIL_PORT'])
        print("Mail Username: ", self.flask_app.config['MAIL_USERNAME'])
        print("Mail Password: ", self.flask_app.config['MAIL_PASSWORD'])



    def send_code(self, code):
        now = dt.now()
        code_exp_time = now + td(minutes=10)
        code_exp_time_str = code_exp_time.strftime("%m/%d/%Y, %I:%M:%S %p US Eastern Time")
        if self.test_mode is False:
            query = """
            SELECT Email, UserName
            FROM dbo.Login
            WHERE UserID = ?
            """

            cursor = self.conn.cursor()
            cursor.execute(query, self.userID)
            result = cursor.fetchall()
            email_addr = result[0][0]
            username = result[0][1]
        else:
            email_addr = "david.e.chavarro@outlook.com"
            username = "David Chavarro"
            print("WARNING: MFAMailer is in test mode, so the email will not be sent to the user " +
                  "that is associated with the account.")
        print("Sending auth code to " + email_addr + "...")

        with self.flask_app.app_context():
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
            self.mail.send(msg)
        


