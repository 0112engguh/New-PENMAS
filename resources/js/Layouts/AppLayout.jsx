import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, FileText, Users, Bell, LogOut,
  Menu, X, ClipboardList, BarChart3, ChevronDown, User2
} from 'lucide-react';

export default function AppLayout({ children, title }) {
  const { auth, notifikasi_count, flash } = usePage().props;
  const user = auth.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'petugas', 'masyarakat'] },
    { label: 'Pengaduan', href: '/pengaduan', icon: FileText, roles: ['admin', 'petugas', 'masyarakat'] },
    { label: 'Kelola Pengguna', href: '/admin/users', icon: Users, roles: ['admin'] },
    { label: 'Laporan', href: '/admin/laporan', icon: BarChart3, roles: ['admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 to-indigo-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
      `}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-700">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Pengaduan</p>
            <p className="text-indigo-300 text-xs">Masyarakat</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-indigo-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-indigo-700">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <span className={`
                text-xs px-2 py-0.5 rounded-full
                ${user?.role === 'admin' ? 'bg-red-500 text-white' :
                  user?.role === 'petugas' ? 'bg-blue-400 text-white' :
                  'bg-green-400 text-white'}
              `}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {filteredNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${route().current(item.href.slice(1) + '*')
                  ? 'bg-white/20 text-white'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-indigo-700">
          <Link
            href="/profile"
            method="get"
            as="button"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-200 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <User2 className="w-5 h-5" />
            Profile
          </Link>
        </div>
        <div className="px-3 py-4 border-t border-indigo-700">
          <Link
            href="/logout"
            method="post"
            as="button"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-200 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>

          <div className="flex items-center gap-3">
            <Link href="/notifikasi" className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notifikasi_count > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>

            {user?.role === 'masyarakat' && (
              <Link
                href="/pengaduan/create"
                className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                Buat Pengaduan
              </Link>
            )}
          </div>
        </header>

        {flash?.success && (
          <div className="mx-4 lg:mx-6 mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
            ✓ {flash.success}
          </div>
        )}

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}