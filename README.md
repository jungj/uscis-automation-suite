# Legal-Document-Automation: Passport-to-USCIS Pipeline

## ⚖️ Project Overview
This project provides a robust, professional-grade solution for extracting PII (Personally Identifiable Information) from scanned passports and populating standardized USCIS forms (PDFs). Developed within a legal and cybersecurity context, this pipeline transforms a manual, error-prone clerical task into a secure, automated workflow by bridging **Google Workspace Studio** with **Google Apps Script**.

---

## 🏗️ System Architecture
The project follows a "Full-Stack Automation" design, separating the input, processing, and output layers to ensure modularity and security.

### 1. The Input Layer: Google Workspace Studio (The Sensor)
The automation begins with a Google Workspace Studio application that acts as the system's entry point:
* **Trigger:** An upload of a passport image or PDF to a monitored Google Drive folder.
* **Extraction (OCR):** The app utilizes OCR technology to parse the image and identify core identity fields.
* **Database Write:** Extracted data is written directly to a designated "passport" sheet within a Google Spreadsheet.

### 2. The Processing Layer: Google Apps Script (The Brain)
The core logic is handled via JavaScript in Google Apps Script. This layer manages the data lifecycle and document generation.

### 3. The Output Layer: Google Slides & PDF (The UI)
Unlike standard document editors, this system utilizes **Google Slides** as a "Fixed-Layout" engine:
* **Dimensions:** Page setup is set to 8.5" x 11" to match official legal forms.
* **Precision:** Replacement tags (e.g., `{{Surname}}`) are placed at exact coordinates over a non-movable background image of the USCIS form.
* **Final Product:** A flattened, professional-grade PDF is exported to the destination folder.

---

## 🚀 Technical Challenge: The "Automation-to-Automation" Barrier
A significant technical hurdle identified during development was the security restriction regarding service-account triggers within the Google ecosystem.

**The Issue:**
Google intentionally prevents "automation-to-automation" triggers to avoid infinite loops and cascading service calls. Consequently, when **Google Workspace Studio** (an automated service) inserts a row into a sheet, it does **not** fire the standard `onChange` or `onEdit` triggers for **Apps Script**.

**The Engineering Solution (Polling Pattern):**
To ensure system reliability without manual intervention, a **Polling Architecture** was implemented:
* **Time-Driven Trigger:** The script is configured to "patrol" the spreadsheet independently every 1–5 minutes.
* **Decoupled Logic:** By checking for a "Status" column rather than a change event, the system remains resilient to API latency and can handle bulk data imports without missing records.

---

## 🔒 Cybersecurity & Data Integrity
As a solution designed for a law office, security and data privacy are core components of the architecture:
* **Principle of Least Privilege:** Script authorizations are restricted to specific project-level folders rather than broad Drive access.
* **Audit Trail:** Every execution is logged, providing a clear history of which forms were generated and when.
* **Data Sanitization:** The script marks records as "Completed" immediately after generation to prevent duplicate exposures or redundant processing.
* **PII Protection:** All processing occurs within the encrypted boundaries of the Google Workspace environment.

---

## 📍 Project Status & Roadmap (v.0.1)
This project is currently in its **Minimum Viable Product (MVP)** stage. The primary goal was to establish a secure, functional automation pipeline.

### Current Capabilities:
* Successful OCR extraction of identity fields from passport scans.
* Automated polling logic to bypass platform trigger restrictions.
* Precise mapping of `{{Surname}}` and `{{Given Name}}` to Form G-28 templates.

### Future Roadmap:
* **Expanded Data Mapping:** Integration of Alien Registration Numbers (A-Numbers), contact details, and mailing addresses.
* **Logic Enhancements:** Character-limit validation for specific USCIS form fields to prevent text cutoff.
* **UI Improvements:** Implementation of a "Status" dashboard within the Google Sheet for better visibility of processed records.

---

## 🔧 Installation & Setup
1. **Template:** Create a Google Slide (8.5x11), set the USCIS form as the background, and add replacement tags.
2. **Script:** Deploy the provided `Code.gs` in the Google Apps Script editor.
3. **Configuration:** Update the `SHEET_ID`, `TEMPLATE_ID`, and `FOLDER_ID` variables in the script.
4. **Trigger:** Set a Time-driven trigger for the `processNewPassports` function.

---
**Disclaimer:** *This project is a Proof of Concept developed by a Cybersecurity student and Legal Professional. Ensure compliance with firm security policies and data privacy regulations (e.g., GDPR, CCPA) before deployment with live client data.*
