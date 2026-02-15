import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

const Admin = () => {
  const [complaints, setComplaints] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState('complaints');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    // Fetch All Complaints
    const { data: compData } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    if (compData) setComplaints(compData);

    // Fetch All Lost & Found
    const { data: lostData } = await supabase.from('lost_found_items').select('*').order('created_at', { ascending: false });
    if (lostData) setLostItems(lostData);

    // Fetch All Volunteers
    const { data: volData } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
    if (volData) setVolunteers(volData);
  };

  // --- UPDATE STATUS FUNCTION ---
  const updateStatus = async (table, id, newStatus) => {
    const { error } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      Swal.fire('Error', error.message, 'error');
    } else {
      Swal.fire('Updated!', `Status changed to ${newStatus}`, 'success');
      fetchAllData(); // Refresh Data
    }
  };

  // --- DELETE/BAN RECORD FUNCTION ---
  const handleDelete = async (table, id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete this record. (Auth users are soft-deleted/blocked)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        Swal.fire('Error', error.message, 'error');
      } else {
        Swal.fire('Deleted!', 'Record has been removed from public view.', 'success');
        fetchAllData();
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans animate-fade-in">
      <div className="mb-6 border-b-2 border-red-600 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-red-600">Admin Control Panel</h2>
          <p className="text-gray-600 mt-1">Manage all portal data, update statuses, and moderate users.</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex space-x-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
        <button onClick={() => setActiveTab('complaints')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'complaints' ? 'bg-red-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Manage Complaints</button>
        <button onClick={() => setActiveTab('lost')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'lost' ? 'bg-red-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Manage Lost & Found</button>
        <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-md font-bold transition ${activeTab === 'users' ? 'bg-red-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Manage Volunteers & Users</button>
      </div>

      {/* Tab 1: Complaints Management */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4">User Email</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="px-6 py-4">{c.user_email}</td>
                  <td className="px-6 py-4 font-bold text-[#0057a8]">{c.category}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{c.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <select 
                      onChange={(e) => updateStatus('complaints', c.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-red-500"
                      value={c.status}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button onClick={() => handleDelete('complaints', c.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Lost & Found Management */}
      {activeTab === 'lost' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lostItems.map(item => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold text-white ${item.type === 'Lost' ? 'bg-red-500' : 'bg-[#66b032]'}`}>{item.type}</span></td>
                  <td className="px-6 py-4 font-bold">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Found/Returned' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <select 
                      onChange={(e) => updateStatus('lost_found_items', item.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 outline-none"
                      value={item.status}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Found/Returned">Found / Returned</option>
                    </select>
                    <button onClick={() => handleDelete('lost_found_items', item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Volunteer & Users View */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4">Volunteer Name</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(v => (
                <tr key={v.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-bold">{v.full_name}</td>
                  <td className="px-6 py-4">{v.event_name}</td>
                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{v.availability}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete('volunteers', v.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default Admin;