export const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'AI Chatbot for Healthcare',
    description: 'An AI-powered application to help diagnose common ailments.',
    department: 'Computer Science',
    year: 'Senior',
    section: 'A',
    mentor: 'amit.gupta@university.edu',
    students: ['rohan@university.edu', 'priya@university.edu'],
    teamLeader: 'rohan@university.edu',
    gitRepo: 'https://github.com/rohan/ai-chatbot',
    status: 'In Progress', // Pending, In Progress, Delayed, Completed
    milestone: 'Implementation',
    feedback: "",
  }
];

export const INITIAL_TASKS = [
  { id: 1, projectId: 1, title: 'Design Database Schema', status: 'Completed', deadline: '2023-10-01', assignee: 'rohan@university.edu', proofUrl: 'https://github.com/rohan/ai-chatbot/commit/3b4d1a' },
  { id: 2, projectId: 1, title: 'Implement JWT Authentication', status: 'Completed', deadline: '2023-10-15', assignee: 'priya@university.edu', proofUrl: 'https://github.com/rohan/ai-chatbot/pull/2' },
  { id: 3, projectId: 1, title: 'Train NLP Model', status: 'In Progress', deadline: '2023-11-20', assignee: 'rohan@university.edu', proofUrl: null },
];

export const INITIAL_SUBMISSIONS = [
  { id: 1, projectId: 1, filename: 'Project_Proposal_v1.pdf', phase: 'Ideation & Planning', date: '2023-09-01', status: 'Pending Review' }
];

export const INITIAL_USERS = [
  { role: 'student', name: 'Rohan Sharma', email: 'rohan@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' },
  { role: 'student', name: 'Priya Patel', email: 'priya@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' },
  { role: 'mentor', name: 'Dr. Amit Gupta', email: 'amit.gupta@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' },
  { role: 'mentor', name: 'Prof. Vikram Singh', email: 'vikram.singh@university.edu', department: 'Electrical Engineering', year: 'Senior', section: 'B' },
  { role: 'coordinator', name: 'Dr. Sunita Rao', email: 'sunita.rao@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' }
];
