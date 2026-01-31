
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  User, 
  MessageSquare, 
  History, 
  Send,
  CheckCircle,
  Hammer,
  AlertCircle,
  Link2
} from 'lucide-react';
import { Issue, User as UserType, UserRole, IssueStatus } from '../types';
import { apiService } from '../services/apiService';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

interface IssueDetailProps {
  user: UserType;
}

const IssueDetail: React.FC<IssueDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [caretakers, setCaretakers] = useState<UserType[]>([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (id) {
      const data = await apiService.getIssueById(id);
      if (data) setIssue(data);
      if (user.role === UserRole.ADMIN) {
        const cts = await apiService.getCaretakers();
        setCaretakers(cts);
      }
    }
  };

  const handleUpdateStatus = async (status: IssueStatus) => {
    if (!issue) return;
    setLoading(true);
    try {
      await apiService.updateIssueStatus(issue.id, status, user.name, remarks);
      setRemarks('');
      fetchData();
    } catch (err) {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (caretakerId: string) => {
    if (!issue) return;
    const ct = caretakers.find(c => c.id === caretakerId);
    if (!ct) return;
    
    setLoading(true);
    try {
      await apiService.assignIssue(issue.id, ct.id, ct.name, user.name);
      fetchData();
    } catch (err) {
      alert('Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!issue) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 font-semibold mb-8 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <StatusBadge status={issue.status} />
              <PriorityBadge priority={issue.priority} />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{issue.title}</h1>
            <p className="text-gray-600 leading-relaxed mb-8">{issue.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><MapPin className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                  <p className="text-sm font-bold text-gray-900">{issue.hostel}, {issue.room}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2 rounded-xl text-green-600"><User className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Reporter</p>
                  <p className="text-sm font-bold text-gray-900">{issue.reportedByName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-xl text-orange-600"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Reported</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Actions */}
          {(user.role !== UserRole.STUDENT || issue.reportedBy === user.id) && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Hammer className="w-5 h-5 text-indigo-500" /> Actions & Resolution
              </h3>
              
              <div className="space-y-6">
                {user.role === UserRole.ADMIN && issue.status === IssueStatus.REPORTED && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Assign to Caretaker</label>
                    <div className="flex flex-wrap gap-2">
                      {caretakers.map(ct => (
                        <button
                          key={ct.id}
                          onClick={() => handleAssign(ct.id)}
                          className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold hover:border-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          {ct.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {((user.role === UserRole.CARETAKER && issue.assignedTo === user.id) || user.role === UserRole.ADMIN) && (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Add remarks or resolution notes..."
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                    <div className="flex gap-3">
                      {issue.status === IssueStatus.ASSIGNED && (
                        <button
                          onClick={() => handleUpdateStatus(IssueStatus.IN_PROGRESS)}
                          className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-600 transition-all flex items-center gap-2"
                        >
                          <Clock className="w-5 h-5" /> Mark In Progress
                        </button>
                      )}
                      {(issue.status === IssueStatus.IN_PROGRESS || issue.status === IssueStatus.ASSIGNED) && (
                        <button
                          onClick={() => handleUpdateStatus(IssueStatus.RESOLVED)}
                          className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" /> Mark Resolved
                        </button>
                      )}
                      {issue.status === IssueStatus.RESOLVED && user.role === UserRole.ADMIN && (
                        <button
                          onClick={() => handleUpdateStatus(IssueStatus.CLOSED)}
                          className="bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all"
                        >
                          Close Ticket
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {issue.status === IssueStatus.CLOSED && (
                  <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4 text-gray-500">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-bold text-gray-900">This ticket is closed.</p>
                      <p className="text-sm">Maintenance workflow has been completed for this issue.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timeline Sidebar */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" /> Lifecycle History
          </h3>
          
          <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {issue.history.slice().reverse().map((entry, idx) => (
              <div key={idx} className="relative pl-10">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                  idx === 0 ? 'bg-indigo-600 ring-4 ring-indigo-50' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(entry.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="font-bold text-gray-900 mt-1">{entry.status.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500 mt-0.5">By {entry.updatedBy}</p>
                  {entry.remarks && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 italic text-sm text-gray-600">
                      "{entry.remarks}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
