// AdminUsers.jsx - Complete user management
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMail,
  FiShield,
  FiUserX,
  FiUserCheck,
  FiRefreshCw,
  FiPlus,
  FiX,
  FiChevronDown,
  FiDownload
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToAssign, setRoleToAssign] = useState('');
  const itemsPerPage = 12;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getUsers();
      setUsers(response?.data?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'active' ? user.isActive : !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleUpdateRole = async () => {
    try {
      await apiWrapper.updateUserRole(selectedUser._id, { role: roleToAssign });
      toast.success(`User role updated to ${roleToAssign}`);
      fetchUsers();
      setShowRoleModal(false);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await apiWrapper.deleteUser(selectedUser._id);
      toast.success('User deleted successfully');
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await apiWrapper.updateUser(user._id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleExportUsers = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Joined Date'],
      ...users.map(u => [u.name, u.email, u.role, u.isActive ? 'Active' : 'Inactive', new Date(u.createdAt).toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Users exported successfully');
  };

  const UserDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">User Details</h2>
          <button onClick={() => setShowDetailsModal(false)} className="p-1 rounded-lg hover:bg-neutral-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
              {selectedUser?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{selectedUser?.name}</h3>
              <p className="text-neutral-500">{selectedUser?.email}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${selectedUser?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {selectedUser?.role}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm text-neutral-500">User ID</p>
              <p className="font-mono text-xs">{selectedUser?._id}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Joined</p>
              <p>{new Date(selectedUser?.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Last Updated</p>
              <p>{new Date(selectedUser?.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Status</p>
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${selectedUser?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {selectedUser?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          {selectedUser?.address && (
            <div>
              <p className="text-sm text-neutral-500">Address</p>
              <p className="text-sm">{selectedUser.address}</p>
            </div>
          )}
          {selectedUser?.phone && (
            <div>
              <p className="text-sm text-neutral-500">Phone</p>
              <p>{selectedUser.phone}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  const RoleModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full"
      >
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold">Update User Role</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-neutral-500 mb-3">User: <span className="font-semibold text-neutral-900">{selectedUser?.name}</span></p>
          <select
            value={roleToAssign}
            onChange={(e) => setRoleToAssign(e.target.value)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex gap-3">
          <button onClick={() => setShowRoleModal(false)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50">
            Cancel
          </button>
          <button onClick={handleUpdateRole} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
            Update Role
          </button>
        </div>
      </motion.div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full"
      >
        <div className="p-5">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FiTrash2 className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Delete User</h2>
          <p className="text-center text-neutral-500">
            Are you sure you want to delete <span className="font-semibold text-neutral-900">{selectedUser?.name}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="p-5 border-t border-neutral-200 flex gap-3">
          <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50">
            Cancel
          </button>
          <button onClick={handleDeleteUser} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
            Delete User
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <UsersSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage and moderate all registered users</p>
        </div>
        <button
          onClick={handleExportUsers}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <FiDownload className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={fetchUsers} className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">Admins</p>
          <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">Active</p>
          <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">This Month</p>
          <p className="text-2xl font-bold">{users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">User</th>
                <th className="text-left p-4 text-sm font-semibold">Email</th>
                <th className="text-left p-4 text-sm font-semibold">Role</th>
                <th className="text-left p-4 text-sm font-semibold">Status</th>
                <th className="text-left p-4 text-sm font-semibold">Joined</th>
                <th className="text-left p-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {paginatedUsers.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name?.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        title="View Details"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setRoleToAssign(user.role);
                          setShowRoleModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        title="Change Role"
                      >
                        <FiShield className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <FiUserX className="h-4 w-4" /> : <FiUserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
            <p className="text-sm text-neutral-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-primary-600 text-white rounded-lg">{currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && <UserDetailsModal />}
      {showRoleModal && <RoleModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

const UsersSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
    <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
    <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
  </div>
);

export default AdminUsers;