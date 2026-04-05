import React, { useState, useEffect } from 'react';
import { IconFolder } from '../../components/Icons';

const StudentDashboard = ({ 
  currentUser, projects, setProjects, tasks, setTasks, submissions, setSubmissions, view, getProjectProgress, isTaskOverdue 
}) => {
  const studentProjects = projects.filter(p => p.students.includes(currentUser.email));
  const [activeProjectId, setActiveProjectId] = useState(null);
  
  const [teammateInput, setTeammateInput] = useState("");
  const [teamList, setTeamList] = useState([]);

  // Auto-select the first project if none is active
  useEffect(() => {
    if (studentProjects.length > 0 && !activeProjectId) {
      setActiveProjectId(studentProjects[0].id);
    }
  }, [studentProjects, activeProjectId]);

  const handleAddTeammate = () => {
    if (teammateInput.trim() !== '') {
      setTeamList([...teamList, teammateInput.trim()]);
      setTeammateInput("");
    }
  };

  const removeTeammate = (email) => {
    setTeamList(teamList.filter(t => t !== email));
  };

  // 1. Create Project View 
  if (view === 'create_project' || (studentProjects.length === 0 && view !== 'create_project')) {
    return (
      <div>
        <h2 className="text-2xl mb-4">Create New Project</h2>
        {studentProjects.length === 0 && <p className="text-muted mb-4">You have no active projects. Initialize one to get started.</p>}
        
        <div className="card" style={{ maxWidth: '600px' }}>
          <div className="card-title">Project Details Submission</div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newProject = {
              id: projects.length + 1,
              title: formData.get('title'),
              description: formData.get('description'),
              department: currentUser.department,
              year: currentUser.year,
              section: currentUser.section,
              mentor: formData.get('mentor'),
              students: [currentUser.email, ...teamList], 
              teamLeader: currentUser.email,
              gitRepo: formData.get('gitRepo'),
              status: 'Pending', 
              milestone: 'Ideation & Planning',
              feedback: ''
            };
            setProjects([...projects, newProject]);
            setActiveProjectId(newProject.id);
            setTeamList([]); // Reset
            alert("Project submitted successfully! Check your dashboard while waiting for Mentor approval.");
          }}>
            <div className="form-group">
              <label>Project Title</label>
              <input type="text" name="title" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" className="form-control" rows="3" required></textarea>
            </div>
            <div className="form-group">
              <label>Project Git Repository (URL)</label>
              <input type="url" name="gitRepo" className="form-control" placeholder="e.g. https://github.com/..." required />
            </div>
            
            <div className="form-group">
              <label>Add Team Members by Email</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="email" 
                  value={teammateInput}
                  onChange={(e) => setTeammateInput(e.target.value)}
                  className="form-control" 
                  placeholder="e.g. teammate@uni.edu" 
                />
                <button type="button" className="btn btn-outline" onClick={handleAddTeammate}>Add</button>
              </div>
              {teamList.length > 0 && (
                <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                  {teamList.map((tm, i) => (
                    <span key={i} className="badge badge-neutral flex items-center gap-2">
                       {tm} <span style={{cursor: 'pointer', color: 'red'}} onClick={() => removeTeammate(tm)}>x</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group mt-4">
              <label>Select Mentor Email</label>
              <select name="mentor" className="form-control" required>
                <option value="jane.smith@university.edu">Dr. Jane Smith (jane.smith@university.edu)</option>
                <option value="mark.lee@university.edu">Prof. Mark Lee (mark.lee@university.edu)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-4 w-full">Initialize Project</button>
          </form>
        </div>
      </div>
    );
  }

  if (studentProjects.length === 0) return null;

  // Active Context Logic
  const activeProject = studentProjects.find(p => p.id === parseInt(activeProjectId)) || studentProjects[0];
  const projectTasks = tasks.filter(t => t.projectId === activeProject.id);
  const progress = getProjectProgress(activeProject.id);

  // Global Context Selector Component (renders at the top of all views except creation)
  const ContextSelector = () => (
    <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="flex items-center gap-4">
        <span className="font-bold text-muted">Currently Analyzing:</span>
        <select 
           className="form-control" 
           style={{ width: '300px', margin: 0 }}
           value={activeProject.id}
           onChange={(e) => setActiveProjectId(e.target.value)}
        >
          {studentProjects.map(p => (
             <option key={p.id} value={p.id}>{p.title} ({p.status})</option>
          ))}
        </select>
        <span className={`badge ${activeProject.status === 'Pending' ? 'badge-warning' : 'badge-info'}`}>
          Status: {activeProject.status}
        </span>
      </div>
      {activeProject.gitRepo && (
        <div>
          <a href={activeProject.gitRepo} target="_blank" rel="noreferrer" className="badge badge-neutral" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
            🔗 {activeProject.gitRepo}
          </a>
        </div>
      )}
    </div>
  );

  // 2. Dashboard View
  if (view === 'dashboard') {
    const totalProjects = studentProjects.length;
    const allMyTasks = tasks.filter(t => studentProjects.some(p => p.id === t.projectId));
    const totalPending = allMyTasks.filter(t => t.status !== 'Completed').length;
    const totalCompletedTasks = allMyTasks.filter(t => t.status === 'Completed').length;
    const delayedProjects = studentProjects.filter(p => p.status === 'Delayed').length;

    return (
      <div>
        <h2 className="text-2xl mb-4">Student Dashboard</h2>

        {/* Premium Global Stats Hero Banner */}
        <div className="hero-banner">
          <div className="hero-stats-grid">
             <div className="hero-stat-card">
               <div className="hero-stat-title">Total Projects</div>
               <div className="hero-stat-value">{totalProjects}</div>
             </div>
             <div className="hero-stat-card" style={delayedProjects > 0 ? { borderLeft: '4px solid #fca5a5' } : {}}>
               <div className="hero-stat-title">Projects Delayed</div>
               <div className="hero-stat-value" style={delayedProjects > 0 ? { color: '#fca5a5' } : {}}>{delayedProjects}</div>
             </div>
             <div className="hero-stat-card">
               <div className="hero-stat-title">Tasks Completed</div>
               <div className="hero-stat-value">{totalCompletedTasks}</div>
             </div>
             <div className="hero-stat-card">
               <div className="hero-stat-title">Tasks Pending</div>
               <div className="hero-stat-value">{totalPending}</div>
             </div>
          </div>
        </div>

        <ContextSelector />
        
        <div className="grid-3">
          <div className="card">
            <div className="card-title">Project Progress</div>
            <p className="text-2xl">{progress}%</p>
            <div className="progress-container">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-muted mt-4">Current Phase: {activeProject.milestone}</p>
          </div>
          <div className="card">
            <div className="card-title">Your Tasks</div>
            <p className="text-2xl">{projectTasks.filter(t => t.status === 'Completed').length} / {projectTasks.length}</p>
            <p className="text-sm text-muted mt-4">Completed</p>
          </div>
          <div className="card">
            <div className="card-title">Mentor Feedback</div>
            <p className="text-sm" style={{ fontStyle: 'italic' }}>{activeProject.feedback || 'Wait for mentor review.'}</p>
            <p className="text-sm text-muted mt-4">Mentor: {activeProject.mentor}</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Tasks View
  if (view === 'tasks') {
    return (
      <div>
        <h2 className="text-2xl mb-4">Task Management</h2>
        <ContextSelector />
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Active Tasks</div>
            <div className="task-list">
              {projectTasks.map(task => (
                <div key={task.id} className={`task-item ${isTaskOverdue(task) ? 'overdue' : ''}`}>
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <p className="text-sm text-muted">Deadline: {task.deadline} • Assignee: {task.assignee}</p>
                    {task.proofUrl && (
                      <a href={task.proofUrl} target="_blank" rel="noreferrer" className="text-sm" style={{ color: 'var(--success)', display: 'inline-block', marginTop: '0.25rem' }}>
                        🔗 Verification Proof Confirmed
                      </a>
                    )}
                  </div>
                  <div className="task-actions">
                    <select 
                      value={task.status} 
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        if (newStatus === 'Completed') {
                          const proof = prompt("Please provide a GitHub Commit Link or Pull Request URL to verify task completion:");
                          if (proof && proof.trim() !== "") {
                            const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus, proofUrl: proof.trim() } : t);
                            setTasks(updatedTasks);
                          } else {
                            alert("Verification proof is mandatory to mark a task as Complete.");
                          }
                        } else {
                          const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus, proofUrl: null } : t);
                          setTasks(updatedTasks);
                        }
                      }}
                      className="form-control" style={{ padding: '0.25rem', fontSize: '0.75rem', width: 'auto' }}
                      disabled={task.status === 'Completed' && currentUser.email !== activeProject.teamLeader && currentUser.email !== task.assignee}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>
              ))}
              {projectTasks.length === 0 && <p className="text-muted">No tasks added yet.</p>}
            </div>
          </div>
          
          {currentUser.email === activeProject.teamLeader ? (
            <div className="card">
              <div className="card-title">Assign New Task</div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newTask = {
                  id: tasks.length + 1,
                  projectId: activeProject.id,
                  title: formData.get('title'),
                  deadline: formData.get('deadline'),
                  assignee: formData.get('assignee'),
                  status: 'Pending',
                  proofUrl: null
                };
                setTasks([...tasks, newTask]);
                e.target.reset();
              }}>
                <div className="form-group">
                  <label>Task Title</label>
                  <input type="text" name="title" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select name="assignee" className="form-control" required>
                     {activeProject.students.map(email => (
                        <option key={email} value={email}>{email}</option>
                     ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input type="date" name="deadline" className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary">Assign Task</button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-color)', border: '1px dashed var(--border-color)', height: '100px' }}>
               <p className="text-muted">🔒 Only the Team Leader ({activeProject.teamLeader}) can assign new tasks.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Submissions View
  if (view === 'submissions') {
    const mySubmissions = submissions.filter(s => s.projectId === activeProject.id);
    return (
      <div>
        <h2 className="text-2xl mb-4">Submissions</h2>
        <ContextSelector />
        <div className="submission-area" onClick={() => {
          const fileName = prompt("Enter file name to simulate upload (e.g., Final_Report.pdf):");
          if (fileName) {
            setSubmissions([...submissions, { id: submissions.length + 1, projectId: activeProject.id, filename: fileName, phase: activeProject.milestone, date: '2023-11-01', status: 'Pending Review' }]);
          }
        }}>
          <IconFolder />
          <h3>Click to Simulate File Upload</h3>
          <p className="text-sm mt-4">Upload Reports, PPTs, or Documents</p>
        </div>
        <div className="card">
          <div className="card-title">Previous Submissions</div>
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Phase</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mySubmissions.map(s => (
                <tr key={s.id}>
                  <td>{s.filename}</td>
                  <td>{s.phase}</td>
                  <td>{s.date}</td>
                  <td><span className={`badge ${s.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{s.status}</span></td>
                </tr>
              ))}
              {mySubmissions.length === 0 && <tr><td colSpan="4">No files uploaded for this project yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

export default StudentDashboard;
