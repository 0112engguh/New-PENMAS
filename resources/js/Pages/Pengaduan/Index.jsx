import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import PengaduanFilter from '@/Components/pengaduan/PengaduanFilter';
import PengaduanRow from '@/Components/pengaduan/PengaduanRow';
import Pagination from '@/Components/pengaduan/Pagination';

export default function PengaduanIndex({ pengaduans, filters }) {
  const { auth } = usePage().props;

  const handleFilter = (params) => {
    router.get('/pengaduan', params, { preserveState: true });
  };

  return (
    <AppLayout title="Daftar Pengaduan">
      <Head title="Pengaduan" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Daftar Pengaduan
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola dan pantau semua pengaduan masyarakat
          </p>
        </div>

        {auth.user.role === 'masyarakat' && (
          <Link
            href="/pengaduan/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Buat Pengaduan
          </Link>
        )}
      </div>

      <PengaduanFilter filters={filters} onFilter={handleFilter} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Kode / Judul</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Pelapor</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                <th></th>
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
                  <PengaduanRow key={p.id} data={p} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination meta={pengaduans} />
      </div>
    </AppLayout>
  );
}