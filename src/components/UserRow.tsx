import { memo, useMemo, useCallback } from 'react';
import type { User } from '../types/user';
import { computePerformanceScore, formatSalary, getPerformanceLevel } from '../utils/computations';

interface UserRowProps {
  user: User;
  index: number;
  size: number;
  start: number;
  onSelect: (user: User) => void;
}

export const UserRow = memo(function UserRow({ user, size, start, onSelect }: UserRowProps) {
  const performanceScore = useMemo(() => computePerformanceScore(user), [user]);
  const performance = useMemo(() => getPerformanceLevel(performanceScore), [performanceScore]);
  const salary = useMemo(() => formatSalary(user.salary), [user.salary]);

  const handleClick = useCallback(() => onSelect(user), [user, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(user);
      }
    },
    [user, onSelect],
  );

  const rowStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${size}px`,
      transform: `translateY(${start}px)`,
    }),
    [size, start],
  );

  return (
    <div
      style={rowStyle}
      onClick={handleClick}
      className="flex items-center px-4 border-b border-slate-800 hover:bg-slate-800/60
                 cursor-pointer transition-colors duration-150 group"
      role="row"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-3 w-55 min-w-55">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600
                        flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div className="truncate">
          <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-slate-500 truncate">{user.id}</div>
        </div>
      </div>

      <div className="w-62.5 min-w-62.5 text-sm text-slate-400 truncate px-2">
        {user.email}
      </div>

      <div className="w-37.5 min-w-37.5 px-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                         bg-slate-700/50 text-slate-300 border border-slate-700">
          {user.department}
        </span>
      </div>

      <div className="w-17.5 min-w-17.5 text-sm text-slate-400 text-center">
        {user.age}
      </div>

      <div className="w-30 min-w-30 text-sm text-slate-300 font-mono px-2">
        {salary}
      </div>

      <div className="w-32.5 min-w-32.5 flex items-center gap-2 px-2">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${performanceScore}%`,
              backgroundColor:
                performanceScore >= 80 ? '#34d399' :
                performanceScore >= 60 ? '#60a5fa' :
                performanceScore >= 40 ? '#fbbf24' :
                performanceScore >= 20 ? '#fb923c' : '#f87171',
            }}
          />
        </div>
        <span className={`text-xs font-medium ${performance.color} w-11.25 text-right`}>
          {performanceScore}
        </span>
      </div>

      <div className="w-22.5 min-w-22.5 flex justify-center">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            user.isActive
              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
              : 'bg-red-900/30 text-red-400 border border-red-800/50'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="flex-1 text-sm text-slate-400 truncate px-2">
        {user.city}
      </div>
    </div>
  );
});
