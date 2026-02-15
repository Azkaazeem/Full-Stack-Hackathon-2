import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

const Volunteer = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // User state add ki hai

  const [fullName, setFullName] = useState('');
  const [eventName, setEventName] = useState('');
  const [availability, setAvailability] = useState('Morning Shift');

  // Check login status and fetch data
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchVolunteers(user);
      }
    };
    checkUser();
  }, []);

  const fetchVolunteers = async (currentUser) => {
    if (!currentUser) return;

    let query = supabase.from('volunteers').select('*');

    const isAdmin = currentUser.email === 'admin@example.com';
    
    if (!isAdmin) {
      query = query.eq('user_id', currentUser.id); 
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      setVolunteers(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire('Error', 'Please login to register!', 'error');
      return;
    }

    setLoading(true);

    // Insert karte waqt user_id lazmi bhejna hai
    const { error } = await supabase
      .from('volunteers')
      .insert([
        { 
          full_name: fullName, 
          event_name: eventName, 
          availability, 
          user_id: user.id                    //problum here
        }
      ]);

    if (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#0057a8'
      });
    } else {
      Swal.fire({
        title: 'Registered!',
        text: 'You have successfully signed up.',
        icon: 'success',
        confirmButtonColor: '#66b032',
        timer: 2000
      });
      setFullName('');
      setEventName('');
      fetchVolunteers(user); // Data refresh karein
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="mb-8 border-b-2 border-[#0057a8] pb-4">
        <h2 className="text-3xl font-bold text-[#0057a8]">Volunteer Registry</h2>
        <p className="text-gray-600 mt-1">
          {user ? `Welcome, ${user.email}` : 'Please sign in to register.'}
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Full Name" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]" 
            />
            <input 
              type="text" 
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event Name (e.g., Mega IT Drive)" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]" 
            />
          </div>
          
          <select 
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] bg-white text-gray-700"
          >
            <option value="Morning Shift">Morning Shift</option>
            <option value="Evening Shift">Evening Shift</option>
            <option value="Full Day">Full Day</option>
          </select>
          
          <button 
            type="submit" 
            disabled={loading || !user}
            className="px-8 py-3 bg-[#0057a8] hover:bg-[#004484] text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Sign Up as Volunteer'}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {user?.email === 'admin@example.com' ? 'All Registered Volunteers (Admin View)' : 'Your Registrations'}
      </h3>
      
      {volunteers.length === 0 ? (
        <p className="text-gray-500 italic">No registrations found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b-2 bg-gray-50 border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-800">Name</th>
                <th className="px-6 py-4 font-bold text-gray-800">Event</th>
                <th className="px-6 py-4 font-bold text-gray-800">Availability</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol, index) => (
                <tr key={vol.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-gray-900">{vol.full_name}</td>
                  <td className="px-6 py-4 text-gray-700">{vol.event_name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#66b032]/10 text-[#559429] px-2 py-1 rounded font-semibold">
                      {vol.availability}
                    </span>
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

export default Volunteer;