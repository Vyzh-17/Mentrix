import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Discussion from './Discussion';

const CoordinatorView = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mentorId, setMentorId] = useState('');
    const [studentId, setStudentId] = useState('');

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const projRes = await axios.get('http://localhost:5000/api/projects', config);
            const userRes = await axios.get('http://localhost:5000/api/auth/users', config);
            setProjects(projRes.data);
            setUsers(userRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/projects', {
                title,
                description,
                mentor: mentorId,
                students: studentId ? [studentId] : []
            }, config);
            setTitle('');
            setDescription('');
            fetchData();
            alert('Project Proposed Successfully');
        } catch (error) {
            alert('Error creating project: ' + error.response?.data?.message);
        }
    };

    const handleCommentAdded = (updatedProject) => {
        setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
    };

    const mentors = users.filter(u => u.role === 'mentor');
    const students = users.filter(u => u.role === 'student');

    return (
        <div className="view-container">
            <div className="card">
                <h2>Propose New Project</h2>
                <form onSubmit={handleCreateProject}>
                    <input 
                        className="input-field" 
                        placeholder="Project Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                    <textarea 
                        className="input-field" 
                        placeholder="Detailed Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        style={{ minHeight: '80px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <select className="input-field" value={mentorId} onChange={(e) => setMentorId(e.target.value)} required>
                            <option value="">Select Mentor</option>
                            {mentors.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                        </select>
                        <select className="input-field" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                            <option value="">Select Student</option>
                            {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn">Propose Project</button>
                </form>
            </div>

            <h2>Platform Oversight</h2>
            <div className="projects-grid">
                {projects.map(p => (
                    <div key={p._id} className="card">
                        <div className="flex-between">
                            <h3>{p.title}</h3>
                            <span className={`badge badge-${p.status}`}>{p.status}</span>
                        </div>
                        <p>{p.description}</p>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '10px' }}>
                            Mentor: <strong>{p.mentor?.name}</strong> | 
                            Students: <strong>{p.students?.map(s => s.name).join(', ') || 'Unassigned'}</strong>
                        </div>
                        
                        <Discussion 
                            type="projects" 
                            id={p._id} 
                            comments={p.comments} 
                            user={user} 
                            onCommentAdded={handleCommentAdded}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoordinatorView;
