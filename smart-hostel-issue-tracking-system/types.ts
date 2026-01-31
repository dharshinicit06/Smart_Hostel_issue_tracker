
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  CARETAKER = 'CARETAKER'
}

export enum IssueStatus {
  REPORTED = 'REPORTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY'
}

export enum IssueCategory {
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  CLEANLINESS = 'CLEANLINESS',
  INTERNET = 'INTERNET',
  FURNITURE = 'FURNITURE',
  OTHER = 'OTHER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  hostel?: string;
  block?: string;
  room?: string;
  rollNumber?: string; // For students only
}

export interface IssueHistory {
  status: IssueStatus;
  updatedAt: string;
  updatedBy: string;
  remarks?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  visibility: 'PUBLIC' | 'PRIVATE';
  hostel: string;
  block: string;
  room: string;
  reportedBy: string; // User ID
  reportedByName: string;
  assignedTo?: string; // Caretaker ID
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  history: IssueHistory[];
  image?: string;
  reactions: number;
}

export interface LostFoundItem {
  id: string;
  type: 'LOST' | 'FOUND';
  name: string;
  description: string;
  location: string;
  date: string;
  reportedBy: string;
  reportedByName: string;
  image?: string;
  status: 'PENDING' | 'CLAIMED';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  hostel: string;
  block?: string;
  targetRole?: UserRole;
  createdAt: string;
  createdBy: string;
}
