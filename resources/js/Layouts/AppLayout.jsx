import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    Users,
    Bell,
    Menu,
    X,
    BarChart3,
    Globe
} from 'lucide-react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import Avatar from '@/Components/Avatar';

export default function AppLayout({ children, title }) {
    const { auth, notifikasi_count, flash } = usePage().props;
    const user = auth.user;
    const [open, setOpen] = useState(false);

    const navItems = [
        { label: 'Dashboard',   href: '/dashboard',     icon: LayoutDashboard, roles: ['admin','petugas','masyarakat'] },
        { label: 'Pengaduan',   href: '/pengaduan',     icon: FileText,        roles: ['admin','petugas','masyarakat'] },
        { label: 'Pengguna',    href: '/admin/users',   icon: Users,           roles: ['admin'] },
        { label: 'Laporan',     href: '/admin/laporan', icon: BarChart3,       roles: ['admin'] },
        { label: 'Jelajahi',    href: '/pengaduan/publik', icon: Globe, roles: ['masyarakat'] },
    ];

    const filtered = navItems.filter(i => i.roles.includes(user?.role));
    const isActive = (href) => window.location.pathname.startsWith(href);

    return (
        <div className="min-h-screen bg-[#e8e8e8] flex">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap'); * { font-family: 'DM Sans', sans-serif; }`}</style>

            <div className="flex-1 bg-[#f5f5f5] flex overflow-hidden shadow-sm min-h-[calc(100vh-32px)]">

                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-52 bg-white border-r border-gray-100 flex flex-col rounded-l-3xl
                    transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                `}>
                    <div className="flex bg-[#f5f5f5] items-center gap-2.5 px-5 py-5">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <button onClick={() => setOpen(false)} className="lg:hidden ml-auto text-gray-400">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <nav className="flex-1 p-3 bg-[#f5f5f5] flex flex-col gap-0.5 overflow-y-auto">
                        {filtered.map(item => {
                            const active = isActive(item.href);
                            return (
                                <Link key={item.href} href={item.href}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                                        ${active
                                            ? 'bg-white text-black/70'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                                        }`}>
                                    <item.icon className="w-4 h-4 flex-shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {open && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setOpen(false)} />}

                <div className="flex-1 flex flex-col min-w-0">

                    <div className="h-16 bg-[#f5f5f5] border-b border-gray-100 px-6 mt-3 flex items-center gap-3">
                        <button onClick={() => setOpen(true)} className="lg:hidden text-gray-400 p-1">
                            <Menu className="w-5 h-5" />
                        </button>

                        <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>

                        <div className="flex items-center gap-2 ml-auto">
                            <Link href="/notifikasi"
                                className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                                <Bell className="w-4 h-4" />
                                {notifikasi_count > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
                                )}
                            </Link>

                            {user?.role === 'masyarakat' && (
                                <Link href="/pengaduan/create"
                                    className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white h-9 px-5 rounded-full text-sm font-semibold transition-colors">
                                    Buat Laporan
                                </Link>
                            )}

                            <Popover className="relative">
                                <PopoverButton className="focus:outline-none">
                                    <Avatar user={user} size="md" />
                                </PopoverButton>

                                <PopoverPanel
                                    anchor="bottom"
                                    className="absolute right-0 mt-3 w-52 rounded-2xl
                                    bg-white/30 backdrop-blur-xl border border-white/40
                                    shadow-xl p-2 text-sm z-50
                                    transition duration-200 ease-out
                                    data-[closed]:scale-95 data-[closed]:opacity-0"
                                >
                                    <div className="flex flex-col">
                                        <a href="/profile" className="px-3 py-2 rounded-lg hover:bg-slate-200 transition">
                                            Profile
                                        </a>

                                        <div className="my-1 border-t border-white/30"></div>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            className="text-left px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-600 transition"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                </PopoverPanel>
                            </Popover>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="mx-6 mt-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-2xl text-sm">
                            ✓ {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mx-6 mt-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
                            {flash.error}
                        </div>
                    )}

                    <main className="flex-1 p-6 overflow-auto mt-2">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}