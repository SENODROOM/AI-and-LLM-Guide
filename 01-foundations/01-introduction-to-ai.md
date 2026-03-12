# Part 1: AI and LLM Basics 🤖

Welcome! If you have zero knowledge about AI, this is the perfect place to start. Let's break down the big terms into simple ideas.

## 1. What is Artificial Intelligence (AI)?
Think of AI as a computer's attempt to "mimic" human intelligence.
- **Traditional Coding**: You give the computer a strict rulebook (e.g., "If $X$ happens, do $Y$").
- **AI**: You give the computer examples, and it learns to find patterns itself.

## 2. What is an LLM?
**LLM** stands for **Large Language Model**.
- **Large**: It was shown billions of pages of text (books, websites, code).
- **Language**: It specializes in understanding and generating human speech/text.
- **Model**: It is a complex mathematical "brain" that predicts the next word in a sentence.

### How does it work?
Imagine a giant game of "Auto-complete." If I say *"The sky is..."*, the LLM calculates that *"blue"* is the most likely next word because it has seen that pattern millions of times. When it does this billions of times per second, it looks like it's "thinking."

## 3. Is the AI "Thinking" or "Searching"?
It is **Generating**. 
- It doesn't have a Google-like library where it looks up answers.
- Instead, it has "parameters" (tiny logic connections). When you ask a question, it uses its internal logic to build a response word-by-word.

---
**In AnonymousThinker:**
We use Groq's **llama-3.3-70b-versatile** as the primary reasoning model with a HuggingFace fallback. Responses are grounded via Pinecone-backed RAG from your uploaded library, while the AI’s behavior is shaped by the Persona and Core Strategy you define in the Train AI hub.


---

[Next: Teaching the Machine to Learn →](02-teaching-the-machine-to-learn.md)

[📖 Back to Guide Index](../README.md)