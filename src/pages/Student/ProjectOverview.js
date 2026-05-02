import React from 'react';

const ProjectOverview = ({ activeProject, projectTasks, progress }) => {
  return (
    <div className="grid-3 mb-8">
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
  );
};

export default ProjectOverview;
