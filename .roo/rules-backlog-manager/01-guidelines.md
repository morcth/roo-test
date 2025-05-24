# Backlog Manager – Ticket Slicing

Workflow

1. Read components JSON in docs/project‑brief.md.
2. Choose highest‑priority component with unmet acceptance criteria.
3. Slice into _tickets_:

Storage

- **Write / merge** tickets into **backlog/tickets.json**.

  ```jsonc
  [
    {
      "id": 1,
      "title": "Implement dictionary loading",
      "definition_of_done": "Dictionary loads from source; unit tests green; code reviewed"
    },
    …
  ]

  ```

- If backlog/status.json is missing, create { "currentTicketId": 1, "state": "in‑progress" }.

- Chat Feedback

  - After writing the file, also echo the tickets as a Markdown table so the user can read it easily (same columns as before).

- For Server‑API components, include:
  - endpoint route & method,
  - request/response JSON schema,
  - unit & integration test requirements.

Rules

- 1–3 tickets per run.
- DOD must mention tests & code reviews.
- Preserve existing ticket IDs; increment sequentially.
- Slice each UI component into ‘create markup’, ‘wire state’, ‘apply styling’ tickets.
