// AdminContact.jsx - Contact messages management (FIXED - mobile responsive, compact design)
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, FiUser, FiMessageSquare, FiCheckCircle, FiXCircle, 
  FiEye, FiTrash2, FiSearch, FiFilter, FiRefreshCw, FiClock,
  FiArrowLeft, FiSend, FiArchive, FiStar, FiMoreVertical
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getContactMessages();
      // Handle different response formats
      let messagesData = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        messagesData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (Array.isArray(response)) {
        messagesData = response;
      } else if (response?.messages && Array.isArray(response.messages)) {
        messagesData = response.messages;
      }
      // Sort by createdAt descending (newest first)
      messagesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(messagesData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (message, status) => {
    try {
      setLoading(true);
      const response = await apiWrapper.updateContactMessageStatus(message._id, status);
      if (response?.success !== false) {
        toast.success(`Message marked as ${status}`);
        await fetchMessages();
      } else {
        throw new Error(response?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (message) => {
    if (window.confirm(`Delete message from "${message.name}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        // Assuming deleteContactMessage exists in apiWrapper
        // If not, you may need to add it or use updateStatus with 'archived'
        const response = await apiWrapper.deleteContactMessage?.(message._id) || 
                         await apiWrapper.updateContactMessageStatus(message._id, 'archived');
        if (response?.success !== false) {
          toast.success('Message deleted successfully');
          await fetchMessages();
          if (selectedMessage?._id === message._id) {
            setShowDetails(false);
            setSelectedMessage(null);
          }
        } else {
          throw new Error(response?.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error?.message || 'Failed to delete message');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    
    try {
      setSendingReply(true);
      // This assumes there's a reply endpoint or you're just updating status
      await apiWrapper.updateContactMessageStatus(selectedMessage._id, 'replied');
      toast.success('Reply sent (demo) - Email functionality would be implemented here');
      setReplying(false);
      setReplyText('');
      await fetchMessages();
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      unread: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      read: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      replied: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      archived: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400'
    };
    return badges[status?.toLowerCase()] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400';
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'unread': return <FiMail className="h-3 w-3" />;
      case 'read': return <FiEye className="h-3 w-3" />;
      case 'replied': return <FiCheckCircle className="h-3 w-3" />;
      default: return <FiMessageSquare className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredMessages = useMemo(() => {
    let filtered = [...messages];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.name?.toLowerCase().includes(term) ||
        msg.email?.toLowerCase().includes(term) ||
        msg.subject?.toLowerCase().includes(term) ||
        msg.message?.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    
    return filtered;
  }, [messages, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(m => m.status?.toLowerCase() === 'unread').length,
    read: messages.filter(m => m.status?.toLowerCase() === 'read').length,
    replied: messages.filter(m => m.status?.toLowerCase() === 'replied').length,
  }), [messages]);

  // Message Card Component for mobile/compact view
  const MessageCard = ({ msg, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`bg-white dark:bg-neutral-900 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
        msg.status?.toLowerCase() === 'unread' 
          ? 'border-l-4 border-l-red-500 border-neutral-200 dark:border-neutral-800' 
          : 'border border-neutral-200 dark:border-neutral-800'
      }`}
      onClick={() => { 
        setSelectedMessage(msg); 
        setShowDetails(true); 
        if (msg.status?.toLowerCase() === 'unread') {
          handleUpdateStatus(msg, 'read');
        }
      }}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              {msg.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <h3 className={`font-semibold text-sm sm:text-base truncate ${msg.status?.toLowerCase() === 'unread' ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
                {msg.name}
              </h3>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getStatusBadge(msg.status)}`}>
                {getStatusIcon(msg.status)}
                <span className="capitalize">{msg.status || 'unread'}</span>
              </span>
            </div>
            
            <p className="text-xs text-neutral-500 truncate mb-1">{msg.email}</p>
            
            <p className={`text-sm truncate ${msg.status?.toLowerCase() === 'unread' ? 'font-medium text-neutral-800 dark:text-neutral-200' : 'text-neutral-600 dark:text-neutral-400'}`}>
              {msg.subject}
            </p>
            
            <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5">
              {msg.message}
            </p>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
              <FiClock className="h-3 w-3" />
              <span>{formatDate(msg.createdAt)}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex-shrink-0">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleDelete(msg); 
              }} 
              className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Message Details Modal
  const MessageDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDetails(false)} 
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors lg:hidden"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Message Details</h2>
              <p className="text-xs text-neutral-500 mt-0.5">From customer inquiry</p>
            </div>
          </div>
          <button 
            onClick={() => setShowDetails(false)} 
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden lg:block"
          >
            <FiXCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-5 space-y-5">
          {/* Sender Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
              {selectedMessage?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg truncate">{selectedMessage?.name}</h3>
              <p className="text-sm text-neutral-500 truncate">{selectedMessage?.email}</p>
            </div>
            <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedMessage?.status)}`}>
              {getStatusIcon(selectedMessage?.status)}
              <span className="capitalize">{selectedMessage?.status || 'unread'}</span>
            </div>
          </div>
          
          {/* Subject */}
          <div>
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Subject</p>
            <p className="font-medium text-sm sm:text-base">{selectedMessage?.subject}</p>
          </div>
          
          {/* Message */}
          <div>
            <p className="text-xs sm:text-sm text-neutral-500 mb-2">Message</p>
            <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl whitespace-pre-wrap text-sm leading-relaxed">
              {selectedMessage?.message}
            </div>
          </div>
          
          {/* Date */}
          <div>
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Received</p>
            <p className="text-sm">{new Date(selectedMessage?.createdAt).toLocaleString()}</p>
          </div>
          
          {/* Reply Section */}
          {replying ? (
            <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <label className="block text-sm font-medium">Your Reply</label>
              <textarea 
                rows={4} 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                placeholder="Type your reply here..."
                className="w-full p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800"
              />
              <div className="flex gap-3">
                <button 
                  onClick={handleReply} 
                  disabled={sendingReply}
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sendingReply ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <FiSend className="h-4 w-4" />
                  )}
                  Send Reply
                </button>
                <button 
                  onClick={() => { setReplying(false); setReplyText(''); }} 
                  className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              {selectedMessage?.status?.toLowerCase() === 'unread' && (
                <button 
                  onClick={() => handleUpdateStatus(selectedMessage, 'read')} 
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
                >
                  <FiEye className="h-4 w-4" />
                  Mark as Read
                </button>
              )}
              {selectedMessage?.status?.toLowerCase() === 'read' && (
                <button 
                  onClick={() => setReplying(true)} 
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm"
                >
                  <FiSend className="h-4 w-4" />
                  Reply
                </button>
              )}
              {selectedMessage?.status?.toLowerCase() === 'replied' && (
                <button 
                  onClick={() => setReplying(true)} 
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center justify-center gap-2 text-sm"
                >
                  <FiSend className="h-4 w-4" />
                  Send Another Reply
                </button>
              )}
              <button 
                onClick={() => handleDelete(selectedMessage)} 
                className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center justify-center gap-2 text-sm"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete Message
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">Contact Messages</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">Manage customer inquiries and support requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Total</p>
            <FiMessageSquare className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Unread</p>
            <FiMail className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{stats.unread}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Read</p>
            <FiEye className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{stats.read}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Replied</p>
            <FiCheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.replied}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email, or subject..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="px-3 sm:px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          
          <button 
            onClick={fetchMessages} 
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            disabled={loading}
          >
            <FiRefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <FiMessageSquare className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No matching messages' : 'No messages yet'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Contact form submissions will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredMessages.map((msg, idx) => (
            <MessageCard key={msg._id} msg={msg} index={idx} />
          ))}
        </div>
      )}

      {/* Message Details Modal */}
      <AnimatePresence>
        {showDetails && <MessageDetailsModal />}
      </AnimatePresence>
    </div>
  );
};

export default AdminContact;