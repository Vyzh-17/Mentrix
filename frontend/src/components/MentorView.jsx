import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Discussion from './Discussion';

const MentorView = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [updates, setUpdates] = useState([]);
    
    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const projRes = await axios.get('http://localhost:5000/api/projects', config);
            setProjects(projRes.data);
            
            // In a real app, you'd fetch updates related to these projects
            // For now, let's assume we fetch all updates for simplicity
            const updateRes = await axios.get('http://localhost:5000/api/updates', config);
            setUpdates(updateRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handleStatusUpdate = async (projectId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/projects/${projectId}/status`, { status: newStatus }, config);
            fetchData();
        } catch (error) {
            alert('Failed to update status');
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
            <h2>Mentorship Dashboard</h2>
            {projects.map(p => (
                <div key={p._id} className="card">
                    <div className="flex-between">
                        <h3>{p.title}</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className={`badge badge-${p.status}`}>{p.status}</span>
                            {p.status === 'proposed' && (
                                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => handleStatusUpdate(p._id, 'active')}>
                                    Approve & Start
                                </button>
                            )}
                        </div>
                    </div>
                    <p>{p.description}</p>
                    
                    <Discussion 
                        type="projects" 
                        id={p._id} 
                        comments={p.comments} 
                        user={user} 
                        onCommentAdded={handleProjectCommentAdded}
                    />
                </div>
            ))}

            <h2>Student Reports & Progress</h2>
            {updates.length === 0 ? <p>No reports submitted yet.</p> : (
                updates.map(u => (
                    <div key={u._id} className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                        <div className="flex-between">
                            <strong>Update from {u.student?.name}</strong>
                            <span className="comment-date">{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ margin: '10px 0' }}>{u.description}</p>
                        
                        <Discussion 
                            type="updates" 
                            id={u._id} 
                            comments={u.comments} 
                            user={user} 
                            onCommentAdded={handleUpdateCommentAdded}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default MentorView;
