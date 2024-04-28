import torch.nn as nn
import torch

class QIClassifier(nn.Module):
    
    def __init__(self, input_dim, embedding_dim, hidden_dim, output_dim):
        """This function initializes the Queryable Input Classifier model.
        
        PARAMETERS
        input_dim - The input dimension of the model.
        embedding_dim - The dimension/neurons of the embedding layer.
        hidden_dim - The # of neurons in the hidden layer.
        output_dim - The dimension of output in the output layer.
        """
      
        super().__init__()

        self.embedding = nn.Embedding(input_dim, embedding_dim)
        self.rnn = nn.LSTM(embedding_dim, hidden_dim, num_layers=2,
              batch_first=False)
        self.fc = nn.Linear(hidden_dim, output_dim)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, text):
        """Runs the predictions of the queryable classifier
        given an input text."""
        embedded_text = self.embedding(text)
        output, hidden = self.rnn(embedded_text)
        logits = self.fc(output[-1, :, :])
        output = self.softmax(logits)
        return logits, output