const KATEGORI_COLORS = {
  infrastruktur: 'bg-orange-50 text-orange-700',
  pelayanan: 'bg-cyan-50 text-cyan-700',
  keamanan: 'bg-red-50 text-red-700',
  lingkungan: 'bg-green-50 text-green-700',
  lainnya: 'bg-gray-50 text-gray-700',
};

export default function KategoriBadge({ kategori }) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${KATEGORI_COLORS[kategori]}`}
    >
      {kategori}
    </span>
  );
}