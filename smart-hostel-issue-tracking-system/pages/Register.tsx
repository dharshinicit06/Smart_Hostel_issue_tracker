
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { apiService } from '../services/apiService';
import { HOSTELS, BLOCKS, ROLES } from '../constants';
import { ArrowLeft, UserCircle, School, HardHat, ShieldCheck } from 'lucide-react';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    password: '',
    role: UserRole.STUDENT,
    hostel: HOSTELS[0],
    block: BLOCKS[0],
    room: '',
    rollNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await apiService.register(formData);
      onLogin(user);
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Progress Sidebar */}
        <div className="w-full md:w-1/3 bg-indigo-600 p-8 text-white">
          <div className="mb-12">
            <h2 className="text-2xl font-bold">Registration</h2>
            <p className="text-indigo-100 mt-2">Join our smart campus community.</p>
          </div>

          <div className="space-y-8 relative">
            <div className={`flex items-center gap-4 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className="bg-white text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <span>Select Role</span>
            </div>
            <div className={`flex items-center gap-4 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className="bg-white text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <span>Profile Details</span>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8 md:p-12">
          {step === 1 ? (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Identify Yourself</h3>
              <p className="text-gray-500 mb-8">Choose the role that describes your position in the hostel.</p>
              
              <div className="grid gap-4">
                {[
                  { role: UserRole.STUDENT, label: 'Student', desc: 'Report issues & view public complaints', icon: School },
                  { role: UserRole.ADMIN, label: 'Hostel Admin', desc: 'Oversee management & assign tasks', icon: ShieldCheck },
                  { role: UserRole.CARETAKER, label: 'Caretaker', desc: 'Maintenance & on-ground resolution', icon: HardHat },
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleRoleSelect(item.role)}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group"
                  >
                    <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="mt-8 text-center text-gray-500 text-sm">
                Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-indigo-600 font-medium mb-4 hover:gap-1 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to roles
              </button>

              <h3 className="text-2xl font-bold text-gray-900">Complete Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                {formData.role === UserRole.STUDENT && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. 21CSE001"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.hostel}
                        onChange={(e) => setFormData({...formData, hostel: e.target.value})}
                      >
                        {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {formData.role === UserRole.STUDENT && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.block}
                        onChange={(e) => setFormData({...formData, block: e.target.value})}
                      >
                        {BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room No</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. 302"
                        value={formData.room}
                        onChange={(e) => setFormData({...formData, room: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Finish Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
