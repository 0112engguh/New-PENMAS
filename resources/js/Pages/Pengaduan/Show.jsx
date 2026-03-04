import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Send, CheckCircle, XCircle, User, Calendar, MapPin, Tag } from 'lucide-react';
import UpdateStatusButton from '@/Components/UpdateStatusButton';


const STATUS_COLORS = {
  menunggu: 'bg-yellow-100 text-yellow-800',
  diproses: 'bg-blue-100 text-blue-800',
  selesai:  'bg-green-100 text-green-800',
  ditolak:  'bg-red-100 text-red-800',
};

export default function PengaduanShow({ pengaduan, petugasList }) {
  const { auth } = usePage().props;
  const user = auth.user;

  const tanggapanForm = useForm({ tanggapan: '' });
  const verifikasiForm = useForm({
    is_verified: pengaduan.is_verified,
    is_valid: pengaduan.is_valid,
    catatan_admin: pengaduan.catatan_admin || '',
    petugas_id: pengaduan.petugas_id || '',
  });


  const handleTanggapan = e => {
    e.preventDefault();
    tanggapanForm.post(`/pengaduan/${pengaduan.id}/tanggapan`, {
      onSuccess: () => tanggapanForm.reset(),
    });
  };

  const handleVerifikasi = e => {
    e.preventDefault();
    verifikasiForm.post(`/pengaduan/${pengaduan.id}/verifikasi`);
  };
  
  return (
    <AppLayout title={`Pengaduan #${pengaduan.kode_aduan}`}>
      <Head title={`Pengaduan - ${pengaduan.judul}`} />

      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {pengaduan.kode_aduan}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{pengaduan.judul}</h2>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${STATUS_COLORS[pengaduan.status]}`}>
                {pengaduan.status.charAt(0).toUpperCase() + pengaduan.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-5">
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-4 h-4" />
                <span>{pengaduan.user?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Tag className="w-4 h-4" />
                <span className="capitalize">{pengaduan.kategori}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(pengaduan.tanggal_pengaduan).toLocaleDateString('id-ID')}</span>
              </div>
              {pengaduan.lokasi && (
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{pengaduan.lokasi}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed mb-4">
              {pengaduan.isi_laporan}
            </div>

            {pengaduan.foto_url && (
              <img
                src={pengaduan.foto_url}
                alt="Foto pengaduan"
                className="rounded-xl max-h-80 w-full object-cover"
              />
            )}
          </div>

          {pengaduan.petugas && (
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-500">Ditangani oleh</p>
                <p className="text-sm font-medium text-blue-800">{pengaduan.petugas.name}</p>
              </div>
            </div>
          )}
        </div>

        {(user.role === 'admin' || user.role === 'petugas') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Panel Verifikasi & Validasi</h3>
            <form onSubmit={handleVerifikasi} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={verifikasiForm.data.is_verified}
                    onChange={e => verifikasiForm.setData('is_verified', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Terverifikasi</p>
                    <p className="text-xs text-gray-400">Identitas pelapor valid</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={verifikasiForm.data.is_valid}
                    onChange={e => verifikasiForm.setData('is_valid', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Divalidasi</p>
                    <p className="text-xs text-gray-400">Laporan layak ditindaklanjuti</p>
                  </div>
                </label>
              </div>

              {petugasList.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tugaskan ke Petugas</label>
                  <select
                    value={verifikasiForm.data.petugas_id}
                    onChange={e => verifikasiForm.setData('petugas_id', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Pilih Petugas --</option>
                    {petugasList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Admin</label>
                <textarea
                  rows={3}
                  value={verifikasiForm.data.catatan_admin}
                  onChange={e => verifikasiForm.setData('catatan_admin', e.target.value)}
                  placeholder="Catatan internal..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={verifikasiForm.processing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Simpan Verifikasi
              </button>
            </form>
          </div>
        )}

        <UpdateStatusButton pengaduan={pengaduan} user={user}/>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-5">
            Tanggapan ({pengaduan.tanggapans?.length || 0})
          </h3>

          <div className="space-y-4 mb-6">
            {pengaduan.tanggapans?.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Belum ada tanggapan</p>
              </div>
            )}
            {pengaduan.tanggapans?.map(t => (
              <div key={t.id} className={`flex gap-3 ${t.tipe !== 'masyarakat' ? 'flex-row-reverse' : ''}`}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.user?.name)}&size=32&background=${t.tipe === 'admin' ? 'ef4444' : t.tipe === 'petugas' ? '3b82f6' : '6366f1'}&color=fff`}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  alt=""
                />
                <div className={`flex-1 max-w-md ${t.tipe !== 'masyarakat' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    t.tipe === 'admin' ? 'bg-red-50 border border-red-100' :
                    t.tipe === 'petugas' ? 'bg-blue-50 border border-blue-100' :
                    'bg-gray-50 border border-gray-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-700">{t.user?.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        t.tipe === 'admin' ? 'bg-red-100 text-red-600' :
                        t.tipe === 'petugas' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {t.tipe}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{t.tanggapan}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {new Date(t.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {pengaduan.status !== 'ditolak' && (
            <form onSubmit={handleTanggapan} className="flex gap-3">
              <img
                src={auth.user.avatar_url}
                className="w-9 h-9 rounded-full flex-shrink-0"
                alt=""
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={tanggapanForm.data.tanggapan}
                  onChange={e => tanggapanForm.setData('tanggapan', e.target.value)}
                  placeholder="Tulis tanggapan..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={tanggapanForm.processing || !tanggapanForm.data.tanggapan}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}