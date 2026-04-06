import React from 'react';
import { IconFolder } from '../../components/Icons';

const ProjectSubmissions = ({ activeProject, submissions, setSubmissions, mySubmissions }) => {
  return (
    <div>
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
      <div className="card mt-8">
        <div className="card-title">Previous Submissions</div>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Phase</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mySubmissions.map(s => (
              <tr key={s.id}>
                <td>
                  <div>{s.filename}</div>
                </td>
                <td>{s.phase}</td>
                <td>
                  <span className={`badge ${s.status === 'Approved' ? 'badge-success' : s.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
            {mySubmissions.length === 0 && <tr><td colSpan="3">No files uploaded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectSubmissions;
