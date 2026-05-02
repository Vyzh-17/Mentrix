import React from 'react';

const ProjectTasks = ({ currentUser, activeProject, tasks, setTasks, projectTasks, isTaskOverdue }) => {

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleAssignTask = (e) => {
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
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-title">Active Tasks</div>
        <div className="task-list">
          {projectTasks.map(task => {
            const isOverdue = isTaskOverdue(task);
            const isMyTask = (currentUser.email === task.assignee);
            
            return (
              <div key={task.id} className={`task-item ${isOverdue ? 'overdue' : ''}`}>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p className="text-sm text-muted">
                    Deadline: {task.deadline} • Assignee: {task.assignee}
                  </p>
                  
                  {task.proofUrl && (
                    <a href={task.proofUrl} target="_blank" rel="noreferrer" className="text-sm" style={{ color: 'var(--success)', display: 'inline-block', marginTop: '0.25rem' }}>
                      🔗 GitLink
                    </a>
                  )}
                </div>
                
                <div className="task-actions">
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="form-control" 
                    style={{ padding: '0.25rem', fontSize: '0.75rem', width: 'auto' }}
                    disabled={!isMyTask}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            );
          })}
          
          {projectTasks.length === 0 && (
            <p className="text-muted">No tasks added yet.</p>
          )}
        </div>
      </div>
      
      {currentUser.email === activeProject.teamLeader ? (
        <div className="card">
          <div className="card-title">Assign New Task</div>
          <form onSubmit={handleAssignTask}>
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
  );
};

export default ProjectTasks;
