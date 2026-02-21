# Part 5: Training Your AI (Step-by-Step) 🛠️👨‍🏫

Now that you know how LLMs and Databases work, here is how you actually use **AnonymousThinker** to create a specialized AI.

## Step 1: Define the "Persona"
In the Training Hub, you see a box for the "System Prompt." This is where you tell the AI **who it is**.
- **Bad Prompt**: "You are an AI."
- **Good Prompt**: "You are an intellectual defender of the Islamic faith. Use logic, respect, and clear reasoning."
- **What happens?**: This text is invisibly added to every single chat to set the AI's "vibe."

## Step 2: Set the "Core Strategy"
The Strategy box is where you give the AI **specific rules** for hard questions.
- **Example**: "If someone asks about other religions, explain the logical proofs of Islam rather than just being vague."
- **Analogy**: The Persona is the "Personality," and the Strategy is the "Training Manual."

## Step 3: Populate the Knowledge Base (The Library)
This is the most powerful part. When you upload a PDF:
1. The system reads it and saves the text to **MongoDB**.
2. It creates "Vector Embeddings" (it turns text into numbers so the computer can understand the meaning).
3. Whenever a user chats, the system searches these numbers to find the exact paragraph from the book that matches the user's question.

## Step 4: Consistency is Key
The AI doesn't "lock in" forever. You can change the Persona and Strategy at any time. Every time you click **"Commit Changes,"** the AI instantly starts using the new rules for all future users.

---
### Your Role as the Trainer
You are not coding the AI; you are **curating its mind**. By choosing the right books (PDFs) and writing clear logical rules (Prompts), you transform a general-purpose AI into a **Sovereign Thinker**.

---
*End of Guide. You are now ready to lead the future of AnonymousThinker!*
