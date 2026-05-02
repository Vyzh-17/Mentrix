# Mentrix: Academic Project Mentoring System 🚀

Mentrix is a comprehensive, full-stack web application designed to bridge the gap between students, academic mentors, and project coordinators. It modernizes the academic project lifecycle by offering a centralized platform for team formation, dynamic task tracking, document submissions, and structured mentor feedback.

---

## 🎯 Problem Statement
In academic institutions, tracking student capstone or semester projects is often chaotic. Students struggle to collaborate effectively, while mentors and coordinators lack a unified dashboard to monitor progress, review documents, and enforce deadlines. 

**Mentrix solves this by:**
1. Enforcing strict team-building logic (matching students by Class Section and Year).
2. Providing a clear, dynamic workflow for tasks and milestones.
3. Establishing a direct feedback loop between students and mentors.

---

## 🛠️ Technology Stack
- **Frontend**: React.js (Vite), React Router, Vanilla CSS (Glassmorphism UI)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt for password hashing

---

## 👤 Role-Based Architecture
Mentrix employs a strict Role-Based Access Control (RBAC) system to ensure users only see what they need to see:

1. **🎓 Student**:
   - Can create projects and invite teammates (filtered by Section & Year).
   - Can dynamically create, assign, and update the status of tasks.
   - Can submit project updates (links to Reports, PDFs, Presentations).
   - Can view mentor feedback and overall project progress.

2. **🧑‍🏫 Mentor**:
   - Gets a dedicated "Mentor Hub" dashboard to view all assigned projects.
   - Reviews student submissions in real-time.
   - Can "Approve" submissions or "Reject" them with specific text feedback.
   - Has the authority to advance the project to the next lifecycle Phase.

3. **⚡ Coordinator**:
   - Possesses global oversight of all active projects across all sections and years.
   - Can monitor the status, phase, and overall completion percentage of the entire batch.

---

## ⚙️ Key Features & Workflows

### 1. Granular Team Building
During signup, students must specify their **Class Section** (e.g., A, B, C) and **Academic Year** (e.g., 2024, 2025). When a student proposes a new project, the system queries the database and only permits them to invite teammates who share the exact same Section and Year, preventing cross-batch contamination.

### 2. Dynamic Task Engine
Students are empowered to manage their own sprint cycles. They can create tasks, set deadlines, and assign them to specific teammates. 
- Tasks exist in three states: `Pending`, `In-Progress`, and `Completed`. 
- As students mark tasks as completed via interactive dropdowns, the project's overall Progress Bar automatically recalculates in real-time.

### 3. Submission & Review Loop
Instead of emailing files back and forth, students use the **"+ Submit Work"** feature to submit URLs (Google Drive, GitHub, etc.) to their active documents.
- These submissions queue up in the Mentor's dashboard.
- Mentors can review the documents and click **Approve** (marking it green) or **Needs Correction** (which prompts them to type specific feedback that is instantly sent back to the student).

### 4. Phase-Based Progression
Projects do not simply jump from 0 to 100%. Mentrix introduces a formal lifecycle. Projects move through distinct phases:
1. `Ideation`
2. `Implementation` 
3. `Report`
4. `Completed`

Mentors have the ultimate authority to advance a project's phase once they are satisfied with the submitted deliverables.

---

## 🗄️ Database Models (MongoDB)

1. **User**: Stores name, email, hashed password, role (`student`, `mentor`, `coordinator`), `section`, and `year`.
2. **Project**: Stores title, description, assigned mentor, array of student IDs, current `phase`, `status`, and an activity log.
3. **Task**: Links to a Project and a User (Assignee). Stores title, description, deadline, and `status`.
4. **Update**: The core submission model. Links to a Project and Student. Stores file links, description, mentor `feedback`, and review `status` (submitted, approved, rejected).

---

## 🚀 Future Scope
- Integration of a cloud file-storage system (AWS S3) for direct PDF/Report uploads.
- Automated email notifications for approaching task deadlines.
- Advanced Coordinator analytics (charts and graphs representing batch performance).
