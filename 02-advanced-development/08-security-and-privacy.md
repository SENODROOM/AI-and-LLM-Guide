# Part 8: Security and Privacy (Safeguarding Thought) 🔒🛡️

Since AnonymousThinker handles personal conversations and sensitive training data, security is a top priority. Here is how we keep everything safe.

## 1. Password Hashing (The Secret Blender)
We NEVER store your password as plain text in the database.
- If your password is `"MySecret123"`, we put it through a "Blender" called **Bcrypt**.
- The result is a long, garbled string like `$2b$10$X8fGv...`.
- Even if someone hacked the database, they would only see the garbled code, not your password!

## 2. JWT: Your "Digital ID Card"
When you login, the server gives your browser a **JWT (JSON Web Token)**.
- Think of this as a "Digital ID Card" that stays in your browser's pocket.
- Every time you click "Train AI" or send a message, the browser shows this ID card to the server.
- The server checks if the card is real and if it says **"ROLE: ADMIN"**.

## 3. Role-Based Access Control (RBAC)
Not everyone can train the AI. 
- **Users**: Can only chat and view their own history.
- **Admins**: Can access the "Sovereign AI Hub," upload PDF knowledge, and change the AI's persona.
- This prevents random people from messing with your AI's logic.

## 4. Environment Variables (`.env`)
You might have noticed the `.env` file. This is the **Vault**.
- It contains your API keys and Database passwords.
- We never share this file with anyone. It stays only on the computer running the project.

---
**In AnonymousThinker:**
Security isn't just about locks; it's about ensuring the **integrity** of the AI's training and the **privacy** of every person who uses it.

---

[← Previous: Logical Defense and Reasoning](07-logical-defense-and-reasoning.md) | [Next: Future Horizons →](09-future-horizons.md)

[📖 Back to Guide Index](../README.md)