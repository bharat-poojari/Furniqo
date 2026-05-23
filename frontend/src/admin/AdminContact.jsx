// AdminContact.jsx - Contact messages management
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageSquare, FiCheckCircle, FiXCircle, FiEye, FiTrash2, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getContactMessages();
      setMessages(response?.data?.messages || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (message, status) => {
    try {
      await apiWrapper.updateContactMessageStatus(message._id, { status });
      toast.success(`Message marked as ${status}`);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (message) => {
    if (window.confirm(`Delete message from "${message.name}"?`)) {
      try {
        await apiWrapper.deleteContactMessage(message._id);
        toast.success('Message deleted');
        fetchMessages();
        if (selectedMessage?._id === message._id) setShowDetails(false);
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesSearch = searchTerm === '' ||
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    const badges = {
      unread: 'bg-red-100 text-red-700',
      read: 'bg-blue-100 text-blue-700',
      replied: 'bg-green-100 text-green-700',
      archived: 'bg-gray-100 text-gray-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const MessageDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Message Details</h2>
          <button onClick={() => setShowDetails(false)} className="p-1 rounded-lg hover:bg-neutral-100"><FiXCircle className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">{selectedMessage?.name?.charAt(0)}</div>
            <div><h3 className="font-semibold">{selectedMessage?.name}</h3><p className="text-sm text-neutral-500">{selectedMessage?.email}</p></div>
          </div>
          <div><p className="text-sm text-neutral-500">Subject</p><p className="font-medium">{selectedMessage?.subject}</p></div>
          <div><p className="text-sm text-neutral-500">Message</p><div className="mt-1 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl whitespace-pre-wrap">{selectedMessage?.message}</div></div>
          <div><p className="text-sm text-neutral-500">Received</p><p>{new Date(selectedMessage?.createdAt).toLocaleString()}</p></div>
          <div className="flex gap-3 pt-3 border-t">
            {selectedMessage?.status === 'unread' && <button onClick={() => handleUpdateStatus(selectedMessage, 'read')} className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Mark as Read</button>}
            {selectedMessage?.status === 'read' && <button onClick={() => handleUpdateStatus(selectedMessage, 'replied')} className="flex-1 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">Mark as Replied</button>}
            <button onClick={() => handleDelete(selectedMessage)} className="flex-1 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50">Delete Message</button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-neutral-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Contact Messages</h1><p className="text-sm text-neutral-500">Manage customer inquiries</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Total</p><p className="text-2xl font-bold">{messages.length}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Unread</p><p className="text-2xl font-bold text-red-600">{messages.filter(m => m.status === 'unread').length}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Read</p><p className="text-2xl font-bold text-blue-600">{messages.filter(m => m.status === 'read').length}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Replied</p><p className="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'replied').length}</p></div>
      </div>

      <div className="flex gap-3"><div className="flex-1 relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search by name, email, or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl" /></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border rounded-xl"><option value="all">All Status</option><option value="unread">Unread</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select><button onClick={fetchMessages} className="px-4 py-2.5 border rounded-xl"><FiRefreshCw /></button></div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden">
        <div className="divide-y">
          {filteredMessages.map((msg, idx) => (
            <motion.div key={msg._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.02 }} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition cursor-pointer" onClick={() => { setSelectedMessage(msg); setShowDetails(true); if (msg.status === 'unread') handleUpdateStatus(msg, 'read'); }}>
              <div className="flex items-start justify-between">
                <div className="flex-1"><div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold">{msg.name?.charAt(0)}</div><div><p className="font-semibold">{msg.name}</p><p className="text-sm text-neutral-500">{msg.email}</p></div></div><p className="font-medium text-primary-600 mb-1">{msg.subject}</p><p className="text-sm text-neutral-600 line-clamp-2">{msg.message}</p><div className="flex items-center gap-3 mt-2 text-xs text-neutral-400"><span>{new Date(msg.createdAt).toLocaleDateString()}</span><span className={`px-2 py-0.5 rounded-full ${getStatusBadge(msg.status)}`}>{msg.status}</span></div></div><div className="flex gap-1"><button onClick={(e) => { e.stopPropagation(); handleDelete(msg); }} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 className="h-4 w-4" /></button></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 && <div className="text-center py-12"><FiMessageSquare className="h-12 w-12 mx-auto text-neutral-400 mb-3" /><p className="text-neutral-500">No messages found</p></div>}
      {showDetails && <MessageDetailsModal />}
    </div>
  );
};

export default AdminContact;