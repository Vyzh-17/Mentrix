import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Discussion from './Discussion';

const StudentView = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [updateDesc, setUpdateDesc] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    
    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const projRes = await axios.get('http://localhost:5000/api/projects', config);
            setProjects(projRes.data);
            
            const updateRes = await axios.get('http://localhost:5000/api/updates', config);
            setUpdates(updateRes.data.filter(u => u.student?._id === user._id || u.student === user._id));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/updates', {
                project: selectedProject,
                description: updateDesc,
                fileLinks: []
            }, config);
            setUpdateDesc('');
            fetchData();
            alert('Update submitted successfully!');
        } catch (error) {
            alert('Error submitting update: ' + error.response?.data?.message);
        }
    };

    const handleProjectCommentAdded = (updatedProject) => {
        setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
    };

    const handleUpdateCommentAdded = (updatedReport) => {
        setUpdates(updates.map(u => u._id === updatedReport._id ? updatedReport : u));
    };

    return (
        <div>
            <h2>My Projects</h2>
            {projects.map(p => (
                <div key={p._id} className="card">
                    <div className="flex-between">
                        <h3>{p.title}</h3>
                        <span className={`badge badge-${p.status}`}>{p.status}</span>
                    </div>
                    <p>{p.description}</p>
                    <small>Mentor: <strong>{p.mentor?.name}</strong></small>
                    
                    <Discussion 
                        type="projects" 
                        id={p._id} 
                        comments={p.comments} 
                        user={user} 
                        onCommentAdded={handleProjectCommentAdded}
                    />
                </div>
            ))}

            <div className="card" style={{ background: '#f0f4ff' }}>
                <h2>Submit Progress Report</h2>
                <form onSubmit={handleUpdateSubmit}>
                    <select 
                        className="input-field" 
                        value={selectedProject} 
                        onChange={(e) => setSelectedProject(e.target.value)}
                        required
                    >
                        <option value="">Select Project</option>
                        {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                    <textarea 
                        className="input-field" 
                        placeholder="What did you achieve this week?" 
                        value={updateDesc} 
                        onChange={(e) => setUpdateDesc(e.target.value)} 
                        required 
                        style={{ minHeight: '100px' }}
                    />
                    <button type="submit" className="btn btn-secondary">Submit Report</button>
                </form>
            </div>

            <h2>My Previous Reports</h2>
            {updates.map(u => (
                <div key={u._id} className="card">
                    <div className="flex-between">
                        <strong>Update on {new Date(u.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <p>{u.description}</p>
                    
                    <Discussion 
                        type="updates" 
                        id={u._id} 
                        comments={u.comments} 
                        user={user} 
                        onCommentAdded={handleUpdateCommentAdded}
                    />
                </div>
            ))}
        </div>
    );
};

export default StudentView;
