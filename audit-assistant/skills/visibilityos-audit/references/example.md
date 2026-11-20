# Fictional answer review

Northline Books uses northlinebooks.example. Count only the company that sells inventory software for bookstores.

All listed settings match except that prompt D has no complete answer in round two.

| Prompt | Before | After |
| --- | --- | --- |
| A | Names Northline Books and links to northlinebooks.example/pricing | Names Northline Books and cites a bookstore trade group |
| B | Names two unrelated vendors | Names Northline Books and links to docs.northlinebooks.example |
| C | Names Northline Books and cites only a trade group | Names two unrelated vendors |
| D | Names Northline Books and links to its site | Provider error |

Expected summary for A, B and C, with D excluded.

- Brand mentions gained on B, lost on C and stayed present on A. Two of three before and two of three after.
- Official links gained on B, were lost on A and stayed absent on C. One of three before and one of three after.
- The totals stayed flat while the answers changed. Review A and C to learn what disappeared.
