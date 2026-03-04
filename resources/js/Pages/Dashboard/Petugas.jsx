import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, CheckCircle, Clock, ArrowRight, User } from 'lucide-react';

const STATUS_COLORS = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-blue-100 text-blue-800',
    selesai:  'bg-green-100 text-green-800',
    ditolak:  'bg-red-100 text-red-800',
};

export default function PetugasDashboard({ stats, tugasSaya }) {
    const statCards = [
        { label: 'Total Ditugaskan', value: stats.ditugaskan, icon: ClipboardList, bg: 'bg-indigo-500' },
        { label: 'Sedang Diproses', value: stats.diproses,   icon: Clock,          bg: 'bg-blue-500'   },
        { label: 'Selesai',         value: stats.selesai,    icon: CheckCircle,    bg: 'bg-green-500'  },
    ];

    return (
        <AppLayout title="Dashboard Petugas">
            <Head title="Dashboard Petugas" />

            {/* Welcome */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 mb-6 text-white">
                <p className="text-blue-100 text-sm mb-1">Selamat Datang,</p>
                <h2 className="text-2xl font-bold mb-1">Petugas Lapangan 👮</h2>
                <p className="text-blue-100 text-sm">Pantau dan tangani pengaduan yang ditugaskan kepada Anda.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {statCards.map(card => (
                    <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tugas Aktif */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Tugas Aktif Saya</h3>
                    <Link
                        href="/pengaduan"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                        Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {tugasSaya.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Belum ada tugas aktif</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {tugasSaya.map(p => (
                            <Link
                                key={p.id}
                                href={`/pengaduan/${p.id}`}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                                {/* Avatar pelapor */}
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.user?.name ?? '')}&size=36&background=6366f1&color=fff`}
                                    className="w-9 h-9 rounded-full flex-shrink-0"
                                    alt=""
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{p.judul}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">{p.user?.name}</span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-xs text-gray-500 capitalize">{p.kategori}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                                        {p.status}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-gray-300" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
