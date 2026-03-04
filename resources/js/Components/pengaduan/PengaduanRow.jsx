import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import KategoriBadge from './KategoriBadge';

export default function PengaduanRow({ data }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-4">
        <p className="text-xs font-mono text-indigo-600 mb-0.5">
          {data.kode_aduan}
        </p>
        <p className="text-sm font-medium text-gray-900 line-clamp-1">
          {data.judul}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              data.user?.name
            )}&size=28&background=6366f1&color=fff`}
            className="w-7 h-7 rounded-full"
            alt=""
          />
          <span className="text-sm text-gray-700">
            {data.user?.name}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <KategoriBadge kategori={data.kategori} />
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={data.status} />
      </td>

      <td className="px-5 py-4 text-sm text-gray-500">
        {new Date(data.tanggal_pengaduan).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </td>

      <td className="px-5 py-4">
        <Link
          href={`/pengaduan/${data.id}`}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  );
}