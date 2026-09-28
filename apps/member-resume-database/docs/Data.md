# Member Profile Form Data Fields

This document lists all the fields, data structures, and validation rules a student needs to fill out in the UCF Member Resume Database submission form.

---

## 1. Personal & Contact Information

| Field Name | Type | Constraints / Requirements | Description |
| :--- | :--- | :--- | :--- |
| **Full Name** | String | 1–50 characters, letters/spaces only (no numbers or special characters) | Your display name on the resume database. |
| **Email Address** | String | Valid email address format (preferably `@knights.ucf.edu`) | Used for administrative communications. |
| **Status** | Select | Must be one of:<br>• `Seeking Internship`<br>• `Seeking Full-time`<br>• `Employed` | Your current career search status. |
| **Personal Bio** | Text | 1–300 characters | A brief elevator pitch or summary of your engineering interests. |
| **Resume PDF Link** | String | Max 200 characters, valid URL format (e.g. `https://...`), no whitespace | Direct link to your hosted resume PDF. |

---

## 2. Professional & Social Links

Students can link up to 5 external profiles.

| Field Name | Type | Constraints / Requirements | Description / Example |
| :--- | :--- | :--- | :--- |
| **Platform Name** | Select / String | e.g. `GitHub`, `LinkedIn`, `Portfolio`, `Twitter` | The name of the platform. |
| **Profile URL** | String | Valid URL format (e.g., `https://github.com/username`) | The link to your profile. |

---

## 3. Education Entries

At least one entry (University of Central Florida) is required.

| Field Name | Type | Constraints / Requirements | Description / Example |
| :--- | :--- | :--- | :--- |
| **School Name** | String | Max 100 characters | e.g., `University of Central Florida` |
| **Degree Type** | Select / String | e.g. `Bachelor of Science`, `Master of Science` | The level of education. |
| **Major** | String | Max 100 characters | e.g., `Computer Science`, `Electrical Engineering` |
| **GPA** | Decimal | Optional, e.g. `3.85` | Your cumulative GPA (if applicable). |
| **GPA Scale** | Decimal | Optional, e.g. `4.0` | The scale of the GPA (usually `4.0`). |
| **Start Date** | Date | YYYY-MM-DD format | When you enrolled. |
| **End Date** | Date | YYYY-MM-DD format (Optional if current) | Graduation date or expected graduation date. |
| **Is Current** | Boolean | True / False | Set to true if you are currently enrolled. |
| **Description** | Text | Optional, max 500 characters | Honors, coursework, or special designations. |

---

## 4. Skills List

A student can submit up to 50 skills. The frontend automatically categorizes these using keyword sets.

* **Constraint**: Each skill tag must be under 50 characters.
* **Examples**: `React`, `Python`, `Git`, `Altium Designer`, `C++`, `Docker`, `FastAPI`, `Tailwind CSS`.

---

## 5. Work Experience Entries

Up to 10 experience entries can be listed.

| Field Name | Type | Constraints / Requirements | Description / Example |
| :--- | :--- | :--- | :--- |
| **Company Name** | String | Max 100 characters | e.g., `Lockheed Martin`, `UCF IT` |
| **Job Title** | String | Max 100 characters | e.g., `Software Engineering Intern` |
| **Start Date** | Date | YYYY-MM-DD format | When you started the role. |
| **End Date** | Date | YYYY-MM-DD format (Optional if current) | When you left the role. |
| **Is Current Job** | Boolean | True / False | Set to true if this is your active job. |
| **Description** | Text | Max 1000 characters | Bullet points summarizing your achievements. |

---

## 6. Projects

List key academic or personal engineering projects.

| Field Name | Type | Constraints / Requirements | Description / Example |
| :--- | :--- | :--- | :--- |
| **Project Name** | String | Max 100 characters | e.g., `KnightOS Robot Controller` |
| **Description** | Text | Max 1000 characters | Detailed description of the project. |
| **Start Date** | Date | YYYY-MM-DD format | Project initiation date. |
| **End Date** | Date | YYYY-MM-DD format (Optional if ongoing) | Project completion date. |
| **Is Ongoing** | Boolean | True / False | Set to true if currently active. |
| **Project Links** | List of URLs | Array of valid URLs | Links to GitHub repositories, demos, etc. |

---

## 7. Club Memberships & Activities

List campus student chapters (IEEE, ACM, Hack@UCF, etc.).

| Field Name | Type | Constraints / Requirements | Description / Example |
| :--- | :--- | :--- | :--- |
| **Club Name** | String | Max 100 characters | e.g., `IEEE UCF Student Chapter` |
| **Role / Title** | String | Max 100 characters | e.g., `Active Member`, `Hardware Chair` |
| **Start Date** | Date | YYYY-MM-DD format | When you joined the club. |
| **End Date** | Date | YYYY-MM-DD format (Optional if current) | When your term ended. |
| **Is Active** | Boolean | True / False | Set to true if you are actively participating. |
| **Description** | Text | Max 500 characters | Description of responsibilities or projects. |

---

## 8. Certifications & Credentials

Professional or industrial credentials.

| Field Name | Type | Constraints / Requirements | Description / Example |
| :--- | :--- | :--- | :--- |
| **Certification Name** | String | Max 100 characters | e.g., `CompTIA Security+` |
| **Issuer** | String | Max 100 characters | e.g., `CompTIA` |
| **Issue Date** | Date | YYYY-MM-DD format | Date credentials were brandished. |
| **Expiration Date** | Date | YYYY-MM-DD format (Optional) | Expiration date of the credentials. |
| **Credential ID** | String | Optional, max 100 characters | Unique certification ID. |
| **Credential URL** | String | Optional, valid URL format | Link to verify certification authenticity. |

---

## 9. Administrative Metadata & Moderation

These fields are attached internally to candidate profiles for database curation, public content reporting, and audit trail records.

| Field Name | Type | Constraints / Requirements | Description / Example |
| :--- | :--- | :--- | :--- |
| **Flagged** | Boolean | True / False | Set to true if a user reports the candidate or if an administrator flags it during auditing. Hides the profile from normal viewer searches. |
| **Flag Reason** | String | Optional, max 300 characters | Explanatory note or reason why the profile was flagged (e.g. `Flagged by User Report`, `Missing resume PDF link`). |
