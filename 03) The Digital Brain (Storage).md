# Part 3: Databases and Storage 🗄️

How does the computer "remember" that you have an account or that you wrote a specific message? This is where the **Database** comes in.

## 1. What is MongoDB?
MongoDB is the "File Cabinet" of our project. It is a **NoSQL Database**, which means it stores data in a format called **JSON** (it looks like a list with labels).

### Example of a "User" in our Database:
```json
{
  "username": "saad",
  "email": "saad@example.com",
  "role": "admin",
  "password": "hashed_secret_code"
}
```

## 2. Where is the data stored?
When you start the project, the **Backend** (Node.js) connects to a MongoDB server (usually in the "Cloud"). 
- Every time you send a message, it is sent to the Backend.
- The Backend says: *"Wait, I need to save this forever!"*
- The Backend writes the message into MongoDB.

## 3. What is a "Schema"?
A schema is like a **Template**. It tells the database exactly what a "Message" or a "User" should look like.
- We have a `User.js` schema (for accounts).
- We have a `Conversation.js` schema (for chats).
- We have a `Knowledge.js` schema (for your uploaded PDFs).

## 4. Why don't we just save to a Text File?
Saving to a database like MongoDB is much faster and smarter than a simple text file.
1. **Search**: We can ask MongoDB: *"Find all chats for user 'Saad' from yesterday."*
2. **Security**: We can lock sections of the database so only Admins can read them.
3. **Scale**: MongoDB can hold millions of chats without slowing down.

---
**In AnonymousThinker:**
When the AI responds, its answer is immediately saved to your specific "Conversation" entry in MongoDB. That’s why when you refresh the page or login from a different computer, your chats are still there!
