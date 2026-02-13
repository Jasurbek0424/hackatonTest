import { memo, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { User } from '../types/user';
import { computePerformanceScore, formatSalary, getPerformanceLevel } from '../utils/computations';

interface UserModalProps {
  user: User;
  isOpen: boolean;
  isSaving: boolean;
  saveError: string | null;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => Promise<boolean>;
}

const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance',
  'Design', 'Product', 'Operations', 'Legal', 'Customer Support',
] as const;

export const UserModal = memo(function UserModal({
  user, isOpen, isSaving, saveError, onClose, onSave,
}: UserModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName, lastName: user.lastName, email: user.email,
    phone: user.phone, age: user.age, salary: user.salary,
    department: user.department, city: user.city, isActive: user.isActive,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      firstName: user.firstName, lastName: user.lastName, email: user.email,
      phone: user.phone, age: user.age, salary: user.salary,
      department: user.department, city: user.city, isActive: user.isActive,
    });
    setEditMode(false);
    setSaveSuccess(false);
  }, [user]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  const handleFieldChange = useCallback(
    (field: string, value: string | number | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }, [],
  );

  const handleSave = useCallback(async () => {
    const success = await onSave(user.id, formData);
    if (success) {
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  }, [onSave, user.id, formData]);

  const handleCancel = useCallback(() => {
    setFormData({
      firstName: user.firstName, lastName: user.lastName, email: user.email,
      phone: user.phone, age: user.age, salary: user.salary,
      department: user.department, city: user.city, isActive: user.isActive,
    });
    setEditMode(false);
  }, [user]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => { if (e.target === overlayRef.current) onClose(); },
    [onClose],
  );

  const performanceScore = useMemo(() => computePerformanceScore(user), [user]);
  const performance = useMemo(() => getPerformanceLevel(performanceScore), [performanceScore]);
  const formattedSalary = useMemo(() => formatSalary(user.salary), [user.salary]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl
                      mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-purple-600
                            flex items-center justify-center text-white text-lg font-bold shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-slate-400 truncate">{user.id} &middot; {user.department}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Performance Score</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-2xl font-bold ${performance.color}`}>{performanceScore}</span>
                <span className={`text-sm font-medium ${performance.color}`}>{performance.label}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Salary</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">{formattedSalary}</div>
            </div>
          </div>
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${performanceScore}%`,
                backgroundColor: performanceScore >= 80 ? '#34d399' : performanceScore >= 60 ? '#60a5fa' :
                  performanceScore >= 40 ? '#fbbf24' : performanceScore >= 20 ? '#fb923c' : '#f87171',
              }} />
          </div>
        </div>

        {saveError && (
          <div className="mx-6 mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-300">{saveError} — Changes have been rolled back.</span>
          </div>
        )}
        {saveSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-900/30 border border-emerald-800 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-emerald-300">Changes saved successfully!</span>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={formData.firstName} editMode={editMode}
              onChange={(v) => handleFieldChange('firstName', v)} />
            <Field label="Last Name" value={formData.lastName} editMode={editMode}
              onChange={(v) => handleFieldChange('lastName', v)} />
            <Field label="Email" value={formData.email} editMode={editMode} type="email"
              onChange={(v) => handleFieldChange('email', v)} />
            <Field label="Phone" value={formData.phone} editMode={editMode}
              onChange={(v) => handleFieldChange('phone', v)} />
            <Field label="Age" value={String(formData.age)} editMode={editMode} type="number"
              onChange={(v) => handleFieldChange('age', Number(v))} />
            <Field label="Salary" value={String(formData.salary)} editMode={editMode} type="number"
              onChange={(v) => handleFieldChange('salary', Number(v))} />
            {editMode ? (
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Department</label>
                <select value={formData.department} onChange={(e) => handleFieldChange('department', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            ) : (
              <Field label="Department" value={formData.department} editMode={false} onChange={() => {}} />
            )}
            <Field label="City" value={formData.city} editMode={editMode}
              onChange={(v) => handleFieldChange('city', v)} />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-slate-800">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
              <p className="text-sm text-slate-300 mt-0.5">{formData.isActive ? 'Active employee' : 'Inactive employee'}</p>
            </div>
            {editMode ? (
              <button type="button" onClick={() => handleFieldChange('isActive', !formData.isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                           transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:ring-offset-2 focus:ring-offset-slate-900 ${formData.isActive ? 'bg-emerald-600' : 'bg-slate-600'}`}
                role="switch" aria-checked={formData.isActive}>
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                                 transition duration-200 ease-in-out ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                formData.isActive ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
                  : 'bg-red-900/30 text-red-400 border border-red-800/50'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${formData.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
            <span>Join date: {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-800/30">
          {!editMode ? (
            <>
              <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">Close</button>
              <button onClick={() => setEditMode(true)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCancel} disabled={isSaving}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={isSaving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg
                           transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

function Field({ label, value, editMode, type = 'text', onChange }: {
  label: string; value: string; editMode: boolean; type?: string; onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {editMode ? (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
      ) : (
        <p className="text-sm text-slate-200 py-2">{type === 'number' ? Number(value).toLocaleString() : value}</p>
      )}
    </div>
  );
}
