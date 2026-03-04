const STATUS_COLORS = {
  menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  diproses: 'bg-blue-100 text-blue-800 border-blue-200',
  selesai: 'bg-green-100 text-green-800 border-green-200',
  ditolak: 'bg-red-100 text-red-800 border-red-200',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  );
}