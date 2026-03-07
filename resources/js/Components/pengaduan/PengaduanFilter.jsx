import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { Search, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Ditolak' },
];

const KATEGORI_OPTIONS = [
  { value: '', label: 'Semua Kategori' },
  { value: 'infrastruktur', label: 'Infrastruktur' },
  { value: 'pelayanan', label: 'Pelayanan' },
  { value: 'keamanan', label: 'Keamanan' },
  { value: 'lingkungan', label: 'Lingkungan' },
  { value: 'lainnya', label: 'Lainnya' },
];

export default function PengaduanFilter({ filters, onFilter }) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [kategori, setKategori] = useState(filters.kategori || '');

  const selectedStatus =
    STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];

  const selectedKategori =
    KATEGORI_OPTIONS.find(o => o.value === kategori) || KATEGORI_OPTIONS[0];

  useEffect(() => {
    const delay = setTimeout(() => {
      onFilter({ search, status, kategori });
    }, 400);

    return () => clearTimeout(delay);
  }, [search, status, kategori]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Cari judul atau kode aduan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 sm:w-auto">

          <Listbox value={status} onChange={setStatus}>
            <div className="relative flex-1 sm:w-44">
              <Listbox.Button className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg flex justify-between items-center bg-white">
                {selectedStatus.label}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                {STATUS_OPTIONS.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50"
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          <Listbox value={kategori} onChange={setKategori}>
            <div className="relative flex-1 sm:w-44">
              <Listbox.Button className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg flex justify-between items-center bg-white">
                {selectedKategori.label}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                {KATEGORI_OPTIONS.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50"
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

        </div>

      </div>
    </div>
  );
}