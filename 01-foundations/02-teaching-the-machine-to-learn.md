# Part 2: How AI is "Trained" 🧠🏋️

People often say "I am training my AI," but what does that actually mean? There are three main ways to teach an AI.

## 1. Pre-Training (The School Years)
This is the most expensive part. Companies like Meta show the AI almost everything on the internet.
- **Result**: The AI learns how to speak, how to code, and basic facts about the world.
- **Analogy**: This is like a student graduating from University with general knowledge.

## 2. Fine-Tuning (Specialization)
We take a pre-trained AI and show it specific data (like medical records or legal documents) to make it an expert in one field.
- **AnonymousThinker Note**: We can "Fine-Tune" our AI in the future by exporting our chats in JSONL format (which you see in the Training Hub).
- **Analogy**: This is like a doctor going to medical school after university.

## 3. RAG: Retrieval-Augmented Generation (The Library)
This is what AnonymousThinker uses **right now**. Instead of changing the AI's "brain," we give it a **Searchable Library**.
- **How it works**: When you upload a PDF in the "Train AI" section, the system breaks it into small "chunks." When you ask a question, the system finds the relevant "chunks" from the PDF and shows them to the AI *during the chat*.
- **Analogy**: This is like giving a student an "Open Book Exam." They don't have to memorize the book; they just need to know how to look it up.

## Why use RAG instead of Fine-Tuning?
1. **Speed**: RAG is instant. Fine-tuning takes hours or days.
2. **Accuracy**: The AI can double-check the exact text you uploaded, so it's less likely to make things up (hallucinate).
3. **Cost**: RAG is free/cheap; fine-tuning requires powerful servers.

---
**In AnonymousThinker:**
When you upload Islamic texts or logical proofs, you are building a **Library**. Whenever anyone chats with the AI, the AI "glances" at your library to find facts before it answers.

---

[← Previous: Introduction to AI](01-introduction-to-ai.md) | [Next: The Digital Brain (Storage) →](03-the-digital-brain-storage.md)

[📖 Back to Guide Index](../README.md)