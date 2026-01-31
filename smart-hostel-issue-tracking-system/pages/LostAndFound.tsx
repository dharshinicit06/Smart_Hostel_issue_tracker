
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  MapPin, 
  Calendar, 
  User as UserIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LostFoundItem, User, UserRole } from '../types';
import { apiService } from '../services/apiService';

interface LostFoundProps {
  user: User;
}

const LostAndFound: React.FC<LostFoundProps> = ({ user }) => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'LOST' as 'LOST' | 'FOUND',
    name: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await apiService.getLostFound();
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.createLostFound({
        ...formData,
        reportedBy: user.id,
        reportedByName: user.name
      });
      setShowModal(false);
      setFormData({ type: 'LOST', name: '', description: '', location: '', date: new Date().toISOString().split('T')[0] });
      fetchItems();
    } catch (err) {
      alert('Failed to submit item');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id: string) => {
    if (confirm('Mark this item as claimed?')) {
      await apiService.claimItem(id);
      fetchItems();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost & Found Hub</h1>
          <p className="text-gray-500">Connecting lost items with their owners.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Report Item
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className={`p-4 font-bold text-center text-xs uppercase tracking-widest ${item.type === 'LOST' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {item.type} ITEM
            </div>
            <div className="p-6 flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-300" /> {item.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-300" /> {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <UserIcon className="w-4 h-4 text-gray-300" /> Reported by {item.reportedByName}
                </div>
              </div>

              {item.status === 'CLAIMED' ? (
                <div className="pt-4 border-t border-gray-50 flex items-center justify-center gap-2 text-green-600 font-bold">
                  <CheckCircle className="w-5 h-5" /> Item Claimed
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-50">
                  {user.role === UserRole.ADMIN ? (
                    <button 
                      onClick={() => handleClaim(item.id)}
                      className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-all"
                    >
                      Mark as Claimed
                    </button>
                  ) : (
                    <p className="text-xs text-center text-gray-400 font-medium">Contact admin to claim this item</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No lost or found items reported yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Report Lost/Found Item</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'LOST'})}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'LOST' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}
                >
                  Lost
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'FOUND'})}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'FOUND' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
                >
                  Found
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                <input
                  required
                  placeholder="e.g. Silver Keychain"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                  <input
                    required
                    placeholder="e.g. Mess Hall"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Submitting...' : 'Post Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFound;
