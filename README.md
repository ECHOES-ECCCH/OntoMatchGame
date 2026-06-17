# OntoMatchGame

## Introduction

Semantic Data Representation enables the generation, sharing, and reuse of Cultural Heritage data across institutions and disciplines. However, understanding and manipulating semantic data requires familiarity with ontologies and semantic concepts.

**OntoMatchGame** is an educational serious game designed to help users discover ontology concepts through interactive challenges based on real cultural heritage datasets.

The application allows users to:

- Create and manage an account
- Play ontology-based challenges
- Track their progression
- Access rankings and statistics
- Learn semantic concepts through gamification

**Production URL:**  
https://ontomatchgame.huma-num.fr/

---

# Technical Stack

## Frontend

- Vue.js
- TypeScript
- Vite
- VueFlow (free mode)

## Backend

- PHP
- REST API endpoints

## Database

- MySQL

---

# Project Architecture

```text
┌─────────────┐
│   Frontend  │
│   Vue.js    │
└──────┬──────┘
       │ API Calls
       ▼
┌─────────────┐
│   Backend   │
│     PHP     │
└──────┬──────┘
       │ SQL Queries
       ▼
┌─────────────┐
│   MySQL DB  │
└─────────────┘
```

## Frontend Responsibilities

The frontend is responsible for:

- User interface rendering
- Challenge loading
- Ontology data processing
- User interactions
- Progress display

## Backend Responsibilities

The backend handles:

- Authentication
- Account management
- Session management
- Statistics generation
- Rankings generation
- Database persistence

## Database Responsibilities

The database stores:

- User accounts
- User progression
- Game sessions
- Rankings
- User history

---

# Installation

## Frontend

Install dependencies:

```bash
npm install
```

Launch the development server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173/front/
```

## Backend

Install a local PHP environment such as:

- WAMP
- XAMPP
- Laragon

Copy the backend files into the web server root directory and start the server.

## Database

Import the provided SQL dump into MySQL.

Example access URL:

```text
http://localhost:8080/phpmyadmin/
```

---

# Ontology Data Management

Ontology data is not stored in the database.

Instead, ontology resources are loaded directly from static files within the frontend.

## Ontology Files

```text
public/data/<ontologyTag>/
└── data.xml
```

## Scenario Files

```text
public/json/<ontologyTag>/
├── fr/
├── en/
└── ...
```

These resources contain:

- Ontology definitions
- Scenarios
- Chapters
- Instances
- Images

---

# Application Workflow

## Authentication

| Feature        | Endpoint          |
| -------------- | ----------------- |
| Login          | login.php         |
| Registration   | userSave.php      |
| Password reset | sendresetlink.php |

## Homepage

| Data       | Endpoint         |
| ---------- | ---------------- |
| Username   | getusername.php  |
| User ID    | getuserid.php    |
| History    | gethistory.php   |
| Statistics | getuserstats.php |

## Challenge Lifecycle

### Starting a Challenge

When a player starts a challenge:

1. A new game session is created.
2. The session is stored in the database.
3. User history is updated.
4. Progress tracking begins.

### Validating an Answer

When a player submits a correct answer:

1. The current session is updated.
2. User progression is updated.
3. User statistics are recalculated.
4. History data is updated.

---

# Rankings and Statistics

| Feature    | Endpoint         |
| ---------- | ---------------- |
| Rankings   | getrankings.php  |
| Statistics | getuserstats.php |

---

# Progress Reset

## Reset Entire Game Progression

```text
resetgame.php
```

Removes all progression data related to the main ontology game.

## Reset a Single Chapter

```text
resetprogression.php
```

Resets progression for a specific chapter.

---

# Adding a New Ontology

## Database

Create entries in:

- ontology
- scenario
- chapter

tables.

## Frontend

Create the ontology folder:

```text
public/data/<ontologyTag>/
└── data.xml
```

The folder name must exactly match the value of `ontologyTag`.

Create the scenario structure:

```text
public/json/<ontologyTag>/
├── fr/
│   └── chapter/
├── en/
│   └── chapter/
└── ...
```

Add:

- Chapter JSON files
- Instances.json
- Images

Update:

```text
src/assets/json/scenariiCatalog.json
```

## StreamingAssets

Mirror the same structure in:

```text
StreamingAssets/scenarii/
```

For each new scenario:

```text
Scenario/
├── scenario.json
├── Chapters/
│   └── chapter.json
└── Instances/
    ├── Instances.json
    └── Images/
```

Update the `scenariiCatalog.json` file accordingly.

---

# Database Overview

```text
User
 │
 ├── Session
 │
 ├── History
 │
 └── Progression

Ontology
 │
 └── Scenario
         │
         └── Chapter
```

---

# Maintenance Notes

When modifying or extending the project:

- Keep database and frontend ontology structures synchronized.
- Ensure `ontologyTag` values remain consistent across all resources.
- Update `scenariiCatalog.json` whenever a scenario is added.
- Verify translations are available for all supported languages.
- Test progression tracking after adding new chapters or scenarios.

---

# Free Mode

The Free Mode allows users to create their own ontology diagrams using entities, properties, and instances available within the game ontologies.

The diagram editor is built using **Vue Flow**, which provides the node-based interface, drag-and-drop interactions, and connection management between ontology elements.

## Features

For each ontology selected in the left sidebar, the following elements are available:

- Entities
- Properties
- Instances

Users can drag and drop these elements onto the board to build custom semantic schemas and visualize relationships between ontology concepts.

The board supports:

- Node positioning
- Drag & drop creation
- Connections between nodes
- Diagram editing
- Zoom and pan navigation

## Technical Implementation

The board is implemented with **Vue Flow**.

Each ontology element added to the board is represented as a Vue Flow node containing:

- An identifier
- A node type
- Ontology metadata
- Position coordinates
- Zoom level

Relationships between elements are represented as Vue Flow edges (Not started yet).

The complete diagram state (nodes and edges) is serialized into JSON for persistence and export.

## Saving Diagrams

Created diagrams can be saved and reopened later.

When a diagram is saved:

1. The current Vue Flow state is serialized into JSON.
2. The JSON representation is sent to the backend.
3. The diagram is stored in the database through the `freemode.php` endpoint.

Saved diagrams can then be retrieved and loaded back into the board for further editing.

## Import / Export

Free Mode also supports local backup and sharing of diagrams.

Users can:

- Export a diagram as a JSON file.
- Import a previously exported diagram.
- Continue editing imported diagrams within the board.

## Data Format

Free Mode diagrams are stored as JSON objects containing:

- Nodes
- Edges
- Node positions
- Ontology metadata

This structure is used both for database persistence and file import/export operations.

## Workflow

```text
Ontology Resources
       │
       ▼
Drag & Drop Cards
       │
       ▼
Vue Flow Board
       │
       ▼
Nodes + Edges
       │
       ├── Save
       │      ▼
       │  freemode.php
       │      ▼
       │  MySQL Database
       │
       └── Export
              ▼
         JSON File
```
