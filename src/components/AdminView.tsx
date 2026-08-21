import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, ShieldAlert, ArrowUpCircle, Ban, Search, CheckCircle, Clock, Users, UserCheck, Activity, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

interface PendingUpgrade {
  id: string;
  email: string;
  action: string;
  itemName: string;
  txId: string;
  date: number;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: number;
  lastLogin: number;
  status: 'active' | 'banned';
  tier: 'free' | 'regular' | 'pro';
  purchases: any[];
}

export function AdminView() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingUpgrades, setPendingUpgrades] = useState<PendingUpgrade[]>([]);
  const [activeTab, setActiveTab] = useState<'paid' | 'free' | 'pending'>('paid');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const data: UserData[] = [];
      snap.forEach(doc => {
        data.push({ ...doc.data(), uid: doc.id } as UserData);
      });
      setUsers(data.sort((a, b) => b.lastLogin - a.lastLogin));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (uid: string, status: 'active' | 'banned') => {
    try {
      await updateDoc(doc(db, 'users', uid), { status });
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status } : u));
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const handleUpdateTier = async (uid: string, tier: 'free' | 'regular' | 'pro') => {
    try {
      await updateDoc(doc(db, 'users', uid), { tier });
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, tier } : u));
    } catch (e) {
      console.error(e);
      alert('Failed to update tier');
    }
  };

  const handleDeleteUser = async (uid: string, email: string) => {
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete user ${email} and ALL their projects? This action cannot be undone.`)) {
      return;
    }
    try {
      // Delete user document
      await deleteDoc(doc(db, 'users', uid));
      
      // Delete user's projects
      const q = query(collection(db, 'projects'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      setUsers(prev => prev.filter(u => u.uid !== uid));
    } catch (e) {
      console.error(e);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (ts: number) => {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleString();
  };

  const formatRelativeTime = (ts: number) => {
    if (!ts) return 'Never';
    const diff = Date.now() - ts;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return mins <= 1 ? 'Just now' : `${mins} mins ago`;
      }
      return `${hours} hours ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days > 30) return new Date(ts).toLocaleDateString();
    return `${days} days ago`;
  };

  return (
    <div className="flex-1 overflow-auto bg-white p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-black pb-6">
          <div>
            <h2 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
              <Shield size={28} />
              ADMINISTRATION
            </h2>
            <p className="text-sm text-neutral-600 mt-2 font-medium uppercase tracking-widest">System Management Console</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-none text-black font-medium focus:outline-none focus:ring-2 focus:ring-black placeholder-neutral-400"
            />
          </div>
        </div>

        
        <div className="flex gap-4 border-b-2 border-black">
          
          <button 
            onClick={() => setActiveTab('paid')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'paid' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}`}
          >
            Paid Users
          </button>
          <button 
            onClick={() => setActiveTab('free')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'free' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}`}
          >
            Free / Locked
          </button>
  
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}`}
          >
            Pending Upgrades {pendingUpgrades.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingUpgrades.length}</span>}
          </button>
        </div>
        {(activeTab === 'paid' || activeTab === 'free') ? (
          <>
        {/* Stats Row */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-2 border-black p-4 flex flex-col gap-2 bg-white">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1.5"><Users size={14}/> Total Users</span>
              <span className="text-3xl font-black text-black">{users.length}</span>
            </div>
            <div className="border-2 border-black p-4 flex flex-col gap-2 bg-white">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1.5"><UserCheck size={14}/> Active Today</span>
              <span className="text-3xl font-black text-black">{users.filter(u => Date.now() - u.lastLogin < 24 * 60 * 60 * 1000).length}</span>
            </div>
            <div className="border-2 border-black p-4 flex flex-col gap-2 bg-white">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1.5"><Activity size={14}/> Online Now</span>
              <span className="text-3xl font-black text-black">{users.filter(u => Date.now() - u.lastLogin < 15 * 60 * 1000).length}</span>
            </div>
            <div className="border-2 border-black p-4 flex flex-col gap-2 bg-black text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70 flex items-center gap-1.5"><ArrowUpCircle size={14}/> Paid Tier</span>
              <span className="text-3xl font-black">{users.filter(u => u.tier === 'regular' || u.tier === 'pro').length}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="border-2 border-black">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black">User / Account</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Activity</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Status & Tier</th>
                                    <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-black font-bold uppercase">No users found.</td>
                  </tr>
                ) : filteredUsers.map((u, i) => (
                  <React.Fragment key={u.uid}>
                  <tr className={`border-b border-black ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-100'} hover:bg-neutral-200 transition-colors`}>
                    <td 
                      className="py-4 px-4 align-top border-r border-black cursor-pointer hover:bg-neutral-200 group"
                      onClick={() => setExpandedUser(expandedUser === u.uid ? null : u.uid)}
                    >
                      <div className="font-bold text-black group-hover:underline">{u.displayName || 'Unknown'}</div>
                      <div className="text-sm font-medium text-neutral-600">{u.email}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-1">ID: {u.uid}</div>
                      <div className="text-[10px] text-blue-600 mt-2 font-bold uppercase flex items-center gap-1">
                        {expandedUser === u.uid ? <ChevronDown size={12} /> : <ChevronRight size={12} />} View Purchases
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top border-r border-black">
                      <div className="flex flex-col gap-1 text-sm font-medium text-black">
                        <span className="flex items-center gap-1.5"><Clock size={12}/> Last Login: {formatRelativeTime(u.lastLogin)}</span>
                        <span className="flex items-center gap-1.5 text-neutral-500">Joined: {formatDate(u.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top border-r border-black">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 border ${u.status === 'banned' ? 'bg-black text-white border-black' : 'bg-white text-black border-black'} w-max`}>
                          {u.status === 'banned' ? <Ban size={12}/> : <CheckCircle size={12}/>}
                          {u.status || 'active'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 border border-black bg-neutral-200 text-black w-max">
                          Tier: {u.tier || 'free'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex flex-col items-end gap-2">
                        <select 
                          value={u.tier || 'free'} 
                          onChange={(e) => handleUpdateTier(u.uid, e.target.value as any)}
                          className="px-2 py-1 border-2 border-black text-xs font-bold uppercase bg-white text-black focus:outline-none focus:ring-0 cursor-pointer"
                        >
                          <option value="free">Free</option>
                          <option value="regular">Regular</option><option value="pro">Pro</option>
                        </select>
                        
                        {u.status === 'banned' ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(u.uid, 'active'); }}
                            className="flex items-center justify-center gap-1.5 px-3 py-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors text-xs font-bold uppercase w-full"
                          >
                            <CheckCircle size={14}/> Unban
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(u.uid, 'banned'); }}
                            className="flex items-center justify-center gap-1.5 px-3 py-1 border-2 border-black bg-black text-white hover:bg-neutral-800 transition-colors text-xs font-bold uppercase w-full"
                          >
                            <Ban size={14}/> Ban
                          </button>
                        )}
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.uid, u.email); }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1 border-2 border-red-500 text-red-600 bg-white hover:bg-red-500 hover:text-white transition-colors text-xs font-bold uppercase w-full mt-2"
                        >
                          <Trash2 size={14}/> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedUser === u.uid && (
                    <tr className="bg-neutral-50 border-b-2 border-black">
                      <td colSpan={4} className="p-4 border-l-4 border-l-blue-500">
                        <div className="font-bold uppercase text-xs tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                          <Activity size={14} /> Purchase History
                        </div>
                        {(!u.purchases || u.purchases.length === 0) ? (
                          <div className="text-sm text-neutral-600 italic bg-white p-3 border border-neutral-200 rounded-sm">No purchases found for this user.</div>
                        ) : (
                          <ul className="space-y-2">
                            {u.purchases.map((p, idx) => (
                              <li key={idx} className="bg-white border-2 border-black p-3 text-sm flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div>
                                  <span className="font-bold text-black uppercase">{p.itemName || 'Unknown Item'}</span>
                                  <div className="text-xs text-neutral-500 font-mono mt-1">TX ID: {p.txId || 'N/A'}</div>
                                </div>
                                <div className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-1 border border-black">{formatDate(p.date)}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </>
        ) : (
          <div className="border-2 border-black">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black">Email (Not Registered Yet)</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Item</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Transaction ID</th>
                  <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider border-b border-black border-l border-white/20">Date</th>
                </tr>
              </thead>
              <tbody>
                {pendingUpgrades.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-black font-bold uppercase">No pending upgrades found.</td>
                  </tr>
                ) : pendingUpgrades.map((p, i) => (
                  <tr key={p.id} className={`border-b border-black ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-100'} hover:bg-neutral-200 transition-colors`}>
                    <td className="py-4 px-4 align-top border-r border-black font-bold text-black">{p.email}</td>
                    <td className="py-4 px-4 align-top border-r border-black font-medium">{p.itemName}</td>
                    <td className="py-4 px-4 align-top border-r border-black font-mono text-sm">{p.txId}</td>
                    <td className="py-4 px-4 align-top text-sm">{formatDate(p.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
