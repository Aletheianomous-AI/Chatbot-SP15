from .SQLDatabaseWrapper import SQLDatabaseWrapper as sdw
from .chat_data_module import ChatData as cd
from.mfa_mailer import MFAMailer
from datetime import datetime as dt
from secrets import randbelow

import os
import pyodbc

class UserAccountManagement(sdw):

        def __init__(self, userId=None):
                super().__init__(userId)


        def update_light_theme(self, use_light_theme: bool):
                """This function updates the light theme setting for the user."""
                query = """
                UPDATE dbo.Setting
                SET Use_Light_Theme = ?
                WHERE UserID = ?
                """
                cursor = self.conn.cursor()
                if use_light_theme:
                        use_light_theme_bit = 1
                else:
                        use_light_theme_bit = 0
                cursor.execute(query, use_light_theme_bit, self.userId)

        def set_share_conv_for_training(self, share_conv_for_training: bool):
                """This function sets the 'Share_Conversation_For_Training' attribute in the 
                'Setting' SQL database table, which describes whether the user wants to
                share chat data to train new AI models."""

                query = """
                UPDATE dbo.Setting
                SET Share_Conversation_For_Training = ?
                WHERE UserID = ?
                """
                cursor = self.conn.cursor()
                if share_conv_for_training:
                        share_conv_for_tr_bit = 1
                else:
                       share_conv_for_tr_bit = 0
                cursor.execute(query, share_conv_for_tr_bit, self.userId)

        def get_user_info(self):
                """This function returns user info"""

                query = """
                        SELECT UserName, Email, DOB
                        FROM dbo.Login
                        WHERE UserID = ?;
                """
                cursor = self.conn.cursor()
                cursor.execute(query, self.userId)
                results = cursor.fetchall()
                results = results[0]
                return {'userName': results[0], 'email': results[1], 'dob': results[2]}

        def set_user_name(self, new_username: str):
                """This function updates the username."""

                query = """
                        UPDATE dbo.Login
                        SET UserName = ?
                        WHERE UserID = ?
                """
                cursor = self.conn.cursor()
                cursor.exeucte(query, new_username, self.userId)
                
                
        def set_email(self, new_email: str):
                """This function updates the email"""

                query = """
                        UPDATE dbo.Login
                        SET Email = ?
                        WHERE UserID = ?
                """

                cursor = self.conn.cursor()
                cursor.execute(query, new_email, self.userId)

        def set_DOB(self, new_dob: dt):

                query = """

                DECLARE @userid INT = ?;
                DECLARE @dob DATE = ?;
                UPDATE dbo.Login
                SET DOB = @dob
                WHERE UserID = @userid;

                UPDATE dbo.Login
                SET Age = DATEDIFF(YEAR, @dob, GETDATE())
                WHERE UserID = @userid;
                """

                cursor = self.conn.cursor()
                cursor.execute(query, self.userId, new_dob.strftime("%Y-%m-%d"))

        def update_passwrd(self, old_pass: str, new_pass: str):
                query = """
                        DECLARE @OldPassword VARCHAR(MAX);
                        DECLARE @SuccessValue INT = 1;
                        DECLARE @user_id INT = ?;

                        IF EXISTS (SELECT *
                        	FROM dbo.Login
                        	WHERE UserID = @user_id
                        	AND Password = CAST(? AS VARCHAR(MAX)))
                        	BEGIN
                        		UPDATE dbo.Login
                        		SET Password = CAST(? AS VARBINARY(MAX))
                        		WHERE UserID = @user_id;
                        		SELECT @SuccessValue;
                        	END
                        ELSE
                        	BEGIN
                        		SELECT @@ERROR;
                        	END

                """

                cursor = self.conn.cursor()
                cursor.execute(query, self.userId, old_pass, new_pass)
                result = cursor.fetchall()
                result = [0][0]
                if result == 1:
                        pass
                elif result == 0:
                        raise ValueError("Your old password is not correct. Please try again.")
                else:
                        raise ValueError("Returned an invalid value of '" + str(result) + "'.")

        def create_user(self, userName, dob, email, password, share_conv_for_training = False):
                """Creates a new user profile in the database."""

                if share_conv_for_training is False:
                        share_conv_for_tr_int = 0
                else:
                        share_conv_for_tr_int = 1

                query = """
                        DECLARE @dob DATE = ?;
                        DECLARE @age int = DATEDIFF(Year, @dob, GETDATE());
                        DECLARE @newUID int;
                        DECLARE @email VARCHAR(255) = ?;
                        DECLARE @username VARCHAR(255) = ?;
                        DECLARE @ERRORVAL int = -1;
                        
                        SELECT @newUID = MAX(UserID + 1)
                        FROM dbo.Login;
                        IF NOT EXISTS (SELECT * FROM dbo.Login WHERE Email = @email AND UserName = @username)
                            BEGIN
                                INSERT INTO dbo.Login (UserID, Email, Age, Password, DOB, UserName)
                                VALUES (@newUID, @email, @age, CAST(? AS VARBINARY(MAX)), @dob, @username);
                        
                        
                                INSERT INTO dbo.setting (UserID, Use_Light_Theme, Share_Conversation_For_Training)
                                VALUES (@newUID, 1, ?);
                        
                                SELECT @newUID;
                            END
                        ELSE
                            BEGIN
                                SELECT @ERRORVAL;
                            END


                """
                cursor = self.conn.cursor()
                cursor.execute(query, dob, email, userName, password, share_conv_for_tr_int)
                results = cursor.fetchall()
                results = results[0][0]
                if results > 0:
                        self.userId = results
                else:
                        raise AssertionError("'" + email + "' has been taken. Please use a different address.")
                
        def login_user(self, email, password):
            """This function logins the user by verifying their email and password."""
            query = """
                DECLARE @email VARCHAR(MAX) = ?;
                DECLARE @password VARCHAR(MAX) = ?;

                IF EXISTS (SELECT * FROM dbo.LOGIN WHERE Email=@email AND Password= CAST(@password AS VARBINARY(MAX)))
                    BEGIN
                        SELECT UserID FROM dbo.LOGIN WHERE Email=@email AND Password= CAST(@password AS VARBINARY(MAX));
                    END
                ELSE
                    BEGIN
                        SELECT -1;
                    END
            """
            cursor = self.conn.cursor()
            cursor.execute(query, email, password)
            results = cursor.fetchall()
            results = results[0][0]
            if results > 0:
                self.userId = results
            else:
                raise ValueError("The username and/or password are incorrect.")


                
        def generate_2fa_code(self, flask_app):
                """This function generates a six digit authentication code for the user,
                    uploads the code into the SQL 2FA Email table,
                    and sends the email to the user containing the code.
                """
                code = randbelow(1000000)
                query = """
                DECLARE @AuthCode INT = ?;
                DECLARE @userID INT = ?;

                IF EXISTS(SELECT UserID FROM dbo.Email2FA WHERE UserID = @userID)
                    BEGIN
                        UPDATE dbo.Email2FA
                        SET EncryptedAuthCode = dbo.Encrypt2String(@AuthCode)
                        WHERE UserID = @userID;
                    END
                ELSE
                    BEGIN
                        INSERT INTO dbo.Email2FA (UserID, EncryptedAuthCode)
                        VALUES (@userID, dbo.Encrypt2String(@AuthCode));
                    END
                """

                cursor = self.conn.cursor()
                cursor.execute(query, code, self.userId)
                mailer = MFAMailer(self.userId, flask_app)
                mailer.sendCode(code)
                mailer.conn.close()
                return code
        
        def verify_2fa_code(self, code):
            """This function verifies the six-digit verification code and deletes
            code from database record.
            """

            query = """
            DECLARE @AuthCode INT = ?;
            DECLARE @userID INT = ?;

            IF EXISTS(SELECT UserID FROM dbo.Email2FA WHERE userID = @userID AND EncryptedAuthCode = dbo.Encrypt2String(@AuthCode))
                BEGIN
                    DELETE FROM dbo.Email2FA
                    WHERE UserID = @userID;
                    SELECT 1;
                END
            ELSE
                BEGIN
                    SELECT -1;
                END
            """

            cursor = self.conn.cursor()
            cursor.execute(query, code, self.userId)
            status = cursor.fetchall()
            status = status[0][0]
            if status == 1:
                return True
            elif status == -1:
                return False
            else:
                raise AssertionError("Got invalid DB status code " + str(status) + " while authenticating verification code.")
            
            

       
        
        
        def delete_user(self):
                """This function deletes the user's account."""

                
                chat_data = cd(self.userId)
                chat_data.delete_entire_chat()
                chat_data.conn.close()
                query = """
                        DECLARE @userId = ?

                        DELETE FROM dbo.Setting
                        WHERE UserID = @userid;

                        DELETE FROM dbo.Login
                        WHERE UserID = @userid;
                """

                cursor = self.conn.cursor()
                cursor.execute(query, self.userId)
                
        
        def user_exists(conn, userId):
            """Returns whether user exists in the database.
            
            PARAMETERS
            conn - The pyodbc connection object that is connected to SQL database
            userId - The userId to check if it exists.
            """
            query = """ SELECT COUNT(*)
            FROM dbo.Login
            WHERE UserID = '""" + str(userId) + """'
            """
            cursor = conn.cursor()
            cursor.execute(query)
            count = cursor.fetchall()
            count = count[0]
            count = list(count)
            count = count[0]
            if count == 0:
                return False
            elif count == 1:
                return True
            else:
                raise AssertionError("Expected user count to be 1 but got " + str(count))
