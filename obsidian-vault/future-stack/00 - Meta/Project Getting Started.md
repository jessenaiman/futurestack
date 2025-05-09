# Project Getting Started Guide

## 1. Introduction

Welcome to the `future-stack` project! This guide provides essential information for both human developers and AI coding assistants to collaborate effectively on this project. Our primary project management and knowledge base is within this Obsidian vault.

**Goal:** To create a robust and well-documented system, leveraging AI for enhanced productivity and quality.

**Collaboration Model:**
-   **Humans:** Define high-level goals, review AI-generated work, handle complex problem-solving, and manage overall project direction.
-   **AI Assistants (like Gemini in Cursor):** Assist with code generation, file manipulation, task updates in Obsidian, research, documentation, and adhering to project standards.
-   **Obsidian:** Central hub for tasks, project plans, documentation, meeting notes, and AI prompts.

## 2. Obsidian Vault & Project Structure

This Obsidian vault is the single source of truth for project planning and documentation.

-   **`00 - Meta/`**: Contains global project information.
    -   **`00 - Meta/Templates/`**: Houses all Templater plugin templates (e.g., for new tasks, projects, meeting notes).
    -   **`00 - Meta/Project Getting Started.md`**: This document.
    -   **`00 - Meta/AI Prompts & Examples/`**: A dedicated folder for storing effective prompts and examples for instructing AI agents. (You can create this folder).
-   **`01 - Projects/`**: Each sub-folder represents a major project (e.g., `Project Omega Spiral`).
    -   Contains project-specific tasks, notes, and dashboards.
    -   Tasks are individual `.md` files, typically generated from templates.
-   **`02 - Tasks/`**: (Optional, if not using per-project task folders) A central place for all tasks. *Currently, we are creating tasks within their respective project folders in `01 - Projects`.*
-   **`03 - Meetings/`**: Notes from project meetings.
-   **`04 - Reference & Resources/`**: General reference material.
-   **`05 - Archive/`**: Completed or obsolete projects and notes.

**Key Obsidian Plugins in Use:**
-   **Projects (Marcus Olsson):** For database-like views of tasks.
-   **Tasks:** For managing to-do items.
-   **Templater:** For creating new notes from predefined structures. Ensure "Trigger Templater on new file creation" is ON.
-   **Dataview:** For querying and displaying data.
-   **Kanban:** For visual task management.
-   **Obsidian Git:** For version control.
-   **`mcp-obsidian` (AI Tooling):** Provides programmatic access for AI agents.

## 3. AI Agent Instructions & Interaction (Cursor Rules)

**This section serves as primary instructions ("Cursor Rules") for AI assistants interacting with this project via the Cursor IDE or other MCP tools.**

**Core Principles for AI:**
1.  **Primacy of Obsidian:** All project tasks, status updates, and core documentation should reside or be reflected in this Obsidian vault.
2.  **Use Defined Structures:** When creating new notes, always use the appropriate template from `00 - Meta/Templates/`.
3.  **Leverage Plugins via `mcp-obsidian` (or Local REST API if implemented):**
    *   To create/update tasks: Use file creation/modification tools, ensuring frontmatter is correctly updated for `Projects` and `Tasks` plugins. `mcp-obsidian_obsidian_patch_content` can be useful.
    *   To query tasks: If direct query tools are limited, ask the user for guidance.
4.  **GitHub Integration:** Link Obsidian tasks to GitHub issues via the `relatedIssue` frontmatter field.
5.  **Clarity and Context:** Ask for clarification if requests are ambiguous. Cite sources/modified files. Refer to this "Getting Started" page if needed.
6.  **File Paths:**
    *   Vault root: `C:\SpiralDrive\future-stack\obsidian-vault\future-stack\`
    *   Verify paths if unsure. Use `mcp_desktop-commander_list_directory`.
7.  **Templater Date Processing:**
    *   Templates use `2025-05-08 13:03`. If dates appear as raw code, flag for troubleshooting. "Trigger Templater on new file creation" should be ON.

**Workflow Example: Creating a New Task**
1.  **User Request:** "Create a task for Project Omega Spiral: 'Refactor rendering engine', priority high, due next Friday."
2.  **AI Action:**
    a.  Identify template (`Omega Spiral Task Template.md`).
    b.  Path: `C:\...\01 - Projects\Project Omega Spiral\TECH-XXX Refactor rendering engine.md`.
    c.  Prepare content: `status: todo`, `priority: high`, `dueDate: <YYYY-MM-DD>`, `category: C++ Game Code`, description.
    d.  Use `mcp_desktop-commander_write_file`.
    e.  Confirm, note Templater processing.

## 4. Prompts & Examples for AI Agents

*(To be populated in `00 - Meta/AI Prompts & Examples/` folder.)*
-   **Goal:** State what needs to be achieved.
-   **Context:** Background, file paths, GitHub issues.
-   **Key Information:** Specific data points.
-   **Expected Output:** Describe successful completion.

## 5. Code and Commit Standards
-   Follow conventional commit messages.
-   Lint and test code.
-   Keep PRs focused.

## 6. Troubleshooting
-   **Templater Dates Not Processing:** Check "Trigger..." setting, try manual run, verify syntax.
-   **AI Misinterpreting:** Rephrase, provide context, refer to this guide.

---
*Last updated: 2025-05-08 13:03*
