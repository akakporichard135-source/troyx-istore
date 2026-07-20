# AI Architecture

TroyX iStore is prepared for an AI shopping assistant and trade-in guidance.

Suggested production flow:

1. Store product catalog and policy snippets in Supabase.
2. Use embeddings or managed search for retrieval.
3. Call an LLM with product context, delivery policy, warranty policy, and the non-affiliation disclaimer.
4. Return concise recommendations with product IDs for UI rendering.
5. Log conversations with customer consent and redact sensitive data.

The `app/api/ai/shopping-assistant` route is the integration point.
