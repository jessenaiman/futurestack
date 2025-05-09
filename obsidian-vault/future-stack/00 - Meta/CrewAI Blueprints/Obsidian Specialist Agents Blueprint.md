# Blueprint: Obsidian Specialist CrewAI Agents

This document outlines the design for specialized CrewAI agents responsible for interacting with the Obsidian vault for task and documentation management.

**Objective:** To abstract Obsidian interactions into dedicated agents, simplifying the workflow for other AI assistants and human collaborators.

---

## Agent 1: `ObsidianTaskManagerAgent`

**Goal:** To manage all aspects of tasks within the Obsidian vault for specified projects.

**Responsibilities:**
-   Creating new tasks from templates (e.g., using `Omega Spiral Task Template.md`).
-   Retrieving task details (status, priority, description, etc.).
-   Updating task statuses (e.g., to-do, in-progress, done, blocked, review).
-   Listing tasks based on various criteria (project, status, priority, category, assignee).
-   Linking tasks to GitHub issues or other relevant notes.

**Potential Tools (leveraging `mcp-obsidian` and `mcp_desktop-commander`):**
-   `create_task_in_obsidian(project_folder: str, template_name: str, task_details: dict)`
    -   *Description:* Creates a new task note within the specified project folder using a given template. `task_details` will populate the frontmatter and potentially the body.
    -   *Obsidian Actions:* Uses `Templater` to create a new note from the template, then updates frontmatter based on `task_details`.
-   `get_task_details_from_obsidian(task_file_path: str)`
    -   *Description:* Reads a task note and returns its frontmatter and content.
    -   *Obsidian Actions:* Reads the specified file.
-   `update_task_field_in_obsidian(task_file_path: str, field_name: str, new_value: str)`
    -   *Description:* Modifies a specific frontmatter field in a task note.
    -   *Obsidian Actions:* Edits the frontmatter of the specified file.
-   `find_tasks_in_obsidian(search_criteria: dict)`
    -   *Description:* Searches for tasks using Obsidian's search capabilities, filtered by criteria like project, status, priority, tags, etc.
    -   *Obsidian Actions:* Utilizes `mcp_mcp-obsidian_obsidian_complex_search` or `mcp_mcp-obsidian_obsidian_simple_search`.

---

## Agent 2: `ObsidianDocsAgent`

**Goal:** To manage documentation, meeting notes, and reference materials within the Obsidian vault.

**Responsibilities:**
-   Storing new documentation or reference notes in appropriate folders.
-   Retrieving existing documentation based on keywords, titles, or categories.
-   Creating and organizing meeting notes, including attendees, discussion points, and action items.
-   Searching across the vault for specific information or concepts.

**Potential Tools (leveraging `mcp-obsidian` and `mcp_desktop-commander`):**
-   `create_note_in_obsidian(note_path: str, content: str, frontmatter: Optional[dict] = None)`
    -   *Description:* Creates a new general note at the specified path with given content and optional frontmatter.
    -   *Obsidian Actions:* Writes a new file.
-   `get_note_content_from_obsidian(note_path: str)`
    -   *Description:* Retrieves the full content of a note.
    -   *Obsidian Actions:* Reads the specified file.
-   `append_to_note_in_obsidian(note_path: str, content_to_append: str, target_section: Optional[str] = None)`
    -   *Description:* Appends content to an existing note, optionally under a specific heading.
    -   *Obsidian Actions:* Modifies an existing file.
-   `search_obsidian_vault(search_query: str, context_length: Optional[int] = 100)`
    -   *Description:* Performs a full-text search across the entire vault.
    -   *Obsidian Actions:* Utilizes `mcp_mcp-obsidian_obsidian_simple_search`.

---

## Implementation Notes:

-   These agents will be part of a CrewAI crew.
-   The tools they use will internally call the relevant `mcp-obsidian` or `mcp_desktop-commander` functions.
-   Error handling and logging will be crucial for robust operation.
-   The `vault_path` will be a pre-configured setting for these agents ( `C:\SpiralDrive\future-stack\obsidian-vault\future-stack`).

This blueprint will be refined as we begin the actual implementation of these CrewAI agents (which we've deferred as task AI-002).
