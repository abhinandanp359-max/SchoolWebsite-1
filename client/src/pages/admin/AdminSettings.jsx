import { useState } from 'react';
import { Settings, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';

export default function AdminSettings() {
  const { user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');
  
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!currentPassword) {
      return setStatus({ type: 'error', message: 'Current password is required.' });
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/update-credentials', {
        currentPassword,
        newUsername: newUsername !== user?.username ? newUsername : undefined,
        newPassword: newPassword || undefined
      });
      setStatus({ type: 'success', message: res.message || 'Credentials updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to update credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Settings size={18} />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Admin Settings</h1>
          <p className="text-sm text-warm-gray">Manage your account credentials and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-6 flex items-center gap-2">
            <ShieldAlert size={14} /> Security & Credentials
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-warm-gray mb-1.5">New Username (Optional)</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal focus:outline-none focus:border-primary"
                placeholder="Leave blank to keep current username"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-warm-gray mb-1.5">New Password (Optional)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal focus:outline-none focus:border-primary"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-primary mb-1.5">Current Password (Required)</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal focus:outline-none focus:border-primary bg-primary/5"
                placeholder="Enter current password to verify changes"
              />
            </div>

            {status && (
              <div
                className={`flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm ${
                  status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <ShieldAlert size={16} className="shrink-0 mt-0.5" />}
                <span className="min-w-0">{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !currentPassword}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary-dark transition shadow-md disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              <Save size={15} /> {loading ? 'Saving...' : 'Update Credentials'}
            </button>
          </form>
        </section>

        <section className="bg-[#fbf8f1] rounded-2xl shadow-sm border border-[#eadfc8] p-6 self-start">
           <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Security Notice</h3>
           <p className="text-sm text-charcoal leading-relaxed mb-4">
             Changing your username or password will immediately update your credentials for future logins.
           </p>
           <ul className="text-sm text-warm-gray space-y-2 list-disc pl-4">
             <li>You must provide your <b>current password</b> to make any changes.</li>
             <li>Make sure your new password is secure and at least 6 characters long.</li>
             <li>If you change your username, you will need to use it next time you sign in.</li>
           </ul>
        </section>
      </div>
    </div>
  );
}
