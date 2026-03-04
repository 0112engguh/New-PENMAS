import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileDown, Filter, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

const STATUS_COLORS = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-blue-100 text-blue-800',
    selesai:  'bg-green-100 text-green-800',
    ditolak:  'bg-red-100 text-red-800',
};

const PIE_COLORS = ['#6366f1', '#f59e0b', '#3b82f6', '#22c55e', '#ef4444'];

export default function Laporan({ pengaduans, summary }) {
    const currentYear  = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [bulan,  setBulan]  = useState('');
    const [tahun,  setTahun]  = useState(String(currentYear));
    const [status, setStatus] = useState('');

    const handleFilter = () => {
        router.get('/admin/laporan', { bulan, tahun, status }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    const kategoriCount = pengaduans.reduce((acc, p) => {
        acc[p.kategori] = (acc[p.kategori] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(kategoriCount).map(([name, value]) => ({ name, value }));

    const statusCount = [
        { name: 'Menunggu', value: summary.menunggu ?? 0,  fill: '#f59e0b' },
        { name: 'Diproses', value: summary.diproses ?? 0,  fill: '#3b82f6' },
        { name: 'Selesai',  value: summary.selesai ?? 0,   fill: '#22c55e' },
        { name: 'Ditolak',  value: summary.ditolak ?? 0,   fill: '#ef4444' },
    ];

    const months = [
        'Januari','Februari','Maret','April','Mei','Juni',
        'Juli','Agustus','September','Oktober','November','Desember'
    ];

    return (
        <AppLayout title="Laporan Pengaduan">
            <Head title="Laporan" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Laporan Pengaduan</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Rekap dan analisis data pengaduan masyarakat</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <FileDown className="w-4 h-4" />
                    Cetak / Export
                </button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={bulan}
                        onChange={e => setBulan(e.target.value)}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Semua Bulan</option>
                        {months.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                    <select
                        value={tahun}
                        onChange={e => setTahun(e.target.value)}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Semua Status</option>
                        <option value="menunggu">Menunggu</option>
                        <option value="diproses">Diproses</option>
                        <option value="selesai">Selesai</option>
                        <option value="ditolak">Ditolak</option>
                    </select>
                    <button
                        onClick={handleFilter}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Pengaduan', value: summary.total,    icon: TrendingUp,  bg: 'bg-indigo-500' },
                    { label: 'Menunggu',        value: summary.menunggu, icon: Clock,       bg: 'bg-yellow-500' },
                    { label: 'Selesai',         value: summary.selesai,  icon: CheckCircle, bg: 'bg-green-500'  },
                    { label: 'Ditolak',         value: summary.ditolak,  icon: XCircle,     bg: 'bg-red-500'    },
                ].map(card => (
                    <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                            <card.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value ?? 0}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Distribusi Status</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={statusCount} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" name="Jumlah" radius={[6, 6, 0, 0]}>
                                {statusCount.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Distribusi Kategori</h3>
                    {pieData.length === 0 ? (
                        <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
                            Tidak ada data
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" iconSize={8} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                        Detail Pengaduan
                        <span className="text-gray-400 font-normal text-sm ml-2">({pengaduans.length} data)</span>
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">No</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelapor</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pengaduans.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                                        Tidak ada data untuk filter yang dipilih
                                    </td>
                                </tr>
                            ) : pengaduans.map((p, i) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{i + 1}</td>
                                    <td className="px-5 py-3.5 text-xs font-mono text-indigo-600">{p.kode_aduan}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-900 max-w-xs">
                                        <p className="truncate">{p.judul}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.user?.name}</td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-xs capitalize text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                                            {p.kategori}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">
                                        {new Date(p.tanggal_pengaduan).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
