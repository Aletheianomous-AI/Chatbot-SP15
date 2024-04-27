from pytz import timezone
from .ConnectionFailureException import ConnectionFailureException
from .RecordNotFoundException import RecordNotFoundException
from .NonExistentUserException import NonExistentUserException
from .RequestFailureException import RequestFailureException
from .user_account_management import UserAccountManagement

import os
import time
import pyodbc
import pandas as pd


class SQLDatabaseWrapper():

    """This class is used to wrap the Pyodbc object and connects to 
        the Aletheianomous AI database server.
    """


    def connect(self):
        """This function connects to the server."""
        self.con_str = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={self.server};DATABASE={self.db_name};UID={self.uname};PWD={self.passwrd}'
    
        connection_successful: bool = False
        con_attempts: int = 0
    
        
        while (connection_successful == False) and (con_attempts < 5):
            try:    
                self.conn = pyodbc.connect(self.con_str)
                
            except Exception as e:
                print(e)
                if con_attempts >=5:
                    raise ConnectionFailureException("Could not connect to the SQL database server. Please make sure the database server is online and the " + 
                        "IP address of the frontend Flask server has been authorized to connect.")
                else:
                    delay_time = [1,5,10,30,60]
                    time.sleep(delay_time[con_attempts])
            con_attempts+=1

    def close_conn(self):
        """This function closes the server connection."""
        self.conn.close()
        self.conn = None
    
    def __init__(self, userId):
        """This function intializes the SQLDatabaseWrapper object."""
    
        self.server = os.environ.get('ALETHEIANOMOUS_AI_SERVER')
        self.db_name = os.environ.get('ALETHEIANOMOUS_AI_DB_NAME')
        self.uname = os.environ.get('ALETHEIANOMOUS_AI_UNAME')
        self.passwrd = os.environ.get('ALETHEIANOMOUS_AI_PASSWRD')
        self.conn = None
        self.connect()
        self.userId = userId
        if UserAccountManagement.user_exists(self.conn, userId):
            self.userId = userId
        else:
            raise NonExistentUserException(userId)

