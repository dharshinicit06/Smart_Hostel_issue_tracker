
import React, { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, Megaphone, Trash2 } from 'lucide-react';
import { Announcement, User, UserRole } from '../types';
import { apiService } from '../services/apiService';
import { HOSTELS } from '../constants';

interface AnnouncementsProps {
  user: User;
}

const AnnouncementsPage: React.FC<AnnouncementsProps> = ({ user }) => {
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', hostel: 'All' });

  useEffect(() => {
    fetchAnns();
  }, []);

  const fetchAnns = async () => {
    const data = await apiService.getAnnouncements();
    setAnns(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.createAnnouncement({
      ...formData,
      createdBy: user.name
    });
    setShowModal(false);
    setFormData({ title: '', content: '', hostel: 'All' });
    fetchAnns();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-500">Official updates from hostel management.</p>
        </div>
        {user.role === UserRole.ADMIN && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post Announcement
          </button>
        )}
      </header>

      <div className="space-y-6">
        {anns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((ann) => (
          <div key={ann.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500" />
            <div className="flex items-start gap-6">
              <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{ann.hostel} HOSTEL</span>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(ann.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{ann.title}</h3>
                <p className="text-gray-600 leading-relaxed">{ann.content}</p>
                <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-50">
                  <p className="text-xs text-gray-400 font-bold uppercase">Issued by {ann.createdBy}</p>
                  {user.role === UserRole.ADMIN && (
                    <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Post New Announcement</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Target Hostel</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.hostel}
                  onChange={(e) => setFormData({...formData, hostel: e.target.value})}
                >
                  <option value="All">All Hostels</option>
                  {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input
                  required
                  placeholder="e.g. Water Tank Cleaning"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Details of the announcement..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all mt-4"
              >
                Publish Announcement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
