import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, ArrowRight, FileText, Users, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

const STATUS = {
    menunggu: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
    diproses: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
    selesai:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500'  },
    ditolak:  { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500'    },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-3">
            <p className="text-xs text-gray-400 font-semibold mb-1.5">{label}</p>
            {payload.map(p => (
                <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
};

export default function AdminDashboard({ stats, recentPengaduan, chartData }) {
    const rate = stats.total_pengaduan > 0
        ? Math.round((stats.selesai / stats.total_pengaduan) * 100)
        : 0;

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 mb-5">

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                        <h3 className="text-base font-bold text-gray-900">Overview</h3>
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-500 font-medium">
                            Bulan ini
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-gray-50">
                        {[
                            { label: 'Total Pengaduan', value: stats.total_pengaduan, change: '+12%', up: true },
                            { label: 'Total Pengguna',  value: stats.total_pengguna,  change: '+8%',  up: true },
                        ].map(s => (
                            <div key={s.label} className="px-6 py-6">
                                <p className="text-xs text-gray-400 font-medium mb-3">{s.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-extrabold text-gray-900 leading-none">
                                        {s.value.toLocaleString()}
                                    </span>
                                    <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full
                                        ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {s.up ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                                        {s.change}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300 mt-1.5">vs bulan lalu</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-5 border-t border-gray-50">
                        <p className="text-sm font-bold text-gray-900 mb-1">
                            {stats.menunggu} pengaduan menunggu tindakan
                        </p>
                        <p className="text-xs text-gray-400 mb-4">Segera ditindaklanjuti oleh petugas</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label:'Menunggu', val: stats.menunggu, ...STATUS.menunggu },
                                { label:'Diproses', val: stats.diproses, ...STATUS.diproses },
                                { label:'Selesai',  val: stats.selesai,  ...STATUS.selesai  },
                                { label:'Ditolak',  val: stats.ditolak,  ...STATUS.ditolak  },
                            ].map(s => (
                                <div key={s.label}
                                    className={`flex items-center gap-2 ${s.bg} px-3 py-2 rounded-xl`}>
                                    <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                                    <span className={`text-sm font-bold ${s.text}`}>{s.val}</span>
                                    <span className={`text-xs ${s.text} opacity-70`}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 flex flex-col">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h3 className="text-base font-bold text-gray-900">Pengaduan Terbaru</h3>
                    </div>

                    <div className="flex-1 p-2">
                        {recentPengaduan.slice(0, 5).map(p => {
                            const s = STATUS[p.status] ?? STATUS.menunggu;
                            return (
                                <Link key={p.id} href={`/pengaduan/${p.id}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                                        {p.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{p.judul}</p>
                                        <p className="text-xs text-gray-400 capitalize mt-0.5">{p.kategori}</p>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${s.bg} ${s.text} flex-shrink-0`}>
                                        {p.status}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-3 pt-0">
                        <Link href="/pengaduan"
                            className="block text-center py-2.5 rounded-xl border border-gray-100 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                            Semua Pengaduan
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

                <div className="bg-white rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Statistik Pengaduan</h3>
                            <p className="text-xs text-gray-400 mt-0.5">7 bulan terakhir</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {[['bg-gray-200','Total'],['bg-green-400','Selesai']].map(([c,l]) => (
                                <div key={l} className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${c}`} />
                                    <span className="text-xs text-gray-400">{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 pt-5 pb-2">
                        <p className="text-xs text-gray-300 mb-1">Total keseluruhan</p>
                        <p className="text-4xl font-extrabold text-gray-900">
                            {stats.total_pengaduan.toLocaleString()}
                            <span className="text-base font-medium text-gray-400 ml-2">pengaduan</span>
                        </p>
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData} margin={{ top: 8, right: 24, left: -10, bottom: 8 }} barSize={20} barGap={4}>
                            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f5f5f5" />
                            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#ccc' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#ccc' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 8 }} />
                            <Bar dataKey="total"   name="Total"   fill="#e5e7eb" radius={[6,6,0,0]} />
                            <Bar dataKey="selesai" name="Selesai" fill="#22c55e" radius={[6,6,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <p className="text-xs text-gray-400 font-medium mb-3">Tingkat Penyelesaian</p>
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-4xl font-extrabold text-gray-900">{rate}%</span>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                dari total
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full transition-all duration-1000"
                                style={{ width: `${rate}%` }} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-gray-300">0%</span>
                            <span className="text-xs text-gray-300">100%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label:'Petugas',  value: stats.total_petugas,  bg:'bg-blue-50',   text:'text-blue-700'  },
                            { label:'Pengguna', value: stats.total_pengguna, bg:'bg-purple-50', text:'text-purple-700'},
                            { label:'Ditolak',  value: stats.ditolak,        bg:'bg-red-50',    text:'text-red-600'   },
                            { label:'Respons',  value: '<24j',               bg:'bg-green-50',  text:'text-green-700' },
                        ].map(s => (
                            <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
                                <p className={`text-xl font-extrabold ${s.text}`}>{s.value}</p>
                                <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex-1">
                        <div className="px-4 py-3 border-b border-gray-50">
                            <h3 className="text-sm font-bold text-gray-900">Tanggapan Terbaru</h3>
                        </div>
                        <div className="p-2">
                            {recentPengaduan.filter(p => p.tanggapans_count > 0).slice(0, 3).map(p => (
                                <Link key={p.id} href={`/pengaduan/${p.id}`}
                                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0 mt-0.5">
                                        {p.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-700 leading-relaxed">
                                            <span className="font-semibold">{p.user?.name}</span> pada{' '}
                                            <span className="font-semibold">{p.judul}</span>
                                        </p>
                                        <p className="text-xs text-gray-300 mt-0.5">{p.tanggapans_count} tanggapan</p>
                                    </div>
                                </Link>
                            ))}
                            {recentPengaduan.filter(p => p.tanggapans_count > 0).length === 0 && (
                                <p className="text-xs text-gray-300 text-center py-6">Belum ada tanggapan</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}