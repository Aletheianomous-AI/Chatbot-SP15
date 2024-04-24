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


class ChatData():
   
    def create_new_conversation(self, conversation_title=None):
        """This function creates a new conversation record in
            the SQL database.

            PARAMETERS
            conversation_title - The title of the conversation
                record to create.
        """

        try:
            record_check_query = """
                SELECT COUNT(*) FROM dbo.Conversation
                WHERE UserID = ?;
            """
            cursor = self.conn.cursor()
            cursor.execute(record_check_query, self.userId)
            record_count = cursor.fetchall()
            record_count = int(record_count[0][0])
            if conversation_title is None:
                conversation_title = "New Chat #" + str(record_count + 1)
        
            new_conv_query = """
                INSERT INTO dbo.Conversation (ConversationName, UserID)
                VALUES (?, ?);
            """
            cursor.execute(new_conv_query, conversation_title, self.userId)
            cursor.commit()
        except Exception as e:
            raise RequestFailureException("Could not create new conversation. Exception details: " + str(e))

        try:
            get_new_convId_query = """
                SELECT ConversationID FROM dbo.Conversation
                WHERE ConversationName = ?
                AND UserID = ?;
            """
            cursor.execute(get_new_convId_query, conversation_title, self.userId)
            new_conv_id = cursor.fetchall()
            new_conv_id = new_conv_id[0][0]
            del cursor
        except Exception as e:
            raise RequestFailureException("Could not get conversation ID of newly created conversation from database server. Exception details: " + str(e))
        return new_conv_id

    def rename_conversation_title(self, conversation_id, new_title):
        """This function renames the conversation title by conversation
        id.

        PARAMETERS
        conversation_id - The Conversation_id to rename
        new_title - The new chat title.
        """
        rename_query = """
        UPDATE dbo.Conversation
        SET ConversationName = ?
        WHERE ConversationID = ?
        """

        try:
            cursor = self.conn.cursor()
            cursor.execute(rename_query, new_title, conversation_id)
            cursor.commit()
        except Exception as e:
            raise RequestFailureException("Could not rename conversation title of conversation ID " + str(conversation_id) + ". Exception details: " + str(e))

    def upload_citations(self, response_chat_id, citations_list):
        """This function uploads citations related to this response_chat_id.

            PARAMETERS
            response_chat_id - The chat id that the citation(s) belongs to.
            citations_list - A list of citations to upload.
        """
        try:
            citation_list_append_qry = """
                 DECLARE @CitationID int;
                 IF EXISTS (SELECT * FROM dbo.Citation WHERE Link = ?)
                    BEGIN
                        SELECT @CitationID = Citation_ID
                        FROM dbo.Citation WHERE Link = ?;
                    END
                ELSE
                    BEGIN
                        SELECT @CitationID = (MAX(Citation_ID) + 1)
                        FROM dbo.Citation;
                            IF (@CitationID IS NULL)
                                BEGIN
                                    SET @CitationID = 1;
                                END
                        INSERT INTO dbo.Citation (Citation_ID, Link)
                        VALUES (@CitationID, ?)
                    END

                DECLARE @SurrogateKey int;
                SELECT @SurrogateKey = (MAX(Surrogate_Key) + 1)
                FROM dbo.Citation_Chat_History;

                IF (@SurrogateKey IS NULL)
                    BEGIN
                        SET @SurrogateKey = 1;
                    END

                INSERT INTO dbo.Citation_Chat_History (Surrogate_Key, Chat_ID, Citation_ID)
                VALUES (@SurrogateKey, ?, @CitationID);
            """

            self.conn.autocommit= False
            for citation in citations_list:
                cursor = self.conn.cursor()
                print(citation)
                cursor.execute(citation_list_append_qry, citation, citation, citation, response_chat_id)
                cursor.commit()
                del cursor
            self.conn.autocommit= True
        except Exception as e:
            raise RequestFailureException("The message could not be delivered. Exception details: " + str(e))

    def get_citations_by_chat_id(self, chat_id):
        query = """
            SELECT ci.Citation_ID, cch.Chat_ID, ci.Link
            FROM dbo.Citation as ci
            INNER JOIN
                dbo.Citation_Chat_History as cch
                ON ci.Citation_ID = cch.Citation_ID
            WHERE cch.Chat_ID = ?
            ORDER BY ci.Citation_ID
        """
        cursor = self.conn.cursor()
        cursor.execute(query, chat_id)
        citations = cursor.fetchall()
        if citations is not None:
            processed_citations = []
            for row in citations:
                processed_citations.append(row[2])
            citations = processed_citations
        del cursor
        return citations


    def connect(self):
        self.con_str = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={self.server};DATABASE={self.db_name};UID={self.uname};PWD={self.passwrd}'
    
        connection_successful: bool = False
        con_attempts: int = 0
    
        
        while (connection_successful == False) and (con_attempts < 5):
            try:    
                self.conn = pyodbc.connect(self.con_str)
                
            except Exception as e:
                print(e)
                if con_attempts >=5:
                    raise ConnectionFailureException("Sorry, your chat could not be sent.")
                else:
                    delay_time = [1,5,10,30,60]
                    time.sleep(delay_time[con_attempts])
            con_attempts+=1

    def close_conn(self):
        self.conn.close()
        self.conn = None
    
    def __init__(self, userId):
    
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

    def get_chat_by_cid(self, chat_id):
        """Returns the chat history by chat id.
        PARAMETER
        chat_id - The chat ID to return.
        """
        cursor = self.conn.cursor()

        query = """
            SELECT *
            FROM dbo.Chat_History
            WHERE Chat_ID = ? 
            ORDER BY Chat_ID DESC
        """
        cursor.execute(query, chat_id)
        row = cursor.fetchone()
        del cursor
        if row is not None:
            return row
        else:
            return RecordNotFoundException("No records with chat_id " + chat_id + " found in the database.")
        
            
    
        
    
    
    def log_chat(self, chat_data, timestamp, conversation_id, is_from_bot):
        """Uploads the chat data to the SQL database.
    
            PARAMETERS:
            chat_data - The chat to upload.
            timestamp - The data which the chat is generated.
            is_from_bot - If true, the chat is from the AI chatbot. 
            Otherwise, the chat is from the AI.
            conversation_id - The ID of the conversation to upload chat to.
        """
       
        chat_data = chat_data.replace("'", "''")
        print("Parsed chat data: " + chat_data)

        timestamp = timestamp.astimezone(timezone('America/New_York'))
        timestamp = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        print(timestamp)

        if is_from_bot:
            is_from_bot_int: int = 1
        else:
            is_from_bot_int: int = 0

        # CREATE SQL QUERY THAT UPLOADS CHAT DATA.
        upload_query = ("""
            DECLARE @ChatID int;
    		SELECT @ChatID = (MAX(Chat_ID) + 1)
            FROM dbo.Chat_History;
            INSERT INTO dbo.Chat_History (Chat_ID, Chat_Content, Belongs_To_Bot, Time_Of_Output)
            VALUES (@ChatID, ?, ?, ?);
            INSERT INTO dbo.Chat_Conversation (Chat_ID, UserID, Conversation_ID) VALUES (@ChatID, ?, ?);
        """
        )
        self.conn.autocommit = False
        cursor = self.conn.cursor()
        cursor.execute(upload_query, chat_data, str(is_from_bot_int), timestamp, self.userId, conversation_id)
        self.conn.commit()
        self.conn.autocommit = True
        del cursor

        cursor = self.conn.cursor()
        chat_id_qry = ("""
            SELECT MAX(Chat_ID) FROM dbo.Chat_History;
        """
        )
        cursor.execute(chat_id_qry)
        chat_id = cursor.fetchall()
        chat_id = chat_id[0][0]
        print("Uploaded chat as chat_id " + str(chat_id))
        return chat_id
    
    def return_chat_history(self):
        conversations_query = """
            SELECT *
            FROM dbo.Conversation
            WHERE UserID = ?
            ORDER BY ConversationID;
        """


        cursor = self.conn.cursor()
        cursor.execute(conversations_query, self.userId)
        conversations_list = cursor.fetchall()
        conversations_ls_json = []
        # Create conversations json list.
        for row in conversations_list:
            conversation_dict = {}
            conversation_dict['conversation_title'] = row[1]
            conversation_dict['messages'] = []
            conversation_dict['conversation_id'] = row[0]
            conversations_ls_json.append(conversation_dict.copy())


        print(conversations_ls_json)
        fetching_query = """
        SELECT ch.chat_ID, ch.Chat_Content, ch.Belongs_To_Bot, ch.Time_Of_Output, conv.ConversationName, cc.Conversation_ID, conv.UserID
        FROM
            dbo.Chat_History as ch
        JOIN
            dbo.Chat_Conversation cc ON ch.Chat_ID = cc.Chat_ID
        JOIN
            dbo.Conversation conv ON cc.Conversation_ID = conv.ConversationID
        WHERE
            conv.UserID = ?
        ORDER BY ch.chat_ID
        """
        cursor.execute(fetching_query, self.userId)
        chat_hist = cursor.fetchall()
        for row in chat_hist:
            conversation_id = row[5] # Get id to index conversations_ls_json object.
            message_dict = {'time_in_edt': row[3].strftime("%m/%d/%Y, %I:%M:%S %p"), 'content': row[1], 'is_from_bot': row[2]}
            citations = self.get_citations_by_chat_id(row[0]) 
            if citations is not None:
                message_dict['citations'] = citations
            else:
                message_dict['citations'] = None
            conversations_ls_json[conversation_id-1]['messages'].append(message_dict) ## Append messages list in
                #converations_ls_json element.
        del cursor
        return conversations_ls_json
