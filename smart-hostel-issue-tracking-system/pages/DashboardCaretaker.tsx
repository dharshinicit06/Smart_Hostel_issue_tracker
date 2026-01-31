
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Hammer, 
  ChevronRight,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Issue, User, IssueStatus } from '../types';
import { apiService } from '../services/apiService';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

interface DashboardCaretakerProps {
  user: User;
}

const DashboardCaretaker: React.FC<DashboardCaretakerProps> = ({ user }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const data = await apiService.getIssues();
    // In a real app, filtering would happen on server
    const myTasks = data.filter(i => i.assignedTo === user.id);
    setIssues(myTasks);
  };

  const pendingCount = issues.filter(i => i.status !== IssueStatus.CLOSED && i.status !== IssueStatus.RESOLVED).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-500">You have {pendingCount} tasks awaiting resolution.</p>
        </div>
        <div className="p-4 bg-indigo-600 rounded-2xl text-white flex flex-col items-center">
          <span className="text-2xl font-black">{issues.length}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">Assigned</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-orange-900">Ongoing Work</h3>
          </div>
          <p className="text-3xl font-black text-orange-600">
            {issues.filter(i => i.status === IssueStatus.IN_PROGRESS).length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-xl text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-green-900">Completed (Today)</h3>
          </div>
          <p className="text-3xl font-black text-green-600">
            {issues.filter(i => i.status === IssueStatus.RESOLVED).length}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-indigo-500" /> Current Work Orders
        </h2>

        <div className="space-y-4">
          {issues.length > 0 ? issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => navigate(`/issues/${issue.id}`)}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {issue.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      {issue.hostel} • {issue.room}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Client</p>
                    <p className="text-sm font-bold text-gray-900">{issue.reportedByName}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No tasks assigned to you yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCaretaker;
