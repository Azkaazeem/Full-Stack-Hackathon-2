import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Success SweetAlert for Login
        Swal.fire({
          title: 'Success!',
          text: 'Login Successful! Welcome to the portal.',
          icon: 'success',
          confirmButtonColor: '#66b032', // Saylani Green
          timer: 1500,
          showConfirmButton: false
        });
        
      } else {
        // --- SIGNUP LOGIC ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        
        // Success SweetAlert for Signup
        Swal.fire({
          title: 'Account Created!',
          text: 'Your account has been registered successfully.',
          icon: 'success',
          confirmButtonColor: '#66b032' // Saylani Green
        });
      }
    } catch (error) {
      // Error SweetAlert
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#0057a8' // Saylani Blue
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-sm animate-fade-in">
        
        {/* Header - Saylani Portal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0057a8] mb-2 tracking-tight">Saylani Mass IT Hub</h1>
          <h2 className="text-lg text-gray-600">
            {isLogin ? 'Login to your account' : 'Register a new account'}
          </h2>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          
          {/* Name Input (Only for Signup) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
              placeholder="name@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button (Saylani Green) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-[#66b032] hover:bg-[#559429] text-white font-bold rounded-lg shadow-sm transform transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {/* Toggle Section */}
        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-[#0057a8] font-semibold hover:underline transition-all"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Auth;