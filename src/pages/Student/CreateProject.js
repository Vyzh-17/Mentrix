import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = ({ currentUser, projects, setProjects }) => {
  const navigate = useNavigate();
  const [teammateInput, setTeammateInput] = useState("");
  const [teamList, setTeamList] = useState([]);

  const handleAddTeammate = () => {
    if (teammateInput.trim() !== '') {
      setTeamList([...teamList, teammateInput.trim()]);
      setTeammateInput("");
    }
  };

  const removeTeammate = (emailToRemove) => {
    const filteredList = teamList.filter(email => email !== emailToRemove);
    setTeamList(filteredList);
  };

  const handleSubmit = (e) => {
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
    alert("Project submitted successfully! Check your dashboard while waiting for Mentor approval.");
    navigate(`/student`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button className="btn btn-outline" onClick={() => navigate('/student')}>← Back</button>
        <h2 className="text-2xl m-0">Create New Project</h2>
      </div>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="card-title">Project Details Submission</div>
        <form onSubmit={handleSubmit}>
          
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
                     {tm} 
                     <span style={{cursor: 'pointer', color: 'red'}} onClick={() => removeTeammate(tm)}>x</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group mt-4">
            <label>Select Mentor</label>
            <select name="mentor" className="form-control" required>
              <option value="amit.gupta@university.edu">Dr. Amit Gupta (amit.gupta@university.edu)</option>
              <option value="vikram.singh@university.edu">Prof. Vikram Singh (vikram.singh@university.edu)</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary mt-4 w-full">Initialize Project</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
