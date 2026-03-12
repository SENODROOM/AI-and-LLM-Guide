# Part 15: Hallucination Control and Reliability Patterns 🛡️📈

Hallucinations are not random bugs. They are predictable failure modes you can reduce with design patterns.

## 1. Hallucination Types
Classify failures so fixes are targeted:
1. **Fabricated fact**: Claim unsupported by evidence.
2. **Citation hallucination**: Fake or mismatched source reference.
3. **Reasoning leap**: Conclusion jumps without valid steps.
4. **Overconfidence**: Strong tone despite weak certainty.

Each type needs a different mitigation.

## 2. Retrieval-Grounded Answering
If evidence is required, enforce it in prompt logic:
- "Do not make factual claims outside retrieved context unless marked as uncertainty."
- "If evidence is missing, say so and ask for clarifying input."

This turns uncertainty into transparent behavior instead of fake certainty.

## 3. Confidence Gating
Use simple confidence gates before final output:
- Did retrieval return enough relevant passages?
- Do top passages agree with each other?
- Does final answer cite supporting evidence?

If checks fail, route to safer fallback response.

## 4. Multi-Model Verification Patterns
For sensitive answers, add verification:
- Model A generates draft.
- Model B checks factual consistency and missing citations.
- Final response is accepted only if verification passes threshold.

This costs more but reduces high-impact errors.

## 5. Human-in-the-Loop Escalation
Not every case should be fully automated.

Escalate to admin review when:
- User asks high-stakes legal/medical/financial-style questions.
- Sources conflict strongly.
- Model confidence is low over repeated turns.

Reliability means knowing when not to answer automatically.

---
**In AnonymousThinker:**
A reliable assistant does not pretend certainty. It uses evidence gates, confidence checks, and escalation rules to stay trustworthy.

---

[← Previous: RAG Deep Dive and Knowledge Quality](14-rag-deep-dive-and-knowledge-quality.md) | [Next: Memory Architecture and Context Management →](16-memory-architecture-and-context-management.md)

[📖 Back to Guide Index](../README.md)