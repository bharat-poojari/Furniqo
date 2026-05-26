// AdminUsers.jsx - Complete user management with all fixes

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
import toast from 'react-hot-toast';

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
      
      // Handle different response structures
      let usersData = [];
      if (response?.data?.success && response.data.data) {
        usersData = response.data.data;
      } else if (response?.data?.success && response.data.users) {
        usersData = response.data.users;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (Array.isArray(response)) {
        usersData = response;
      } else if (response?.data?.users && Array.isArray(response.data.users)) {
        usersData = response.data.users;
      }
      
      // Ensure each user has required fields
      const normalizedUsers = usersData.map(user => ({
        ...user,
        isActive: user.isActive !== undefined ? user.isActive : true,
        role: user.role || 'user',
        createdAt: user.createdAt || user.created_at || new Date().toISOString(),
        updatedAt: user.updatedAt || user.updated_at || new Date().toISOString()
      }));
      
      setUsers(normalizedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      // Set empty array on error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'active' ? user.isActive !== false : user.isActive === false);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleUpdateRole = async () => {
    if (!selectedUser || !roleToAssign) return;
    
    try {
      await apiWrapper.updateUserRole(selectedUser._id, { role: roleToAssign });
      toast.success(`User role updated to ${roleToAssign}`);
      await fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await apiWrapper.deleteUser(selectedUser._id);
      toast.success('User deleted successfully');
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.isActive === false;
      await apiWrapper.toggleUserStatus(user._id, newStatus);
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleExportUsers = () => {
    if (users.length === 0) {
      toast.error('No users to export');
      return;
    }
    
    const csvHeaders = ['Name', 'Email', 'Role', 'Status', 'Joined Date'];
    const csvRows = users.map(u => [
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      u.role || 'user',
      u.isActive !== false ? 'Active' : 'Inactive',
      new Date(u.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Users exported successfully');
  };

  // Modal Components
  const UserDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">User Details</h2>
          <button onClick={() => setShowDetailsModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
              {selectedUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{selectedUser?.name || 'N/A'}</h3>
              <p className="text-neutral-500 text-sm">{selectedUser?.email}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${selectedUser?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {selectedUser?.role || 'user'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="text-xs text-neutral-500">User ID</p>
              <p className="font-mono text-xs break-all">{selectedUser?._id}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Joined</p>
              <p className="text-sm">{new Date(selectedUser?.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Last Updated</p>
              <p className="text-sm">{new Date(selectedUser?.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Status</p>
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${selectedUser?.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {selectedUser?.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          {selectedUser?.phone && (
            <div>
              <p className="text-xs text-neutral-500">Phone</p>
              <p className="text-sm">{selectedUser.phone}</p>
            </div>
          )}
          
          {(selectedUser?.address || selectedUser?.city || selectedUser?.state) && (
            <div>
              <p className="text-xs text-neutral-500">Address</p>
              <p className="text-sm">
                {selectedUser.address}
                {selectedUser.city && `, ${selectedUser.city}`}
                {selectedUser.state && `, ${selectedUser.state}`}
                {selectedUser.zipCode && ` ${selectedUser.zipCode}`}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  const RoleModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowRoleModal(false)}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full"
      >
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold">Update User Role</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-neutral-500 mb-3">
            User: <span className="font-semibold text-neutral-900 dark:text-white">{selectedUser?.name}</span>
          </p>
          <select
            value={roleToAssign}
            onChange={(e) => setRoleToAssign(e.target.value)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex gap-3">
          <button 
            onClick={() => setShowRoleModal(false)} 
            className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdateRole} 
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
          >
            Update Role
          </button>
        </div>
      </motion.div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full"
      >
        <div className="p-5">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FiTrash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Delete User</h2>
          <p className="text-center text-neutral-500">
            Are you sure you want to delete <span className="font-semibold text-neutral-900 dark:text-white">{selectedUser?.name}</span>? 
            This action cannot be undone.
          </p>
        </div>
        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex gap-3">
          <button 
            onClick={() => setShowDeleteModal(false)} 
            className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeleteUser} 
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Delete User
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return <UsersSkeleton />;
  }

  return (
    <>
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
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <button 
              onClick={fetchUsers} 
              className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">Total Users</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">Admins</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">Active</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{users.filter(u => u.isActive !== false).length}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500">This Month</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {users.filter(u => {
                const date = new Date(u.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">User</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">Joined</th>
                  <th className="text-left p-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-neutral-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user, idx) => (
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
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium text-neutral-900 dark:text-white">{user.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${user.isActive !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">{new Date(user.createdAt).toLocaleDateString()}</td>
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
                            <FiEye className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
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
                            <FiShield className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                            title={user.isActive !== false ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive !== false ? 
                              <FiUserX className="h-4 w-4 text-neutral-600 dark:text-neutral-400" /> : 
                              <FiUserCheck className="h-4 w-4 text-green-600" />
                            }
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-neutral-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-primary-600 text-white rounded-lg">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDetailsModal && <UserDetailsModal />}
        {showRoleModal && <RoleModal />}
        {showDeleteModal && <DeleteModal />}
      </AnimatePresence>
    </>
  );
};

const UsersSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div>
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded mt-2"></div>
      </div>
      <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
    </div>
    <div className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
      ))}
    </div>
    <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
  </div>
);

export default AdminUsers;