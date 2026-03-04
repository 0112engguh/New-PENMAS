import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, User, Shield } from 'lucide-react';

const ROLE_STYLES = {
    admin:       'bg-red-100 text-red-700',
    petugas:     'bg-blue-100 text-blue-700',
    masyarakat:  'bg-green-100 text-green-700',
};

const STATUS_STYLES = {
    aktif:    'bg-green-100 text-green-700',
    nonaktif: 'bg-gray-100 text-gray-500',
};

function Modal({ show, onClose, title, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export default function UsersIndex({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole]     = useState(filters.role || '');
    const [showAdd, setShowAdd]   = useState(false);
    const [editUser, setEditUser] = useState(null);

    const addForm = useForm({
        name: '', username: '', email: '', phone: '',
        role: 'masyarakat', password: '',
    });

    const editForm = useForm({ name: '', status: 'aktif', role: 'masyarakat' });

    const handleFilter = () => {
        router.get('/admin/users', { search, role }, { preserveState: true });
    };

    const handleAdd = e => {
        e.preventDefault();
        addForm.post('/admin/users', {
            onSuccess: () => { setShowAdd(false); addForm.reset(); },
        });
    };

    const openEdit = user => {
        setEditUser(user);
        editForm.setData({ name: user.name, status: user.status, role: user.role });
    };

    const handleEdit = e => {
        e.preventDefault();
        editForm.put(`/admin/users/${editUser.id}`, {
            onSuccess: () => setEditUser(null),
        });
    };

    const handleDelete = id => {
        if (confirm('Yakin ingin menghapus pengguna ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AppLayout title="Kelola Pengguna">
            <Head title="Kelola Pengguna" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Kelola Pengguna</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manajemen akun admin, petugas, dan masyarakat</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Pengguna
                </button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleFilter()}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Semua Role</option>
                        <option value="admin">Admin</option>
                        <option value="petugas">Petugas</option>
                        <option value="masyarakat">Masyarakat</option>
                    </select>
                    <button
                        onClick={handleFilter}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cari
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengguna</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bergabung</th>
                                <th className="px-5 py-3.5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                                        Tidak ada data pengguna
                                    </td>
                                </tr>
                            ) : users.data.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=36&background=6366f1&color=fff`}
                                                className="w-9 h-9 rounded-full"
                                                alt=""
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ROLE_STYLES[u.role]}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[u.status]}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => openEdit(u)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Menampilkan {users.from}–{users.to} dari {users.total} pengguna
                        </p>
                        <div className="flex items-center gap-1">
                            {users.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    preserveState
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors
                                        ${link.active ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}
                                        ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal show={showAdd} onClose={() => setShowAdd(false)} title="Tambah Pengguna Baru">
                <form onSubmit={handleAdd} className="space-y-4">
                    {[
                        { label: 'Nama Lengkap', field: 'name', type: 'text', placeholder: 'John Doe' },
                        { label: 'Username', field: 'username', type: 'text', placeholder: 'johndoe' },
                        { label: 'Email', field: 'email', type: 'email', placeholder: 'john@example.com' },
                        { label: 'No. Telepon', field: 'phone', type: 'text', placeholder: '081234567890' },
                        { label: 'Password', field: 'password', type: 'password', placeholder: 'Min. 8 karakter' },
                    ].map(f => (
                        <div key={f.field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                            <input
                                type={f.type}
                                value={addForm.data[f.field]}
                                onChange={e => addForm.setData(f.field, e.target.value)}
                                placeholder={f.placeholder}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {addForm.errors[f.field] && (
                                <p className="text-red-500 text-xs mt-1">{addForm.errors[f.field]}</p>
                            )}
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={addForm.data.role}
                            onChange={e => addForm.setData('role', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="masyarakat">Masyarakat</option>
                            <option value="petugas">Petugas</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowAdd(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button type="submit" disabled={addForm.processing}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                            {addForm.processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal show={!!editUser} onClose={() => setEditUser(null)} title="Edit Pengguna">
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={editForm.data.name}
                            onChange={e => editForm.setData('name', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={editForm.data.role}
                            onChange={e => editForm.setData('role', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="masyarakat">Masyarakat</option>
                            <option value="petugas">Petugas</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={editForm.data.status}
                            onChange={e => editForm.setData('status', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Non-aktif</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setEditUser(null)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button type="submit" disabled={editForm.processing}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                            {editForm.processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
