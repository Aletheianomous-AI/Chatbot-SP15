DECLARE @CitationID int;
IF EXISTS (SELECT * FROM dbo.Citation WHERE Link = 'https://www.google.com')
        BEGIN
            SELECT @CitationID = Citation_ID
            FROM dbo.Citation WHERE Link = 'https://www.google.com';
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
            VALUES (@CitationID, 'https://www.google.com');
        END

DECLARE @SurrogateKey int;
SELECT @SurrogateKey = @SurrogateKey
FROM dbo.Citation_Chat_History

IF (@SurrogateKey IS NULL)
	BEGIN
		SET @SurrogateKey = 1;
	END

INSERT INTO dbo.Citation_Chat_History (Surrogate_Key, Chat_ID, Citation_ID)
VALUES (@SurrogateKey, 74, @CitationID);
