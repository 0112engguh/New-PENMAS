import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, Clock, CheckCircle, Plus, ArrowRight, AlertCircle } from 'lucide-react';

const STATUS_COLORS = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-blue-100 text-blue-800',
    selesai:  'bg-green-100 text-green-800',
    ditolak:  'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
    menunggu: Clock,
    diproses: AlertCircle,
    selesai:  CheckCircle,
    ditolak:  AlertCircle,
};

export default function MasyarakatDashboard({ stats, pengaduanSaya }) {
    const { auth } = usePage().props;

    const statCards = [
        { label: 'Total Pengaduan', value: stats.total,    icon: FileText,    bg: 'bg-indigo-500' },
        { label: 'Menunggu',        value: stats.menunggu, icon: Clock,        bg: 'bg-yellow-500' },
        { label: 'Diproses',        value: stats.diproses, icon: AlertCircle,  bg: 'bg-blue-500'   },
        { label: 'Selesai',         value: stats.selesai,  icon: CheckCircle,  bg: 'bg-green-500'  },
    ];

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute right-12 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative">
                    <p className="text-indigo-200 text-sm mb-1">Selamat Datang,</p>
                    <h2 className="text-2xl font-bold mb-3">{auth.user.name} 👋</h2>
                    <p className="text-indigo-100 text-sm mb-5 max-w-sm">
                        Ada keluhan atau masukan? Sampaikan kepada kami dan kami akan segera menindaklanjutinya.
                    </p>
                    <Link
                        href="/pengaduan/create"
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Pengaduan Baru
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {statCards.map(card => (
                    <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                            <card.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Pengaduan Terbaru */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Pengaduan Terbaru Saya</h3>
                    <Link
                        href="/pengaduan"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                        Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {pengaduanSaya.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                        <p className="text-sm text-gray-400 mb-4">Anda belum memiliki pengaduan</p>
                        <Link
                            href="/pengaduan/create"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Pengaduan Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {pengaduanSaya.map(p => {
                            const StatusIcon = STATUS_ICONS[p.status] ?? FileText;
                            return (
                                <Link
                                    key={p.id}
                                    href={`/pengaduan/${p.id}`}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <StatusIcon className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{p.judul}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-mono text-indigo-500">{p.kode_aduan}</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(p.tanggal_pengaduan).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                                            {p.status}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
