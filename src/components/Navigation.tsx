import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import type { UserRole } from '../types/academic.ts';

export type TabKey =
  | 'dashboard'
  | 'lifecycle'
  | 'bk'
  | 'nilai'
  | 'pkl'
  | 'kelulusan'
  | 'tracer';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  currentRole?: UserRole;
  studentsCount?: number;
  activeBKCount?: number;
  activePKLCount?: number;
  badgeCounts?: {
    ppdbCount?: number;
    bkAlertCount?: number;
    activePklCount?: number;
    readyGraduateCount?: number;
    tracerCount?: number;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  studentsCount = 0,
  activeBKCount = 0,
  activePKLCount = 0,
  badgeCounts,
}) => {
  const ppdbBadge = badgeCounts?.ppdbCount ? `${badgeCounts.ppdbCount} PPDB` : studentsCount > 0 ? `${studentsCount} Siswa` : null;
  const bkBadge = activeBKCount > 0 ? `${activeBKCount} Kasus` : badgeCounts?.bkAlertCount ? `${badgeCounts.bkAlertCount} Kasus` : null;
  const pklBadge = activePKLCount > 0 ? `${activePKLCount} PKL` : badgeCounts?.activePklCount ? `${badgeCounts.activePklCount} Magang` : null;

  const tabs = [
    {
      id: 'dashboard' as TabKey,
      label: 'Dashboard Vokasi',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'lifecycle' as TabKey,
      label: 'Lifecycle Siswa',
      icon: Users,
      badge: ppdbBadge,
      badgeColor: 'bg-sky-100 text-sky-700',
    },
    {
      id: 'bk' as TabKey,
      label: 'Catatan BK & Disiplin',
      icon: ShieldAlert,
      badge: bkBadge,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'nilai' as TabKey,
      label: 'Nilai Rapor & UKK',
      icon: Award,
      badge: null,
    },
    {
      id: 'pkl' as TabKey,
      label: 'PKL & Mitra DU/DI',
      icon: Briefcase,
      badge: pklBadge,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'kelulusan' as TabKey,
      label: 'Kelulusan & SKL',
      icon: GraduationCap,
      badge: null,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'tracer' as TabKey,
      label: 'Tracer Study (BMW)',
      icon: TrendingUp,
      badge: null,
      badgeColor: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xs border-b border-sky-100 sticky top-[102px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
