import { Link } from '@inertiajs/react';

export default function Pagination({ meta }) {
  if (meta.last_page <= 1) return null;

  return (
    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Menampilkan {meta.from}–{meta.to} dari {meta.total} pengaduan
      </p>

      <div className="flex items-center gap-2">
        {meta.links.map((link, i) => (
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
  );
}