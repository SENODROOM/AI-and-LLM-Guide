# Part 12: Testing and Quality Evaluation ✅🧪

Scaling is not enough. You also need proof that the AI answers are correct, useful, and consistent over time.

## 1. Build a Golden Question Set
Create a fixed test bank of important prompts:
- Core theology and comparative-religion questions.
- Common objections and repeated user misunderstandings.
- Edge cases designed to trigger hallucinations.

This becomes your benchmark. Run it after every major change.

## 2. Define a Scoring Rubric
Use a clear rubric so quality is measurable, not emotional:
1. **Accuracy**: Are claims factually correct?
2. **Evidence use**: Does the answer use retrieved sources properly?
3. **Reasoning quality**: Is logic coherent and stepwise?
4. **Tone control**: Is the response respectful but firm?
5. **Safety**: Does it avoid harmful or fabricated claims?

Score each area from 1 to 5 and track trends weekly.

## 3. Compare Versions, Not Just Feelings
When you change prompts or sources:
- Run old version and new version on the same question set.
- Compare scores side by side.
- Accept changes only if quality improves or stays equal with better speed/cost.

This prevents accidental regressions.

## 4. Add Human Review Loops
Automated checks help, but expert review is still necessary:
- Sample real conversations each week.
- Flag weak answers and classify failure type (prompt, retrieval, model).
- Feed those failures back into Part 10's improvement loop.

## 5. Define Release Gates
Before shipping updates to production, require:
- No critical factual regressions in benchmark questions.
- Acceptable latency/cost according to your SLOs.
- Sign-off from at least one admin reviewer.

---
**In AnonymousThinker:**
Quality is not a one-time claim. It is a measured discipline backed by benchmarks, rubrics, and repeatable review.

---

[← Previous: Production Readiness and Scale](11-production-readiness-and-scale.md) | [Next: Prompt Engineering and Control Layers →](../03-optimization-and-scale/13-prompt-engineering-and-control-layers.md)

[📖 Back to Guide Index](../README.md)