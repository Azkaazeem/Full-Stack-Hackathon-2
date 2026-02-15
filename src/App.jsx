import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Comp/Auth';
import Complaints from './Comp/Complaints'; // Dashboard ki jagah Complaints import karein

function App() {
  const [session, setSession] = useState(null);

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
    <div>
      {/* Agar login nahi hai toh Auth, warna seedha Complaints page */}
      {!session ? <Auth /> : <Complaints />}
    </div>
  );
}

export default App;