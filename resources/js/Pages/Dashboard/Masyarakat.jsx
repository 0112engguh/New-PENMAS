import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, ArrowRight, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const STATUS = {
    menunggu: { bg:'bg-yellow-50', text:'text-yellow-700', dot:'bg-yellow-400', label:'Menunggu' },
    diproses: { bg:'bg-blue-50',   text:'text-blue-700',   dot:'bg-blue-500',   label:'Diproses' },
    selesai:  { bg:'bg-green-50',  text:'text-green-700',  dot:'bg-green-500',  label:'Selesai'  },
    ditolak:  { bg:'bg-red-50',    text:'text-red-600',    dot:'bg-red-500',    label:'Ditolak'  },
};

const EMOJI = {
    infrastruktur: '🏗️',
    pelayanan:     '🏥',
    keamanan:      '🔒',
    lingkungan:    '🌿',
    lainnya:       '📋',
};

export default function MasyarakatDashboard({ stats, recentPengaduan }) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

                <div className="bg-white rounded-2xl border border-gray-100 p-7 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <p className="text-xs text-gray-400 font-medium mb-2">Selamat datang 👋</p>
                    <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
                        Suarakan<br />Aspirasimu
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        Laporkan masalah di sekitarmu dan pantau perkembangan pengaduanmu secara real-time.
                    </p>
                    <Link href="/pengaduan/create"
                        className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
                        <Plus className="w-4 h-4" /> Buat Pengaduan
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label:'Total Laporan', value: stats.total,    bg:'bg-gray-50',    text:'text-gray-700',   icon: FileText    },
                        { label:'Diproses',      value: stats.diproses, bg:'bg-blue-50',    text:'text-blue-700',   icon: Clock       },
                        { label:'Selesai',       value: stats.selesai,  bg:'bg-green-50',   text:'text-green-700',  icon: CheckCircle },
                        { label:'Ditolak',       value: stats.ditolak,  bg:'bg-red-50',     text:'text-red-600',    icon: XCircle     },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                                <s.icon className={`w-4 h-4 ${s.text}`} />
                            </div>
                            <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1">{s.value}</p>
                            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Pengaduan Saya</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Riwayat laporan yang pernah dibuat</p>
                    </div>
                    <Link href="/pengaduan"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 font-semibold transition-colors">
                        Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {recentPengaduan.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-400 mb-1">Belum ada pengaduan</p>
                        <p className="text-xs text-gray-300 mb-5">Mulai buat laporan pertamamu sekarang</p>
                        <Link href="/pengaduan/create"
                            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-gray-800 transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Buat Sekarang
                        </Link>
                    </div>
                ) : recentPengaduan.map((p, i) => {
                    const s = STATUS[p.status] ?? STATUS.menunggu;
                    return (
                        <Link key={p.id} href={`/pengaduan/${p.id}`}
                            className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors
                                ${i < recentPengaduan.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                                {EMOJI[p.kategori] ?? '📋'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate mb-1">{p.judul}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="font-mono">{p.kode_aduan}</span>
                                    <span className="text-gray-200">·</span>
                                    <span className="capitalize">{p.kategori}</span>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${s.bg} ${s.text} mb-1`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                    {s.label}
                                </span>
                                <p className="text-xs text-gray-300 block">
                                    {new Date(p.tanggal_pengaduan).toLocaleDateString('id-ID', {
                                        day:'2-digit', month:'short', year:'numeric'
                                    })}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </AppLayout>
    );
}