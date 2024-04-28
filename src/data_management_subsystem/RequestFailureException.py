class RequestFailureException(Exception):

    """This exception is raised if the REST API request to
    perform changes to the SQL server fails."""
    
    def __init__(self, message):
        """PARAMETERS
        message - The message that will be raised.
        """
        super().__init__(message)

