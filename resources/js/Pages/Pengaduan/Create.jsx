import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Upload, MapPin, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function PengaduanCreate() {
  const [preview, setPreview] = useState(null);
  const { data, setData, post, errors, processing } = useForm({
    judul: '',
    kategori: '',
    isi_laporan: '',
    lokasi: '',
    foto: null,
  });

  const handleSubmit = e => {
    e.preventDefault();
    post('/pengaduan', { forceFormData: true });
  };

  const handleFoto = e => {
    const file = e.target.files[0];
    if (file) {
      setData('foto', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <AppLayout title="Buat Pengaduan">
      <Head title="Buat Pengaduan" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5">
            <h2 className="text-lg font-bold text-white">Form Pengaduan Masyarakat</h2>
            <p className="text-indigo-100 text-sm mt-0.5">Sampaikan keluhan atau masukan Anda kepada kami</p>
          </div>

          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Pastikan informasi yang Anda sampaikan akurat dan tidak mengandung SARA. Pengaduan palsu dapat dikenakan sanksi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Judul Pengaduan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.judul}
                onChange={e => setData('judul', e.target.value)}
                placeholder="Contoh: Jalan Rusak di RT 05 RW 02"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['infrastruktur', 'pelayanan', 'keamanan', 'lingkungan', 'lainnya'].map(kat => (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setData('kategori', kat)}
                    className={`
                      py-2 px-2 text-xs font-medium rounded-lg border-2 transition-all capitalize
                      ${data.kategori === kat
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'}
                    `}
                  >
                    {kat}
                  </button>
                ))}
              </div>
              {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Isi Laporan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={data.isi_laporan}
                onChange={e => setData('isi_laporan', e.target.value)}
                placeholder="Jelaskan secara detail mengenai pengaduan Anda. Sertakan waktu kejadian, lokasi spesifik, dan dampak yang ditimbulkan..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex justify-between mt-1">
                {errors.isi_laporan && <p className="text-red-500 text-xs">{errors.isi_laporan}</p>}
                <p className="text-xs text-gray-400 ml-auto">{data.isi_laporan.length} karakter</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={data.lokasi}
                  onChange={e => setData('lokasi', e.target.value)}
                  placeholder="Jl. Merdeka No. 10, Kelurahan..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Pendukung</label>
              <label className={`
                flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer
                transition-colors overflow-hidden
                ${preview ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
              `}>
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">Klik untuk ganti foto</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <Upload className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk upload foto</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG maks. 2MB</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href="/pengaduan"
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Batal
              </a>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {processing ? 'Mengirim...' : 'Kirim Pengaduan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}