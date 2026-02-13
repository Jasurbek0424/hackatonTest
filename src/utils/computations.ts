import type { User } from '../types/user';

export function computePerformanceScore(user: User): number {
  const ageFactor = Math.sin(user.age * 0.1) * 20 + 50;
  const salaryFactor = Math.log(user.salary) * 5;
  const tenureYears = new Date().getFullYear() - new Date(user.joinDate).getFullYear();
  const tenureFactor = Math.sqrt(tenureYears + 1) * 10;

  let hash = 0;
  for (let i = 0; i < user.id.length; i++) {
    const char = user.id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const idFactor = (Math.abs(hash) % 30);

  const activeFactor = user.isActive ? 15 : -10;

  let deptMultiplier = 1;
  for (let i = 0; i < user.department.length; i++) {
    deptMultiplier += user.department.charCodeAt(i) * 0.001;
  }

  const raw = (ageFactor + salaryFactor + tenureFactor + idFactor + activeFactor) * deptMultiplier;
  return Math.round(Math.max(0, Math.min(100, raw % 100)));
}

export function formatSalary(salary: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(salary);
}

export function getPerformanceLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400' };
  if (score >= 60) return { label: 'Good', color: 'text-blue-400' };
  if (score >= 40) return { label: 'Average', color: 'text-yellow-400' };
  if (score >= 20) return { label: 'Below Avg', color: 'text-orange-400' };
  return { label: 'Poor', color: 'text-red-400' };
}
