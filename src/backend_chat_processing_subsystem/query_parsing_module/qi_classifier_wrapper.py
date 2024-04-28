from pathlib import Path
import os
import sys

#Add modules from other folder descendents into memory.
cur_dir = Path(os.getcwd())
par_dir = cur_dir.parent.absolute()
print(cur_dir)
sys.path.append(str(cur_dir) + "/data_management_subsystem")
sys.path.append(str(cur_dir) + "/query_parsing_module")

print(sys.path)
from qi_classifier import QIClassifier

from torchtext import data, datasets

import datasets
import gc
import torchtext
import torch
import torch.nn as nn
import spacy

        

class QIClassifierWrapper():
  """This class is used to wrap the QIClassifier model class."""

  def __init__(self, model_path, device="auto"):
    """
    This class initializes the wrapper for the QI
    classifier.

    PARAMETERS
    model_path - The directory where the QI classifier model
    is stored.
    device - The device to compute the model.
    """
    self.model_path = model_path
    if device == "auto":
      if torch.cuda.is_available():
          self.device = "cuda"
      else:
          self.device = "cpu"
    else:
      if device in ["cuda", "cpu"]:
        self.device = device
      else:
        raise ValueError(device + " is an invalid device parameter.")
  
    
    # Run when allocating data
    self.TEXT = torch.load(self.model_path + "/vocab.pt")
    self.LABEL = torch.load(self.model_path + "/label_vocab.pt")
    self.model = QIClassifier(len(self.TEXT.vocab),256,512,2)
    self.model.load_state_dict(torch.load(self.model_path + "/model_params.pt"))
    cur_dir = Path(os.getcwd())
    print(cur_dir)
    print(sys.path)
    self.model = self.model.to(self.device)
    self.tokenizer = spacy.load("en_core_web_sm")
    self.is_allocated = True
  
  def classify(self, user_input):
    """This function determines whether the user input is queryable.
  
    RETURNS
    '0' if user input is queryable, or '1' if it is not queryable.
  
    PARAMETERS
    user_input - The user input message to classify whether the input
      is queryable.
    """
    
    tokenized_inp = [tok.text for tok in self.tokenizer.tokenizer(user_input)]
    tok_ind = [self.TEXT.vocab.stoi[t] for t in tokenized_inp]
    tensor = torch.LongTensor(tok_ind).to(self.device)
    tensor = tensor.unsqueeze(1)
    logit, probas = self.model(tensor)
    output = torch.argmax(probas, dim=1)
    return output.cpu().item()
  
  def allocate(self):
    """Allocates the model, vocab, and tokenizer into memory."""
    
    self.TEXT = torch.load(self.model_path + "/vocab.pt")
    self.LABEL = torch.load(self.model_path + "/label_vocab.pt")
    self.model = QIClassifier(len(self.TEXT.vocab),256,512,2)
    self.model.load_state_dict(torch.load(self.model_path + "/model_params.pt"))
    self.model = self.model.to(self.device)
    self.tokenizer = spacy.load("en_core_web_sm")
    self.is_allocated = True
  
  def deallocate(self):
    """Deallocates the model, vocab, and tokenizer from memory."""
    
    self.TEXT = None
    self.LABEL = None
    self.model = None
    self.tokenizer = None
    del self.TEXT, self.LABEL, self.model, self.tokenizer
    gc.collect()
    torch.cuda.empty_cache()
