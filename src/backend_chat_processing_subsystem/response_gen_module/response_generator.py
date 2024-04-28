#!/usr/bin/env python
# coding: utf-8

# In[3]:


from pathlib import Path
import os
import sys



# In[4]:


from response_gen_module.citation_fetcher import Citation_Fetcher as cf
from datetime import datetime as dt
from transformers import pipeline
from nltk import tokenize as sentence_delim


import gc
import os
import re
import sys
import torch


# In[5]:


class ResponseGenerator():

    def __init__(self):
        
        self.base_model = None
        self.base_system_msg = None

    def generate_conversation_title(self, user_input, DEBUG_MODE=False):
        """Generates the title for the conversation of the user's input.
        
        PRE-REQUISITES
        This function should only be called after the user posts
            first message of conversation.

        PARAMETERS
        user_input - The user's message that has been sent to the chatbot.
        DEBUG_MODE - If True, this function prints debugging messages.
        """

        base_model_gen_msg = [

            {
                "role": "system",
                "content": """You are a friendly chatbot that provides reliable information to the user. The message you receive from the user is the first message in the conversation. Based on the user input, generate a title that best describes the conversation."""
            },
            {
                "role": "user",
                "content": user_input
            }
        ]
        self.base_model = (pipeline("text-generation", model="HuggingFaceH4/zephyr-7b-alpha", 
           torch_dtype = torch.bfloat16, device_map="auto"))
        base_model_prompt = self.base_model.tokenizer.apply_chat_template(base_model_gen_msg, tokenize=False, add_generation_prompt=True)
        conv_title = self.base_model(base_model_prompt, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
        conv_title = conv_title[0]
        conv_title = conv_title['generated_text']
        conv_title = conv_title.split("<|assistant|>\n")
        conv_title = conv_title[1]
        conv_title = conv_title.split("Title: ")
        conv_title = conv_title[1]
        try:
            conv_title = conv_title.split("\n")
            conv_title = conv_title[0]
        except:
            conv_title = conv_title
        self.base_model = None
        del self.base_model
        gc.collect()
        torch.cuda.empty_cache()
        return conv_title
        
    
    def generate(self, user_input: str, search_query, DEBUG_MODE=False):
        """This function generates the response to the user's input."""
        if DEBUG_MODE:
            print("Debug mode has been enabled. Capturing runtime...\n")
            query_gen_start: dt = dt.now()
        query_results = None

        if DEBUG_MODE:
            query_gen_end: dt = dt.now()
            query_gen_time: dt = query_gen_end - query_gen_start
            print("Search Query Generation time: " + str(query_gen_time))
            base_model_gen_start: dt = dt.now()

        base_model_gen_msg  = [
                {
                    "role": "system",
                "content": """You are a friendly chatbot that provides reliable information to the user.
                    Your goals are to reduce suffering in the universe, increase prosperity in the universe, and increase understanding in the universe."""
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ]
        
        if search_query is not None:
            if DEBUG_MODE:
                print("Searching for: \"" + search_query + "\"...")
            query_results, _ = cf.search_online(search_query)
            base_model_gen_msg.append({"role": "query_results", "content": query_results})
            current_time = dt.now()
            base_model_gen_msg[0]["content"] += ("You have submitted a query search engine that can help you answer the user's question. " + 
                                                 "Please summarize the query results that can best answer the user's question.")

        self.base_model = (pipeline("text-generation", model="HuggingFaceH4/zephyr-7b-alpha",
            torch_dtype = torch.bfloat16, device_map="auto"))
        base_model_prompt = self.base_model.tokenizer.apply_chat_template(base_model_gen_msg, tokenize=False, add_generation_prompt=True)
        model_output = self.base_model(base_model_prompt, max_new_tokens=256, do_sample=True, temperature=0.7, top_k=50, top_p=0.95)
        model_output = model_output[0]
        model_output = model_output['generated_text']
        model_output = model_output.split("<|assistant|>\n")
        model_output = model_output[1]
        self.base_model = None
        del self.base_model
        gc.collect()
        torch.cuda.empty_cache()

        if DEBUG_MODE:
            base_model_gen_end: dt = dt.now()
            base_model_gen_time: dt = base_model_gen_end - base_model_gen_start
            print("Base/Response Model generation time: " + str(base_model_gen_time))
            total_gen_time: dt = query_gen_time + base_model_gen_time
            print("Total generation time: " + str(total_gen_time) + "\n")

        citations = None
        if query_results is not None:
            citations = []
            model_output +="\r\nSource:\n"
            i = 0
            for item in query_results:
                citations.append(item['href'])
                model_output += item['href'] + "\n"
                i += 1
        
        return citations, model_output

