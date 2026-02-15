import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Comp/Auth';
import Dashboard from './Comp/Dashboard'; // Yeh woh dashboard hai jo humne pehle banaya tha

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Current session check karein
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Jab user login/logout kare toh state update karein
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      {/* Agar session nahi hai toh Login page, warna Dashboard */}
      {!session ? <Auth /> : <Dashboard />}
    </div>
  );
}

export default App;