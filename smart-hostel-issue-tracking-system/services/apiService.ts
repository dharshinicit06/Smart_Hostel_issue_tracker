
import { Issue, IssueStatus, User, UserRole, LostFoundItem, Announcement, IssueCategory, IssuePriority } from '../types';

// Mock DB keys
const STORAGE_KEYS = {
  ISSUES: 'hostel_issues',
  USERS: 'hostel_users',
  LOST_FOUND: 'hostel_lost_found',
  ANNOUNCEMENTS: 'hostel_announcements',
  CURRENT_USER: 'hostel_current_user'
};

const INITIAL_ISSUES: Issue[] = [];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const apiService = {
  // --- Auth ---
  login: async (email: string, password: string): Promise<User | null> => {
    // Demo login: any user from the 'users' list or create a dummy
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: async (userData: Partial<User>): Promise<User> => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser = { ...userData, id: 'u_' + Date.now() } as User;
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex((u: User) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
    return users[index];
  },

  // --- Issues ---
  getIssues: async (): Promise<Issue[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
      return INITIAL_ISSUES;
    }
    return JSON.parse(data);
  },

  getIssueById: async (id: string): Promise<Issue | undefined> => {
    const issues = await apiService.getIssues();
    return issues.find(i => i.id === id);
  },

  createIssue: async (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'reactions'>): Promise<Issue> => {
    const issues = await apiService.getIssues();
    const newIssue: Issue = {
      ...issue,
      id: 'iss_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reactions: 0,
      history: [{ status: IssueStatus.REPORTED, updatedAt: new Date().toISOString(), updatedBy: issue.reportedByName }]
    };
    issues.push(newIssue);
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    return newIssue;
  },

  updateIssueStatus: async (issueId: string, status: IssueStatus, updatedBy: string, remarks?: string): Promise<Issue> => {
    const issues = await apiService.getIssues();
    const index = issues.findIndex(i => i.id === issueId);
    if (index === -1) throw new Error('Issue not found');
    
    issues[index].status = status;
    issues[index].updatedAt = new Date().toISOString();
    issues[index].history.push({
      status,
      updatedAt: new Date().toISOString(),
      updatedBy,
      remarks
    });

    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    return issues[index];
  },

  assignIssue: async (issueId: string, caretakerId: string, caretakerName: string, updatedBy: string): Promise<Issue> => {
    const issues = await apiService.getIssues();
    const index = issues.findIndex(i => i.id === issueId);
    if (index === -1) throw new Error('Issue not found');
    
    issues[index].assignedTo = caretakerId;
    issues[index].assignedToName = caretakerName;
    issues[index].status = IssueStatus.ASSIGNED;
    issues[index].updatedAt = new Date().toISOString();
    issues[index].history.push({
      status: IssueStatus.ASSIGNED,
      updatedAt: new Date().toISOString(),
      updatedBy,
      remarks: `Assigned to ${caretakerName}`
    });

    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    return issues[index];
  },

  // --- Caretakers ---
  getCaretakers: async (): Promise<User[]> => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.filter((u: User) => u.role === UserRole.CARETAKER);
  },

  // --- Lost & Found ---
  getLostFound: async (): Promise<LostFoundItem[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.LOST_FOUND);
    return data ? JSON.parse(data) : [];
  },

  createLostFound: async (item: Omit<LostFoundItem, 'id' | 'status'>): Promise<LostFoundItem> => {
    const items = await apiService.getLostFound();
    const newItem: LostFoundItem = { ...item, id: 'lf_' + Date.now(), status: 'PENDING' };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.LOST_FOUND, JSON.stringify(items));
    return newItem;
  },

  claimItem: async (id: string): Promise<void> => {
    const items = await apiService.getLostFound();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index].status = 'CLAIMED';
      localStorage.setItem(STORAGE_KEYS.LOST_FOUND, JSON.stringify(items));
    }
  },

  // --- Announcements ---
  getAnnouncements: async (): Promise<Announcement[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(data);
  },

  createAnnouncement: async (ann: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
    const anns = await apiService.getAnnouncements();
    const newAnn: Announcement = { ...ann, id: 'ann_' + Date.now(), createdAt: new Date().toISOString() };
    anns.push(newAnn);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(anns));
    return newAnn;
  }
};
