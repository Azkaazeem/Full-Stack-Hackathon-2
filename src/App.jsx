import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Comp/Auth';
import Complaints from './Comp/Complaints';
import Volunteer from './Comp/Volunteer';
// import LostFound from './Comp/LostFound'; // Agar ye bana liya hai toh isko bhi uncomment kar lein

function App() {
  const [session, setSession] = useState(null);
  
  // Yeh state batayegi ke kon sa page dikhana hai (Default: Complaints)
  const [activeTab, setActiveTab] = useState('complaints');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Agar login nahi hai toh sirf Auth page dikhao */}
      {!session ? (
        <Auth />
      ) : (
        /* Agar login hai toh Navigation aur Pages dikhao */
        <div>
          {/* Top Navigation Bar (Saylani Theme) */}
          <nav className="bg-[#0057a8] text-white p-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wider">Saylani Mass IT Hub</h1>
            
            <div className="space-x-2">
              <button 
                onClick={() => setActiveTab('complaints')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'complaints' ? 'bg-[#66b032]' : 'hover:bg-white/10'}`}
              >
                Complaints
              </button>
              
              <button 
                onClick={() => setActiveTab('volunteer')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'volunteer' ? 'bg-[#66b032]' : 'hover:bg-white/10'}`}
              >
                Volunteer
              </button>

              {/* Agar LostFound page hai toh is button ko uncomment karein */}
              {/* <button 
                onClick={() => setActiveTab('lostfound')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'lostfound' ? 'bg-[#66b032]' : 'hover:bg-white/10'}`}
              >
                Lost & Found
              </button> */}
            </div>
          </nav>

          {/* Active Tab ke hisaab se Page render karein */}
          <div className="p-4">
            {activeTab === 'complaints' && <Complaints />}
            {activeTab === 'volunteer' && <Volunteer />}
            {/* {activeTab === 'lostfound' && <LostFound />} */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;