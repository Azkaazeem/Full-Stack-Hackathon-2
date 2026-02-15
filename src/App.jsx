import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';
import Auth from './Comp/Auth';
import Complaints from './Comp/Complaints';
import Volunteer from './Comp/Volunteer';
import LostFound from './Comp/LostFound';
import Admin from './Comp/Admin'; // Admin component import kar liya

function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('lostfound');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Agar logout ho jaye ya koi aur id aaye toh wapas default tab par bhej do
      if (session?.user?.email !== 'admin@gmail.com' && activeTab === 'admin') {
        setActiveTab('lostfound');
      }
    });

    return () => subscription.unsubscribe();
  }, [activeTab]);

  const handleGlobalLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmColor: '#0057a8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      Swal.fire({
        title: 'Logged Out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // MAGIC LINE: Check agar current logged in user ADMIN hai
  const isAdmin = session?.user?.email === 'admin@gmail.com';

  return (
    <div className="min-h-screen bg-gray-50">
      {!session ? (
        <Auth />
      ) : (
        <div>
          {/* Top Navigation Bar */}
          <nav className="bg-[#0057a8] text-white p-4 shadow-md flex justify-between items-center overflow-x-auto">
            <h1 className="text-xl font-bold tracking-wider whitespace-nowrap mr-4">Saylani Mass IT Hub</h1>
            
            <div className="flex items-center space-x-4">
              <div className="space-x-1 border-r border-white/20 pr-4 flex">
                <button 
                  onClick={() => setActiveTab('lostfound')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === 'lostfound' ? 'bg-[#66b032]' : 'hover:bg-white/10'}`}
                >
                  Lost & Found
                </button>

                <button 
                  onClick={() => setActiveTab('complaints')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === 'complaints' ? 'bg-[#66b032]' : 'hover:bg-white/10'}`}
                >
                  Complaints
                </button>
                
                <button 
                  onClick={() => setActiveTab('volunteer')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === 'volunteer' ? 'bg-[#66b032]' : 'hover:bg-white/10'}`}
                >
                  Volunteer
                </button>

                {isAdmin && (
                  <button 
                    onClick={() => setActiveTab('admin')}
                    className={`ml-2 px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${activeTab === 'admin' ? 'bg-red-600 text-white shadow-inner' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                  >
                    Admin Portal
                  </button>
                )}
              </div>

              <button 
                onClick={handleGlobalLogout}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold rounded-lg transition-all active:scale-95 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </nav>

          <div className="p-4">
            {activeTab === 'lostfound' && <LostFound />}
            {activeTab === 'complaints' && <Complaints />}
            {activeTab === 'volunteer' && <Volunteer />}
            {activeTab === 'admin' && isAdmin && <Admin />} 
          </div>
        </div>
      )}
    </div>
  );
}

export default App;