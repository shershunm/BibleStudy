# Design: Bible Study SaaS

**Date:** 2026-02-08
**Topic:** Core Application Design & Multilingual Strategy

## Overview
A research-grade Bible Study SaaS designed for deep study, academic research, and sermon preparation. The application features a versatile multi-pane layout and full bilingual support (English NASB and Ukrainian UMT).

## 1. User Interface & Layout
The application uses a **Multi-Pane Dashboard** philosophy to maximize productivity on desktop and tablet screens, while remaining responsive for mobile.

### Key Components
*   **Navigation Sidebar (Left):**
    *   Book/Chapter selection.
    *   Language Quick-Switcher (Toggle: EN/UA).
    *   Search Bar (Global Search for verses, dictionary terms, and notes).
*   **Primary Reader (Center):**
    *   **Main View:** Single translation focus with adjustable font size.
    *   **Compare Mode:** Side-by-side view with version selection (e.g., NASB vs. UMT).
    *   **Context Menu:** Right-click a verse to "Add Note," "Copy with Reference," or "Show in Study Tools."
*   **Study Tools Panel (Right):**
    *   **Dictionary:** Strong's Concordance and Lexicons. Primary results in current app language with English fallback.
    *   **Maps:** Interactive biblical maps based on OpenBible.info geodata.
    *   **Toolbox:** Cross-references and commentary snippets.

### Personalization
*   **Appearance:** Light and Dark mode toggle.
*   **Typography:** User-adjustable font sizes for all reading areas.

## 2. Bilingual Strategy
To ensure equal efficiency in English and Ukrainian:
*   **Hybrid Toggle:** Simple one-click switch between NASB and UMT.
*   **Language Fallback:** Study tools prioritize Ukrainian content. If specific deep-dive data is unavailable in Ukrainian, the English version is presented automatically to maintain academic depth.
*   **Bilingual Search:** The search engine indexes both English and Ukrainian translations and dictionary keywords.

## 3. Note-Taking & Export System
A comprehensive system for personal study and sermon preparation.

### Types of Notes
*   **Stand-alone Notes:** General documents (sermon notes, reflections) accessible from a central Notes Library.
*   **Verse-Linked Notes:** Created via right-click on specific verses; persists as markers in the reader.

### Features
*   **Rich Text Editor:** Headers, lists, and formatting.
*   **Drag & Drop/Paste:** Ability to copy verses, dictionary entries, and map screenshots directly into notes.
*   **Multi-Format Export:**
    *   **PDF/Print:** Direct printing or high-quality PDF generation.
    *   **Document Files:** Export to `.txt` and `.docx` (compatible with Google Docs and Apple Pages).
    *   **Cloud Cloud Sync:** Native "Save to Google Drive" integration.

## 4. Technical Architecture & Offline Support
*   **Framework:** React (Next.js/Vite) with PWA capabilities.
*   **Database:** 
    *   **Online:** Centralized user profile and notes sync.
    *   **Offline (Modular):** **IndexedDB** for local storage of downloaded Bibles and Dictionaries.
*   **Modular Download System:** Users explicitly choose which "Modules" (Translations/Datasets) to download for offline use.
*   **Geospatial Data:** Offline "geometric" maps with online high-fidelity satellite fallback.

## 5. Extensibility
The architecture is designed to be modular. Future brainstorming sessions can easily lead to new "Modules" or "Study Tool" tabs without disrupting the core reader and note-taking experience.
