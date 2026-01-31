
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowUpRight,
  TrendingDown,
  PieChart as PieChartIcon,
  Zap,
  ChevronDown,
  Download,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Issue, User, UserRole, IssueStatus, IssueCategory } from '../types';
import { apiService } from '../services/apiService';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { CATEGORIES, PRIORITIES } from '../constants';

interface DashboardAdminProps {
  user: User;
}

const DashboardAdmin: React.FC<DashboardAdminProps> = ({ user }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState({ category: '', status: '', hostel: '' });
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await apiService.getIssues();
    setIssues(data);
    setLoading(false);
  };

  const categoryStats = CATEGORIES.map(cat => ({
    name: cat,
    count: issues.filter(i => i.category === cat).length
  })).sort((a, b) => b.count - a.count);

  const statusStats = [
    { name: 'Resolved', value: issues.filter(i => i.status === IssueStatus.CLOSED || i.status === IssueStatus.RESOLVED).length, color: '#10B981' },
    { name: 'Pending', value: issues.filter(i => i.status !== IssueStatus.CLOSED && i.status !== IssueStatus.RESOLVED).length, color: '#F59E0B' },
  ];

  const filteredIssues = issues.filter(i => {
    return (!filter.category || i.category === filter.category) &&
           (!filter.status || i.status === filter.status) &&
           (!filter.hostel || i.hostel === filter.hostel);
  });

  const handleExportReport = () => {
    // Prepare CSV data
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Hostel', 'Room', 'Reporter', 'Assigned To', 'Created Date'];
    const rows = filteredIssues.map(issue => [
      issue.id,
      issue.title,
      issue.category,
      issue.priority,
      issue.status,
      issue.hostel,
      issue.room,
      issue.reportedByName,
      issue.assignedToName || 'Unassigned',
      new Date(issue.createdAt).toLocaleDateString()
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-issues-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500 mt-1">Real-time infrastructure analytics and workflow management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <Zap className="w-4 h-4 text-yellow-500" /> Smart Summary
          </button>
          <button 
            onClick={handleExportReport}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Issues', value: issues.length, icon: Settings, trend: '+12%', color: 'blue' },
          { label: 'Avg Resolution', value: '4.2h', icon: Zap, trend: '-18%', color: 'yellow' },
          { label: 'Active Caretakers', value: '8', icon: Users, trend: '0%', color: 'indigo' },
          { label: 'Resolved Rate', value: '88%', icon: BarChart3, trend: '+5%', color: 'green' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${card.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Issue Density by Category
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-indigo-500" /> Resolution Ratio
          </h3>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-gray-900">{Math.round((statusStats[0].value / issues.length) * 100 || 0)}%</p>
              <p className="text-xs text-gray-400 font-medium uppercase">Efficiency</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {statusStats.map(s => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} /> {s.name}
                </span>
                <span className="font-bold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-gray-900">Recent Infrastructure Issues</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search issues..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
              />
            </div>
            <button className="p-2 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredIssues.slice(0, 5).map((issue) => (
                <tr 
                  key={issue.id} 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/issues/${issue.id}`)}
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 truncate max-w-[200px]">{issue.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{issue.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700">{issue.reportedByName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700">{issue.hostel} • {issue.room}</p>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 font-medium italic">{issue.assignedToName || 'Unassigned'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Showing {filteredIssues.slice(0, 5).length} of {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
          </span>
          {filteredIssues.length === 0 && (
            <span className="text-sm text-gray-400 italic">No issues reported yet</span>
          )}
        </div>
      </div>

      {/* Smart Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6" /> Smart Summary Report
              </h2>
              <button
                onClick={() => setShowSummary(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium">Total Issues</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{issues.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-green-600 font-medium">Resolved</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {issues.filter(i => i.status === IssueStatus.CLOSED || i.status === IssueStatus.RESOLVED).length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <p className="text-sm text-yellow-600 font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-1">
                    {issues.filter(i => i.status === IssueStatus.IN_PROGRESS || i.status === IssueStatus.ASSIGNED).length}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">Pending</p>
                  <p className="text-3xl font-bold text-red-900 mt-1">
                    {issues.filter(i => i.status === IssueStatus.REPORTED).length}
                  </p>
                </div>
              </div>

              {/* Resolution Rate */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                <p className="text-sm text-indigo-600 font-medium mb-2">Resolution Rate</p>
                <p className="text-4xl font-bold text-indigo-900">
                  {Math.round(
                    (issues.filter(i => i.status === IssueStatus.CLOSED || i.status === IssueStatus.RESOLVED).length / 
                    (issues.length || 1)) * 100
                  )}%
                </p>
              </div>

              {/* Top Categories */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Top Issue Categories</h3>
                <div className="space-y-2">
                  {categoryStats.slice(0, 5).map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm font-bold text-indigo-600">{cat.count} issues</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Status Distribution</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Reported', count: issues.filter(i => i.status === IssueStatus.REPORTED).length, color: 'red' },
                    { label: 'Assigned', count: issues.filter(i => i.status === IssueStatus.ASSIGNED).length, color: 'yellow' },
                    { label: 'In Progress', count: issues.filter(i => i.status === IssueStatus.IN_PROGRESS).length, color: 'blue' },
                    { label: 'Resolved', count: issues.filter(i => i.status === IssueStatus.RESOLVED).length, color: 'green' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                      <span className="text-sm text-gray-600 font-medium flex-1">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowSummary(false);
                    handleExportReport();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" /> Export This Report
                </button>
                <button
                  onClick={() => setShowSummary(false)}
                  className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
