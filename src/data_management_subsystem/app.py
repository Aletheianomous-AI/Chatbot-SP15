from flask import Flask, render_template, request, redirect, session, json
from flask_cors import CORS, cross_origin
from .chat_data_module import ChatData as cd
from .NonExistentUserException import NonExistentUserException
from datetime import datetime as dt

import os
import traceback
import requests


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/post_chat/<user_id>', methods=['POST'])
@cross_origin()
def post_chat(user_id):
    if (request.method == "POST"):
        try:
            print("Post chat request detected.")
            json_data = request.get_json(silent=True)
            chat_data = json_data['chat_data']
            conversation_id = json_data['conversation_id']
            chat_handler = cd(int(user_id))
            timestamp: dt = dt.now()
            user_chat_id = chat_handler.log_chat(chat_data, timestamp, conversation_id, False)
            chat_handler.close_conn()
            
            return json.dumps({'success': True, 'user_chat_id': user_chat_id}), 201
        except NonExistentUserException as neue:
            return json.dumps({'success': False, 'exception': {"name": "NonExistentUserException", "description": str(neue)}}), 400
        except Exception as e:
            return json.dumps({'success': False, 'exception': {"name": "Exception", "description": str(e)}}), 500
    else:
        return json.dumps({'success': False}), 400

@app.route('/generate_response/<user_id>', methods=['POST'])
@cross_origin()
def generate_response(user_id):
    
    try:
        backend_ip = os.environ.get("BACKEND_IP")
        user_id = int(user_id)
        chat_handler = cd(user_id)
        # This code will be executed from the front-end server to communicate
        # with the backend server.
        
        json_data = request.get_json(silent=True)
        chat_input = json_data['chat_data']
        conversation_id = json_data['conversation_id']
        if 'debug_mode' in json_data.keys():
            if json_data['debug_mode'] == True:
                backend_ip += ":5000"
        backend_json_data = requests.post((backend_ip + '/generate_response'), json={'input': chat_input})
        backend_json_data = backend_json_data.json()
        print(backend_json_data)
        robot_chat_id = chat_handler.log_chat(backend_json_data['output'], dt.now(), conversation_id, True)
        print(robot_chat_id)
        if 'citations' in backend_json_data.keys():
            chat_handler.upload_citations(robot_chat_id, backend_json_data['citations'])
        robot_chat_data = chat_handler.get_chat_by_cid(robot_chat_id)

        i = 0
        response_time = robot_chat_data[3]
        print(robot_chat_data)
        content_json = {'time_in_edt': response_time, 'content': robot_chat_data[1], 'citations': backend_json_data['citations']}
        chat_handler.close_conn()        
        return json.dumps({'success': True, 'ai_output': content_json}), 201
    except Exception as e:
        traceback.print_exc()
        return json.dumps({'success': False, 'Exception data': str(e)}), 500

@app.route('/generate_conv_title/', methods=['POST'])
@cross_origin()
def generate_conv():
    if (request.method=="POST"):
        try:
            json_data = request.get_json(silent=False)
            user_input = json_data['chat_data']
            backend_ip = os.environ.get("BACKEND_IP")
            if 'debug_mode' in json_data.keys():
                if json_data['debug_mode'] == True:
                    backend_ip += ":5000"
            backend_json_data = requests.post(backend_ip + '/generate_conv_title/', json={'input': user_input})
            backend_json_data = backend_json_data.json()
            return json.dumps({'success': True, 'conversation_title': backend_json_data['conversation_title']}), 201
        except Exception as e:
            traceback.print_exc()
            return json.dumps({'success': False, 'exception_details': str(e)}), 500
    else:
        return json.dumps({'success': False}), 400


@app.route('/create_new_conversation/<user_id>', methods=['POST'])
@cross_origin()
def create_new_conversation(user_id):
    """This function creates a new conversation on the SQL database
        for the user.

        PARAMETER
        user_id - The ID of the user to create a new conversation.

        JSON FILE FORMAT
        {'conversation_title': <conversation_title>}
    """
    try:
        chat_data = cd(user_id)
        json_data = request.get_json(silent=True)
        new_conv_id = chat_data.create_new_conversation(json_data['conversation_title'])
        return json.dumps({'success': True, 'new_conversation_id': new_conv_id}), 201
    except Exception as e:
        return json.dumps({'success': False, 'exception_details': str(e)}), 500

@app.route('/update_conversation_title/<user_id>', methods=['POST'])
@cross_origin()
def update_conversation_title(user_id):
    """This function renames the title of the conversateo on the SQL
        database. The JSON file must be passed into the POST request.

        FUNCTION PARAMETER
        user_id - The ID of the user that initiated the conversation.

        JSON FILE FORMAT
        {'conversation_id': <conversation_id>, 'new_title': <new_title>}

        JSON PARAMETERS
        <conversation_id> - The id of the conversation to rename its title.
        <new_title> - The new title of the conversation to rename.
    """
    try:
        chat_data = cd(user_id)
        json_data = request.get_json(silent=True)
        conversation_id = json_data['conversation_id']
        new_title = json_data['new_title']
        chat_data.rename_conversation_title(conversation_id, new_title)
        return json.dumps({'success': True}), 201
    except Exception as e:
        traceback.print_exc()
        return json.dumps({'succes': False, 'exception_details': str(e)}), 500

@app.route('/get_chat/<user_id>', methods=['GET'])
@cross_origin()
def get_chat(user_id):
    
    if request.method == "GET":
        chat_data = cd(user_id)
        chat_logs = chat_data.return_chat_history()
        chat_data.close_conn()
        return json.dumps({'success': True, 'chat_history': chat_logs, 'user_id': int(user_id)}), 201
    else:
        return json.dumps({'success': False, 'content': "Only 'GET' request method are allowed for /get_chat/" + str(user_id) + "."}), 400

if __name__=="__main__":
    app.run()
