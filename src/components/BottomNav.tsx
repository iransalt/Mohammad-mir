import React from 'react';
import { Home, DollarSign, Scale, Calculator, Bot, TrendingUp } from 'lucide-react';

export type TabType = 'dashboard' | 'rates' | 'bubble' | 'calculator' | 'ai' | 'trends';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'خانه', icon: Home },
    { id: 'rates' as TabType, label: 'طلا و ارز', icon: DollarSign },
    { id: 'bubble' as TabType, label: 'حباب‌سنج', icon: Scale },
    { id: 'calculator' as TabType, label: 'محاسبه‌گر', icon: Calculator },
    { id: 'ai' as TabType, label: 'ملیکا AI', icon: Bot, isSpecial: true },
    { id: 'trends' as TabType, label: 'نمودار', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-2xl">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? item.isSpecial
                    ? 'text-amber-400 font-bold'
                    : 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Background */}
              {isActive && (
                <div
                  className={`absolute inset-0 rounded-xl ${
                    item.isSpecial ? 'bg-amber-500/15 border border-amber-500/30' : 'bg-slate-800/80'
                  }`}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-400' : 'scale-100'
                  } ${item.isSpecial && isActive ? 'animate-bounce' : ''}`}
                />
                <span className="text-[10px] font-medium leading-none tracking-tight">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
