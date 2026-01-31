
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  Filter,
  Users
} from 'lucide-react';
import { User, Issue, IssueCategory, IssuePriority, IssueStatus } from '../types';
import { apiService } from '../services/apiService';
import { geminiService } from '../services/geminiService';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CATEGORIES, PRIORITIES, HOSTELS, BLOCKS } from '../constants';

interface DashboardStudentProps {
  user: User;
}

const DashboardStudent: React.FC<DashboardStudentProps> = ({ user }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'MY' | 'PUBLIC'>('MY');
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: IssueCategory.PLUMBING,
    priority: IssuePriority.MEDIUM,
    visibility: 'PRIVATE' as 'PUBLIC' | 'PRIVATE'
  });
  const [prioritySuggestion, setPrioritySuggestion] = useState('');
  const [suggestingPriority, setSuggestingPriority] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const data = await apiService.getIssues();
    setIssues(data);
  };

  const handleSuggestPriority = async () => {
    if (!formData.description.trim()) {
      alert('Please describe the issue first');
      return;
    }
    
    setSuggestingPriority(true);
    try {
      const suggestion = await geminiService.suggestPriority(formData.description);
      if (suggestion && suggestion.priority) {
        setFormData(prev => ({ ...prev, priority: suggestion.priority }));
        setPrioritySuggestion(suggestion.reason);
      } else {
        setPrioritySuggestion('Unable to suggest priority');
      }
    } catch (err) {
      console.error('Error suggesting priority:', err);
      setPrioritySuggestion('Error: Could not suggest priority');
    } finally {
      setSuggestingPriority(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.createIssue({
        ...formData,
        hostel: user.hostel || 'Main',
        block: user.block || 'A',
        room: user.room || '000',
        reportedBy: user.id,
        reportedByName: user.name,
        status: IssueStatus.REPORTED
      });
      setShowModal(false);
      setFormData({ title: '', description: '', category: IssueCategory.PLUMBING, priority: IssuePriority.MEDIUM, visibility: 'PRIVATE' });
      setPrioritySuggestion('');
      fetchIssues();
    } catch (err) {
      alert('Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  const myIssues = issues.filter(i => i.reportedBy === user.id);
  const publicIssues = issues.filter(i => i.visibility === 'PUBLIC');
  const stats = [
    { label: 'Total Reported', value: myIssues.length, icon: MessageSquare, color: 'indigo' },
    { label: 'Pending', value: myIssues.filter(i => i.status !== IssueStatus.CLOSED).length, icon: Clock, color: 'orange' },
    { label: 'Resolved', value: myIssues.filter(i => i.status === IssueStatus.CLOSED).length, icon: CheckCircle2, color: 'green' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">Manage and track your hostel issues.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-dark-blue transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Report New Issue
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border-grey shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-grey mb-6 gap-8">
        <button
          onClick={() => setActiveTab('MY')}
          className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'MY' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-gray-400 hover:text-text-dark-grey'}`}
        >
          My Reported Issues
        </button>
        <button
          onClick={() => setActiveTab('PUBLIC')}
          className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'PUBLIC' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-gray-400 hover:text-text-dark-grey'}`}
        >
          Public Feed
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {(activeTab === 'MY' ? myIssues : publicIssues).length > 0 ? (
          (activeTab === 'MY' ? myIssues : publicIssues)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((issue) => (
              <div
                key={issue.id}
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="group bg-white p-5 rounded-2xl border border-border-grey shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-xs text-gray-400 font-medium">{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-text-dark-grey group-hover:text-primary-blue transition-colors">{issue.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1 mt-1">{issue.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <TrendingUp className="w-3.5 h-3.5" /> {issue.category}
                    </span>
                    {issue.visibility === 'PUBLIC' && (
                      <span className="flex items-center gap-1.5 text-xs text-primary-blue bg-light-blue px-2 py-0.5 rounded-md">
                        <Users className="w-3.5 h-3.5" /> Public
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-300 group-hover:text-primary-blue group-hover:translate-x-1 transition-all">
                  <span className="text-sm font-medium">Details</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No issues reported yet.</p>
            <button onClick={() => setShowModal(true)} className="text-indigo-600 font-bold mt-2">Report your first issue</button>
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border-grey flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-dark-grey">Report a New Issue</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              <div>
                <label className="block text-sm font-semibold text-text-dark-grey mb-1">Title</label>
                <input
                  required
                  placeholder="e.g. Broken window latch"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-dark-grey mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as IssueCategory})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-dark-grey mb-1">Priority</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as IssuePriority})}
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-dark-grey mb-1 flex items-center justify-between">
                  Description
                  <button 
                    type="button" 
                    onClick={handleSuggestPriority}
                    disabled={suggestingPriority}
                    className="text-xs text-primary-blue font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {suggestingPriority ? '⏳ Analyzing...' : '✨ Suggest Priority'}
                  </button>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the problem in detail..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({...formData, description: e.target.value});
                    setPrioritySuggestion('');
                  }}
                />
                {prioritySuggestion && (
                  <p className="text-xs text-primary-blue bg-light-blue p-2 mt-2 rounded-lg font-medium">
                    💡 Smart AI: {prioritySuggestion}
                  </p>
                )}
              </div>

              <div className="p-4 bg-soft-grey rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-dark-grey">Make this issue public?</p>
                  <p className="text-xs text-gray-500">Other students can react and comment on it.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, visibility: formData.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'})}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.visibility === 'PUBLIC' ? 'bg-primary-blue' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.visibility === 'PUBLIC' ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-blue text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-dark-blue transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Submitting...' : 'Report Issue'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStudent;
