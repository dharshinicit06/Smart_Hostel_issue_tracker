
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareWarning, ArrowRight, ShieldCheck, School, HardHat, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/apiService';
import { User, UserRole } from '../types';
import { HOSTELS, BLOCKS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'choice' | 'signin' | 'signup'>('choice');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sign In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    hostel: HOSTELS[0],
    block: BLOCKS[0],
    room: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await apiService.login(signInEmail, signInPassword);
      if (user) {
        onLogin(user);
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!signUpData.name || !signUpData.email || !signUpData.password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (signUpData.password !== signUpData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (signUpData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (selectedRole === UserRole.STUDENT && !signUpData.rollNumber) {
        setError('Roll number is required for students');
        setLoading(false);
        return;
      }

      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('hostel_users') || '[]');
      if (users.find((u: any) => u.email === signUpData.email)) {
        setError('Email already registered. Please sign in instead.');
        setLoading(false);
        return;
      }

      const userData = {
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        role: selectedRole,
        rollNumber: selectedRole === UserRole.STUDENT ? signUpData.rollNumber : undefined,
        hostel: selectedRole === UserRole.STUDENT ? signUpData.hostel : undefined,
        block: selectedRole === UserRole.STUDENT ? signUpData.block : undefined,
        room: selectedRole === UserRole.STUDENT ? signUpData.room : undefined
      };

      const user = await apiService.register(userData);
      onLogin(user);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Hero Section */}
      <div className="hidden md:flex flex-col justify-center items-start w-1/2 bg-dark-blue p-24 text-white">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md mb-8">
          <MessageSquareWarning className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">Simplify Hostel Infrastructure Management.</h1>
        <p className="text-white/70 text-xl mb-12 max-w-lg">
          A centralized platform for students to report issues and authorities to track resolutions in real-time.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-full"><ShieldCheck className="w-5 h-5" /></div>
            <span className="text-white/80">Transparent Tracking</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-full"><ShieldCheck className="w-5 h-5" /></div>
            <span className="text-white/80">Role-based Access</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-full"><ShieldCheck className="w-5 h-5" /></div>
            <span className="text-white/80">Smart Categorization</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-12">
            <div className="bg-dark-blue p-2 rounded-lg">
              <MessageSquareWarning className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-text-dark-grey tracking-tight">SmartHostel</span>
          </div>

          {/* Choice Screen */}
          {mode === 'choice' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
              <p className="text-gray-500 mb-8">Choose to sign in or create a new account</p>

              <div className="space-y-3">
                <button
                  onClick={() => setMode('signin')}
                  className="w-full bg-primary-blue text-white py-3.5 rounded-xl font-semibold shadow-lg hover:bg-dark-blue transition-all flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className="w-full bg-light-blue text-primary-blue py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Sign In Screen */}
          {mode === 'signin' && (
            <div>
              <button
                onClick={() => setMode('choice')}
                className="flex items-center gap-2 text-primary-blue font-medium mb-6 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="text-3xl font-bold text-text-dark-grey mb-2">Welcome Back</h2>
              <p className="text-gray-500 mb-8">Sign in to your account</p>

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-dark-grey mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                    placeholder="name@university.edu"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark-grey mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-blue text-white py-3.5 rounded-xl font-semibold shadow-lg hover:bg-dark-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Sign Up Role Selection */}
          {mode === 'signup' && !selectedRole && (
            <div>
              <button
                onClick={() => setMode('choice')}
                className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500 mb-8">Choose your role to get started</p>

              <div className="space-y-3">
                {[
                  { role: UserRole.STUDENT, label: 'Student', desc: 'Report issues & view complaints', icon: School },
                  { role: UserRole.ADMIN, label: 'Hostel Admin', desc: 'Manage & oversee operations', icon: ShieldCheck },
                  { role: UserRole.CARETAKER, label: 'Caretaker', desc: 'Handle maintenance tasks', icon: HardHat },
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => setSelectedRole(item.role)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border-grey hover:border-primary-blue hover:bg-light-blue transition-all text-left group"
                  >
                    <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-light-blue group-hover:text-primary-blue transition-colors">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark-grey">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && selectedRole && (
            <div>
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-primary-blue font-medium mb-6 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to roles
              </button>

              <h2 className="text-3xl font-bold text-text-dark-grey mb-2">Complete Your Profile</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Sign up as <span className="font-semibold text-primary-blue">{selectedRole.toLowerCase()}</span>
              </p>

              <form onSubmit={handleSignUp} className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-text-dark-grey mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                    placeholder="John Doe"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark-grey mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                    placeholder="john@university.edu"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark-grey mb-1">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark-grey mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  />
                </div>

                {selectedRole === UserRole.STUDENT && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-text-dark-grey mb-1">Roll Number</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                        placeholder="e.g. 21CSE001"
                        value={signUpData.rollNumber}
                        onChange={(e) => setSignUpData({ ...signUpData, rollNumber: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
                        <select
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={signUpData.hostel}
                          onChange={(e) => setSignUpData({ ...signUpData, hostel: e.target.value })}
                        >
                          {HOSTELS.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                        <select
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={signUpData.block}
                          onChange={(e) => setSignUpData({ ...signUpData, block: e.target.value })}
                        >
                          {BLOCKS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark-grey mb-1">Room Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-xl border border-border-grey focus:ring-2 focus:ring-primary-blue outline-none"
                        placeholder="e.g. 302"
                        value={signUpData.room}
                        onChange={(e) => setSignUpData({ ...signUpData, room: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-blue text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-dark-blue transition-all disabled:opacity-50 mt-6"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
