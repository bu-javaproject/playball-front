import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '홈', icon: '⌂' },
  { to: '/matches/my', label: '내 경기', icon: '♜' },
  { to: '/matching', label: '매칭', icon: '⌘' },
  //{ to: '/friends', label: '친구', icon: '♧' },
  { to: '/profile', label: '프로필', icon: '♙' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 grid h-16 w-full max-w-screen-sm -translate-x-1/2 grid-cols-4 border-t border-slate-200 bg-white">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${
              isActive ? 'text-blue-600' : 'text-slate-400'
            }`
          }
        >
          <span className="text-xl leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
