import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [category, setCategory] = useState('Internet Issue');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setComplaints(data);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('complaints')
      .insert([{ 
        category, 
        description, 
        status: 'Submitted',
        user_email: user.email
      }]);

    if (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#0057a8'
      });
    } else {
      Swal.fire({
        title: 'Submitted!',
        text: 'Your complaint has been registered successfully.',
        icon: 'success',
        confirmButtonColor: '#66b032',
        timer: 2000
      });
      setDescription('');
      fetchComplaints();
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="mb-8 border-b-2 border-[#0057a8] pb-4">
        <h2 className="text-3xl font-bold text-[#0057a8]">Complaints</h2>
        <p className="text-gray-600 mt-1">Submit campus-related issues (Internet, Water, Maintenance, etc.)</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] bg-white text-gray-700"
          >
            <option value="Internet Issue">Internet / Wi-Fi Issue</option>
            <option value="Electricity">Electricity / Power</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Maintenance">General Maintenance</option>
          </select>
          
          <textarea 
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe your issue in detail..." 
            rows="4" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] resize-none"
          ></textarea>
          
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-[#66b032] hover:bg-[#559429] text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Register Complaint'}
          </button>
        </form>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">Your Recent Complaints</h3>
      
      {complaints.length === 0 ? (
        <p className="text-gray-500 italic">No complaints registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((comp) => (
            <div key={comp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-2 bg-gray-800 text-white font-bold text-sm flex justify-between items-center">
                <span>{comp.category}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${comp.status === 'Resolved' ? 'bg-[#66b032]' : 'bg-yellow-500 text-black'}`}>
                  {comp.status}
                </span>
              </div>
              <div className="p-4 flex-1">
                <p className="text-gray-700 text-sm">{comp.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaints;