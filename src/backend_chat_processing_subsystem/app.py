#sys.path.append(str(cur_dir) + "/query_parsing_module")

from flask import Flask, render_template, request, redirect, session, json
from datetime import datetime as dt
from response_gen_module.response_generator import ResponseGenerator
from torchtext import data, datasets
from query_parsing_module.qi_classifier_wrapper import QIClassifierWrapper
from query_parsing_module.qi_classifier import QIClassifier
from query_parsing_module.query_parser import QueryParser

import datasets
import spacy
import gc
import torch.nn as nn
import torch
import torchtext
import traceback

app = Flask(__name__)

@app.route("/generate_response/", methods=['POST'])
def generate_response():
    try:
        if request.method == "POST":
            json_data = request.get_json(silent=False)
            user_input = json_data['input']
            print("Determining if input requires online search")
            qc = QIClassifierWrapper("./models/aletheianomous_ai-QI_class-v0.1.4")
            is_queryable = qc.classify(user_input)
            qc.deallocate()
            del qc
            gc.collect()
            query = None
            if is_queryable==0:
                print("QI model classified input is searchable.")
                qp = QueryParser("./models/aletheianomous_ai-keyword_extractor-v0.3.1")
                query = qp.generate_query(user_input)
                qp.deallocate()
                del qp
                gc.collect()
            
            rg = ResponseGenerator()
            citations, ai_response = rg.generate(user_input, query)
            del rg
            gc.collect()
            return json.dumps({'success': True, 'citations': citations, 'output': ai_response}), 201
        else:
            return json.dumps({'success': False}), 400
    except Exception as e:
            traceback.print_exc()
            return json.dumps({'success': False, 'exception_details': str(e)}), 500
        
@app.route("/generate_conv_title/", methods=['POST'])
def generate_conv_title():
    """This function handles requests to generate title for user's conversations."""
    try:
        if request.method == "POST":
            json_data = request.get_json(silent=False)
            user_input = json_data['input']
            
            rg = ResponseGenerator()
            title = rg.generate_conversation_title(user_input)
            return json.dumps({'success': True, 'conversation_title': title}), 201
        else:
            return json.dumps({'success': False}), 400
    except Exception as e:
            traceback.print_exc()
            return json.dumps({'success': False, 'exception_details': str(e)}), 500

if __name__ == "__main__":
    app.run()
