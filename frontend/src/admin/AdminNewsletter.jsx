// AdminNewsletter.jsx - Newsletter subscriber management
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiCalendar, FiTrash2, FiSearch, FiDownload, FiRefreshCw, FiSend, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getNewsletterSubscribers();
      setSubscribers(response?.data?.subscribers || []);
    } catch (error) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriber) => {
    if (window.confirm(`Remove "${subscriber.email}" from newsletter?`)) {
      try {
        await apiWrapper.unsubscribeNewsletter(subscriber.email);
        toast.success('Subscriber removed');
        fetchSubscribers();
      } catch (error) {
        toast.error('Failed to remove');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Remove ${selectedSubscribers.length} subscribers?`)) {
      try {
        await Promise.all(selectedSubscribers.map(email => apiWrapper.unsubscribeNewsletter(email)));
        toast.success(`${selectedSubscribers.length} subscribers removed`);
        setSelectedSubscribers([]);
        fetchSubscribers();
      } catch (error) {
        toast.error('Failed to remove some subscribers');
      }
    }
  };

  const handleExport = () => {
    const csv = [['Email', 'Name', 'Subscribed Date'], ...subscribers.map(s => [s.email, s.name || '', new Date(s.subscribedAt).toLocaleDateString()])].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export started');
  };

  const handleSendEmail = async () => {
    if (!emailData.subject || !emailData.message) {
      toast.error('Please fill in subject and message');
      return;
    }
    setSending(true);
    try {
      const recipients = selectedSubscribers.length > 0 ? selectedSubscribers : subscribers.map(s => s.email);
      await apiWrapper.sendNewsletter({ recipients, subject: emailData.subject, message: emailData.message });
      toast.success(`Email sent to ${recipients.length} subscribers`);
      setShowEmailModal(false);
      setEmailData({ subject: '', message: '' });
      setSelectedSubscribers([]);
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) setSelectedSubscribers([]);
    else setSelectedSubscribers(filteredSubscribers.map(s => s.email));
  };

  const toggleSelect = (email) => {
    if (selectedSubscribers.includes(email)) setSelectedSubscribers(prev => prev.filter(e => e !== email));
    else setSelectedSubscribers(prev => [...prev, email]);
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => s.email?.toLowerCase().includes(searchTerm.toLowerCase()) || s.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [subscribers, searchTerm]);

  const EmailModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full">
        <div className="p-5 border-b flex justify-between items-center"><h2 className="text-xl font-bold">Send Newsletter</h2><button onClick={() => setShowEmailModal(false)}><FiXCircle className="h-5 w-5" /></button></div>
        <div className="p-5 space-y-4">
          <div><label className="block text-sm font-medium mb-1">Subject</label><input type="text" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
          <div><label className="block text-sm font-medium mb-1">Message</label><textarea rows={6} value={emailData.message} onChange={(e) => setEmailData({ ...emailData, message: e.target.value })} className="w-full p-2.5 border rounded-xl" placeholder="Write your newsletter content here..." /></div>
          <div className="text-sm text-neutral-500">Sending to: {selectedSubscribers.length > 0 ? `${selectedSubscribers.length} selected subscribers` : `${subscribers.length} all subscribers`}</div>
          <button onClick={handleSendEmail} disabled={sending} className="w-full py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">{sending ? 'Sending...' : 'Send Newsletter'}</button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-neutral-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold">Newsletter Subscribers</h1><p className="text-sm text-neutral-500">Manage email subscribers and send newsletters</p></div><div className="flex gap-2"><button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-neutral-50"><FiDownload />Export</button><button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiSend />Send Newsletter</button></div></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Total Subscribers</p><p className="text-2xl font-bold">{subscribers.length}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">This Month</p><p className="text-2xl font-bold">{subscribers.filter(s => new Date(s.subscribedAt).getMonth() === new Date().getMonth()).length}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Selected</p><p className="text-2xl font-bold">{selectedSubscribers.length}</p></div>
      </div>

      <div className="flex gap-3"><div className="flex-1 relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search by email or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl" /></div><button onClick={fetchSubscribers} className="px-4 py-2.5 border rounded-xl"><FiRefreshCw /></button>{selectedSubscribers.length > 0 && <button onClick={handleBulkDelete} className="px-4 py-2.5 bg-red-600 text-white rounded-xl">Remove Selected</button>}</div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full"><thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b"><tr><th className="p-4 w-12"><input type="checkbox" checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0} onChange={toggleSelectAll} className="w-4 h-4" /></th><th className="text-left p-4">Email</th><th className="text-left p-4">Name</th><th className="text-left p-4">Subscribed On</th><th className="text-left p-4">Status</th><th className="text-left p-4">Actions</th></tr></thead><tbody className="divide-y">{filteredSubscribers.map((sub, idx) => (<tr key={sub.email} className="hover:bg-neutral-50"><td className="p-4"><input type="checkbox" checked={selectedSubscribers.includes(sub.email)} onChange={() => toggleSelect(sub.email)} className="w-4 h-4" /></td><td className="p-4 flex items-center gap-2"><FiMail className="text-neutral-400" />{sub.email}</td><td className="p-4">{sub.name || '-'}</td><td className="p-4 text-sm"><FiCalendar className="inline mr-1 h-3 w-3" />{new Date(sub.subscribedAt).toLocaleDateString()}</td><td className="p-4"><span className="inline-flex items-center gap-1 text-xs text-green-600"><FiCheckCircle className="h-3 w-3" />Active</span></td><td className="p-4"><button onClick={() => handleDelete(sub)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 className="h-4 w-4" /></button></td></tr>))}</tbody></table></div>
        {filteredSubscribers.length === 0 && <div className="text-center py-12"><FiMail className="h-12 w-12 mx-auto text-neutral-400 mb-3" /><p className="text-neutral-500">No subscribers found</p></div>}
      </div>

      {showEmailModal && <EmailModal />}
    </div>
  );
};

export default AdminNewsletter;