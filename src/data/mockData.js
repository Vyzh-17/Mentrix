export const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'AI Chatbot for Healthcare',
    description: 'An AI-powered application to help diagnose common ailments.',
    department: 'Computer Science',
    year: 'Senior',
    section: 'A',
    mentor: 'jane.smith@university.edu',
    students: ['alice@university.edu', 'bob@university.edu'],
    teamLeader: 'alice@university.edu',
    gitRepo: 'https://github.com/alice/ai-chatbot',
    status: 'In Progress', // Pending, In Progress, Delayed, Completed
    milestone: 'Implementation',
    feedback: "",
  }
];

export const INITIAL_TASKS = [
  { id: 1, projectId: 1, title: 'Design Database Schema', status: 'Completed', deadline: '2023-10-01', assignee: 'alice@university.edu', proofUrl: 'https://github.com/alice/ai-chatbot/commit/3b4d1a' },
  { id: 2, projectId: 1, title: 'Implement JWT Authentication', status: 'Completed', deadline: '2023-10-15', assignee: 'bob@university.edu', proofUrl: 'https://github.com/alice/ai-chatbot/pull/2' },
  { id: 3, projectId: 1, title: 'Train NLP Model', status: 'In Progress', deadline: '2023-11-20', assignee: 'alice@university.edu', proofUrl: null },
];

export const INITIAL_SUBMISSIONS = [
  { id: 1, projectId: 1, filename: 'Project_Proposal_v1.pdf', phase: 'Ideation & Planning', date: '2023-09-01', status: 'Approved' }
];

export const INITIAL_USERS = [
  { role: 'student', name: 'Alice Johnson', email: 'alice@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' },
  { role: 'student', name: 'Bob Williams', email: 'bob@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' },
  { role: 'mentor', name: 'Dr. Jane Smith', email: 'jane.smith@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' },
  { role: 'mentor', name: 'Prof. Mark Lee', email: 'mark.lee@university.edu', department: 'Electrical Engineering', year: 'Senior', section: 'B' },
  { role: 'coordinator', name: 'Dr. Alan Turing', email: 'alan.turing@university.edu', department: 'Computer Science', year: 'Senior', section: 'A' }
];
