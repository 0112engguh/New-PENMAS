import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Tag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import PengaduanFilter from '@/Components/pengaduan/PengaduanFilter';

const STATUS = {
    menunggu: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400', label: 'Menunggu' },
    diproses: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'Diproses' },
    selesai:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Selesai'  },
    ditolak:  { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500',    label: 'Ditolak'  },
};

const KATEGORI_COLOR = {
    infrastruktur: 'bg-orange-50 text-orange-600',
    pelayanan:     'bg-cyan-50 text-cyan-600',
    keamanan:      'bg-red-50 text-red-600',
    lingkungan:    'bg-green-50 text-green-600',
    lainnya:       'bg-gray-100 text-gray-500',
};

const PLACEHOLDER_COLORS = [
    'from-violet-100 to-purple-100',
    'from-blue-100 to-cyan-100',
    'from-green-100 to-emerald-100',
    'from-orange-100 to-amber-100',
    'from-pink-100 to-rose-100',
    'from-indigo-100 to-blue-100',
];

export default function PengaduanPublik({ pengaduans, filters }) {
    const [search,   setSearch]   = useState(filters?.search   ?? '');
    const [status,   setStatus]   = useState(filters?.status   ?? '');
    const [kategori, setKategori] = useState(filters?.kategori ?? '');
    const [view,     setView]     = useState('grid'); // grid | list
    

    const handleFilter = (params) => {
      router.get('/pengaduan/publik', params, { preserveState: true });
    };

    const safePengaduans = pengaduans?.data ?? [];

    return (
        <AppLayout title="Semua Pengaduan">
            <Head title="Semua Pengaduan" />

            <div className="mb-6">
                <p className="text-sm text-gray-400">
                    Lihat seluruh pengaduan masyarakat yang telah dilaporkan
                </p>
            </div>

            <PengaduanFilter filters={filters} onFilter={handleFilter}/>
            <div className="flex items-center justify-end rounded-xl p-1 ml-auto">
                <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                    </svg>
                </button>
                <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </button>
            </div>

            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">
                    Menampilkan <span className="font-semibold text-gray-700">{pengaduans?.total ?? 0}</span> pengaduan
                </p>
            </div>

            {safePengaduans.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Tidak ada pengaduan ditemukan</p>
                    <p className="text-xs text-gray-300">Coba ubah filter pencarian</p>
                </div>
            )}

            {view === 'grid' && safePengaduans.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
                    {safePengaduans.map((p, idx) => {
                        const s  = STATUS[p.status]   ?? STATUS.menunggu;
                        const kc = KATEGORI_COLOR[p.kategori] ?? KATEGORI_COLOR.lainnya;
                        const ph = PLACEHOLDER_COLORS[idx % PLACEHOLDER_COLORS.length];

                        return (
                            <Link key={p.id} href={`/pengaduan/${p.id}`}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">

                                <div className="relative aspect-video overflow-hidden">
                                    {p.foto_url ? (
                                        <img
                                            src={p.foto_url}
                                            alt={p.judul}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={e => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}

                                    <div className="absolute top-2.5 right-2.5">
                                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${s.bg} ${s.text} shadow-sm`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                            {s.label}
                                        </span>
                                    </div>

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 transform duration-200">
                                            <Eye className="w-4 h-4 text-gray-700" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="text-[10px] font-mono text-gray-400 mb-1.5">{p.kode_aduan}</p>

                                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 line-clamp-2">
                                        {p.judul}
                                    </h3>

                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg capitalize ${kc}`}>
                                            {p.kategori}
                                        </span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(p.tanggal_pengaduan).toLocaleDateString('id-ID', { day:'2-digit', month:'short' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                                            {p.user?.avatar ? (
                                                <img
                                                    src={`/storage/${p.user.avatar}`}
                                                    alt={p.user.name}
                                                    className="w-full rounded-full h-full object-cover"
                                                />
                                            ) : (
                                                <div>
                                                    {p.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 truncate">{p.user?.name}</span>
                                        {p.lokasi && (
                                            <span className="flex items-center gap-1 text-[10px] text-gray-300 ml-auto truncate max-w-[80px]">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                {p.lokasi}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {view === 'list' && safePengaduans.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
                    {safePengaduans.map((p, i) => {
                        const s  = STATUS[p.status]   ?? STATUS.menunggu;
                        const kc = KATEGORI_COLOR[p.kategori] ?? KATEGORI_COLOR.lainnya;
                        const ph = PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length];

                        return (
                            <Link key={p.id} href={`/pengaduan/${p.id}`}
                                className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors
                                    ${i < safePengaduans.length - 1 ? 'border-b border-gray-50' : ''}`}>

                                <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                    {p.foto_url ? (
                                        <img src={p.foto_url} alt={p.judul}
                                            className="w-full h-full object-cover"
                                            onError={e => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-mono text-gray-400">{p.kode_aduan}</span>
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md capitalize ${kc}`}>
                                            {p.kategori}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 truncate mb-1">{p.judul}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600">
                                                {p.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            {p.user?.name}
                                        </span>
                                        {p.lokasi && (
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />{p.lokasi}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${s.bg} ${s.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                        {s.label}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(p.tanggal_pengaduan).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {pengaduans?.last_page > 1 && (
                <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3">
                    <p className="text-sm text-gray-400">
                        Halaman <span className="font-semibold text-gray-700">{pengaduans.current_page}</span> dari{' '}
                        <span className="font-semibold text-gray-700">{pengaduans.last_page}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        {pengaduans.links.map((link, i) => (
                            <Link key={i}
                                href={link.url ?? '#'}
                                preserveState
                                className={`flex items-center justify-center min-w-[34px] h-8 px-2 rounded-xl text-sm font-medium transition-all
                                    ${link.active
                                        ? 'bg-black text-white'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                                    }
                                    ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}