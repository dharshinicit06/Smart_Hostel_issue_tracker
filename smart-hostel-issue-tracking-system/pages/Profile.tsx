import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../services/apiService';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HOSTELS, BLOCKS } from '../constants';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!formData.name || !formData.email) {
        setError('Name and Email are required');
        setLoading(false);
        return;
      }

      // For students, validate roll number
      if (user.role === UserRole.STUDENT && !formData.rollNumber) {
        setError('Roll Number is required for students');
        setLoading(false);
        return;
      }

      await apiService.updateUser(user.id, formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-indigo-100 mt-2">{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                {success}
              </div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                    isEditing
                      ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                      : 'bg-gray-50 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                    isEditing
                      ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                      : 'bg-gray-50 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Role-specific fields */}
              {user.role === UserRole.STUDENT && (
                <>
                  {/* Roll Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Hostel */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hostel</label>
                      <select
                        disabled={!isEditing}
                        value={formData.hostel}
                        onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      >
                        {HOSTELS.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Block */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Block</label>
                      <select
                        disabled={!isEditing}
                        value={formData.block}
                        onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      >
                        {BLOCKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Room Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </>
              )}

              {/* Admin fields */}
              {user.role === UserRole.ADMIN && (
                <>
                  {/* Hostel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Hostel</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.hostel || 'All Hostels'}
                      onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </>
              )}

              {/* Caretaker fields */}
              {user.role === UserRole.CARETAKER && (
                <>
                  {/* Hostel */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Hostel</label>
                      <select
                        disabled={!isEditing}
                        value={formData.hostel}
                        onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      >
                        {HOSTELS.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Block */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Block</label>
                      <select
                        disabled={!isEditing}
                        value={formData.block}
                        onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-all ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-indigo-500 bg-white'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                      >
                        {BLOCKS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
