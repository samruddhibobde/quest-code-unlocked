export const mockUsers = [
  { id: '1', email: 'learner@test.com', role: 'learner', level: 12, xp: 2450, coins: 850 },
  { id: '2', email: 'mentor@test.com', role: 'mentor', name: 'John Mentor' },
  { id: '3', email: 'admin@test.com', role: 'admin', name: 'Admin User' },
];

export const mockLanguages = [
  { id: 'c', name: 'C', icon: '⚙️', description: 'Systems programming powerhouse' },
  { id: 'cpp', name: 'C++', icon: '🔧', description: 'Object-oriented performance' },
  { id: 'java', name: 'Java', icon: '☕', description: 'Enterprise-grade applications' },
  { id: 'python', name: 'Python', icon: '🐍', description: 'Versatile and beginner-friendly' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', description: 'Web development essential' },
];

export const mockChallenges = [
  { id: '1', title: 'Two Sum Problem', difficulty: 'Easy', xp: 100, language: 'python', attempts: 45, successRate: 78 },
  { id: '2', title: 'Binary Tree Traversal', difficulty: 'Medium', xp: 200, language: 'cpp', attempts: 32, successRate: 65 },
  { id: '3', title: 'Dynamic Programming: Knapsack', difficulty: 'Hard', xp: 400, language: 'java', attempts: 18, successRate: 42 },
];

export const mockQuests = [
  { id: '1', title: 'Master Python Loops', progress: 75, xp: 150, difficulty: 'Medium', type: 'solo' },
  { id: '2', title: 'Defeat the Array Boss', progress: 30, xp: 300, difficulty: 'Hard', type: 'boss', timeLeft: '2h 15m' },
  { id: '3', title: 'Team Quest: Build REST API', progress: 60, xp: 500, difficulty: 'Hard', type: 'team', members: 4 },
];

export const mockBadges = [
  { id: '1', name: 'First Steps', description: 'Complete your first challenge', earned: true, earnedAt: '2024-01-15' },
  { id: '2', name: 'Week Warrior', description: '7-day coding streak', earned: true, earnedAt: '2024-02-01' },
  { id: '3', name: 'Code Master', description: 'Complete 100 challenges', earned: false },
  { id: '4', name: 'Bug Hunter', description: 'Find and fix 10 bugs', earned: true, earnedAt: '2024-02-10' },
];

export const mockStudents = [
  { id: '1', name: 'Alice Chen', level: 8, language: 'python', lastActive: '2 hours ago', category: 'bright', improvement: 25 },
  { id: '2', name: 'Bob Smith', level: 4, language: 'java', lastActive: '1 day ago', category: 'weak', improvement: -5 },
  { id: '3', name: 'Charlie Davis', level: 15, language: 'cpp', lastActive: '30 min ago', category: 'bright', improvement: 40 },
  { id: '4', name: 'Diana Lopez', level: 3, language: 'javascript', lastActive: '3 days ago', category: 'weak', improvement: 10 },
];

export const mockTutorials = [
  { id: '1', title: 'Introduction to Python', type: 'video', duration: '15 min', status: 'approved', views: 1250 },
  { id: '2', title: 'Advanced Data Structures', type: 'doc', status: 'pending', views: 0 },
  { id: '3', title: 'Recursion Made Easy', type: 'video', duration: '22 min', status: 'approved', views: 890 },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Sarah Johnson', xp: 15420, level: 28, streak: 45 },
  { rank: 2, name: 'Michael Chen', xp: 14890, level: 27, streak: 38 },
  { rank: 3, name: 'Emma Williams', xp: 13750, level: 26, streak: 52 },
  { rank: 342, name: 'You', xp: 2450, level: 12, streak: 7 },
];

export const mockSecurityAlerts = [
  { id: '1', type: 'Unauthorized Access', user: 'anonymous', timestamp: '2024-03-15 14:23', severity: 'high', resolved: false },
  { id: '2', type: 'Leaderboard Bypass', user: 'user_5421', timestamp: '2024-03-14 09:15', severity: 'medium', resolved: true },
  { id: '3', type: 'Fake Payment', user: 'scammer_99', timestamp: '2024-03-13 16:47', severity: 'critical', resolved: false },
];
