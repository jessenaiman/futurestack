---
# Essential for Projects plugin views
status: todo              # Options: todo, in-progress, review, done, blocked
priority: medium          # Options: low, medium, high, critical
dueDate: <% tp.date.now("YYYY-MM-DD") %> # Target completion date (use Tasks plugin format if possible)
category:                 # Options: Documentation, C++ Game Code, Combat Simulator, CrewAI, Planning
assignee:                 # Optional: Who is responsible (e.g., @YourName, @AI)

# Optional for context/linking
tags: [task, project/omega-spiral] # Ensures findability, #task helps Tasks plugin too
relatedIssue:             # Optional: Link to a specific GitHub issue URL
created: <% tp.date.now("YYYY-MM-DD HH:mm") %> # Auto-filled by Templater
---

## Task Description

- [ ] 

## Notes

