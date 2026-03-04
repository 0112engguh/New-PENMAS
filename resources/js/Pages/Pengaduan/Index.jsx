import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Filter, Plus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_COLORS = {
  menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  diproses: 'bg-blue-100 text-blue-800 border-blue-200',
  selesai:  'bg-green-100 text-green-800 border-green-200',
  ditolak:  'bg-red-100 text-red-800 border-red-200',
};

const KATEGORI_COLORS = {
  infrastruktur: 'bg-orange-50 text-orange-700',
  pelayanan:     'bg-cyan-50 text-cyan-700',
  keamanan:      'bg-red-50 text-red-700',
  lingkungan:    'bg-green-50 text-green-700',
  lainnya:       'bg-gray-50 text-gray-700',
};

export default function PengaduanIndex({ pengaduans, filters }) {
  const { auth } = usePage().props;
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [kategori, setKategori] = useState(filters.kategori || '');

  const handleFilter = () => {
    router.get('/pengaduan', { search, status, kategori }, { preserveState: true });
  };

  return (
    <AppLayout title="Daftar Pengaduan">
      <Head title="Pengaduan" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Daftar Pengaduan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Kelola dan pantau semua pengaduan masyarakat</p>
        </div>
        {auth.user.role === 'masyarakat' && (
          <Link
            href="/pengaduan/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Pengaduan
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau kode aduan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFilter()}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
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
          <select
            value={kategori}
            onChange={e => setKategori(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Semua Kategori</option>
            <option value="infrastruktur">Infrastruktur</option>
            <option value="pelayanan">Pelayanan</option>
            <option value="keamanan">Keamanan</option>
            <option value="lingkungan">Lingkungan</option>
            <option value="lainnya">Lainnya</option>
          </select>
          <button
            onClick={handleFilter}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode / Judul</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelapor</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pengaduans.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Tidak ada data pengaduan
                  </td>
                </tr>
              ) : (
                pengaduans.data.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-xs font-mono text-indigo-600 mb-0.5">{p.kode_aduan}</p>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.judul}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.user?.name)}&size=28&background=6366f1&color=fff`}
                          className="w-7 h-7 rounded-full"
                          alt=""
                        />
                        <span className="text-sm text-gray-700">{p.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${KATEGORI_COLORS[p.kategori]}`}>
                        {p.kategori}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(p.tanggal_pengaduan).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/pengaduan/${p.id}`}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pengaduans.last_page > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Menampilkan {pengaduans.from}–{pengaduans.to} dari {pengaduans.total} pengaduan
            </p>
            <div className="flex items-center gap-2">
              {pengaduans.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url || '#'}
                  preserveState
                  className={`
                    px-3 py-1.5 text-sm rounded-lg transition-colors
                    ${link.active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}
                    ${!link.url ? 'opacity-40 pointer-events-none' : ''}
                  `}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}