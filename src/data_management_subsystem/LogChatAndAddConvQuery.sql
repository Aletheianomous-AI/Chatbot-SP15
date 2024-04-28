--Create new conversation
INSERT INTO dbo.Conversations(ConversationName, UserID)
VALUES ('History of Five Nights at Freddy''s', 1);


-- Insert message
DECLARE @ChatID int;
	SELECT @ChatID = (MAX(Chat_ID) + 1)
FROM dbo.Chat_History;
INSERT INTO dbo.Chat_History (Chat_ID, Chat_Content, Belongs_To_Bot, Time_Of_Output)
VALUES (@ChatID, 'Test', 0, '2024-04-23 07:27:00');
INSERT INTO dbo.Chat_Conversation (Chat_ID, UserID, Conversation_ID)
VALUES (@ChatID, 1, 1);