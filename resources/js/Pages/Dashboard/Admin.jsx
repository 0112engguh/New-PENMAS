import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, FileText, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard({ stats, recentPengaduan, chartData }) {
  const statCards = [
    { label: 'Total Pengaduan', value: stats.total_pengaduan, icon: FileText, color: 'indigo', bg: 'bg-indigo-500' },
    { label: 'Menunggu', value: stats.menunggu, icon: Clock, color: 'yellow', bg: 'bg-yellow-500' },
    { label: 'Diproses', value: stats.diproses, icon: TrendingUp, color: 'blue', bg: 'bg-blue-500' },
    { label: 'Selesai', value: stats.selesai, icon: CheckCircle, color: 'green', bg: 'bg-green-500' },
    { label: 'Ditolak', value: stats.ditolak, icon: XCircle, color: 'red', bg: 'bg-red-500' },
    { label: 'Total Pengguna', value: stats.total_pengguna, icon: Users, color: 'purple', bg: 'bg-purple-500' },
  ];

  const statusColors = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-blue-100 text-blue-800',
    selesai:  'bg-green-100 text-green-800',
    ditolak:  'bg-red-100 text-red-800',
  };

  return (
    <AppLayout title="Dashboard Admin">
      <Head title="Dashboard Admin" />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Tren Pengaduan (6 Bulan Terakhir)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" name="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="selesai" name="Selesai" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Pengaduan Terbaru</h3>
          <div className="space-y-3">
            {recentPengaduan.map(p => (
              <a key={p.id} href={`/pengaduan/${p.id}`} className="block hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.judul}</p>
                    <p className="text-xs text-gray-500">{p.user?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}