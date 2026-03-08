# Part 14: RAG Deep Dive and Knowledge Quality 📚🔎

RAG (Retrieval-Augmented Generation) decides whether your model sounds confident or is actually grounded in evidence.

## 1. Document Ingestion Strategy
Quality starts before retrieval.

When ingesting sources:
- Prefer authoritative, well-structured documents.
- Attach metadata (title, author, topic, date, language).
- Remove noisy text (watermarks, broken OCR lines, repeated headers).

Bad ingestion produces bad retrieval, even with a strong model.

## 2. Chunking and Context Granularity
Chunking splits documents into searchable pieces.

### Core tradeoff:
- **Large chunks**: More context, lower precision.
- **Small chunks**: Higher precision, risk of missing full argument.

Practical approach:
1. Start with medium chunks.
2. Add overlap to preserve meaning across boundaries.
3. Test retrieval on real questions, then tune size and overlap.

## 3. Embeddings and Retrieval Recall
Embeddings convert text to vectors for semantic search.

Key factors affecting recall:
- Embedding model quality.
- Language/domain match (religious and philosophical terminology).
- Query rewriting (turn user wording into retrieval-friendly phrasing).

If recall is low, answers will hallucinate because evidence never arrives.

## 4. Re-ranking and Evidence Selection
First-pass retrieval often returns mixed quality.

Re-ranking helps by:
- Scoring passages by relevance to the exact query.
- Promoting high-signal passages.
- Filtering duplicates and tangential results.

This is often a bigger quality win than changing the generation model.

## 5. Citation and Traceability
Grounded systems should show where claims came from.

Recommended minimum:
- Source title and section identifier.
- Snippet-level mapping to major claims.
- Internal record of retrieved chunks per answer.

This improves trust and makes audits possible.

---
**In AnonymousThinker:**
RAG is not "upload and done." It is a pipeline: source quality, chunking, embeddings, ranking, and citation discipline.
