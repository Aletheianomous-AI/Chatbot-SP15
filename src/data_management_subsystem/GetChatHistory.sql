-- Get Conversation IDs
SELECT * FROM dbo.Conversations WHERE UserID = 1
ORDER BY ConversationID;

-- Get Conversations by UserID

SELECT * FROM dbo.Chat_History AS ch
INNER JOIN dbo.Chat_Conversation AS cc
	ON (cc.Chat_ID = ch.Chat_ID)
WHERE cc.Conversation_ID = 1
ORDER BY cc.Chat_ID DESC;