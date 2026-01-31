
import { IssueStatus, IssuePriority, IssueCategory, UserRole } from './types';

export const STATUS_COLORS: Record<IssueStatus, string> = {
  [IssueStatus.REPORTED]: 'bg-gray-100 text-gray-700 border-gray-300',
  [IssueStatus.ASSIGNED]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  [IssueStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-300',
  [IssueStatus.RESOLVED]: 'bg-green-100 text-green-700 border-green-300',
  [IssueStatus.CLOSED]: 'bg-slate-700 text-white border-slate-800',
};

export const PRIORITY_COLORS: Record<IssuePriority, string> = {
  [IssuePriority.LOW]: 'bg-gray-100 text-gray-700',
  [IssuePriority.MEDIUM]: 'bg-blue-100 text-blue-700',
  [IssuePriority.HIGH]: 'bg-yellow-100 text-yellow-700',
  [IssuePriority.EMERGENCY]: 'bg-red-100 text-red-700 animate-pulse border border-red-300',
};

export const CATEGORIES = Object.values(IssueCategory);
export const PRIORITIES = Object.values(IssuePriority);
export const ROLES = Object.values(UserRole);

export const HOSTELS = ['Cauvery', 'Krishna', 'Godavari', 'Narmada', 'Yamuna'];
export const BLOCKS = ['A Block', 'B Block', 'C Block', 'North Wing', 'South Wing'];
