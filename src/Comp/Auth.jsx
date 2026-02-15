import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {/* Hackathon Speed: Custom animations injected directly */}
      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 font-sans">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[40%] w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl transition-all duration-500">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-300 mt-2 text-sm">
              {isLogin ? 'Enter your details to access your account' : 'Join us and start your journey'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Name Input (Only for Signup) */}
            <div className={`transition-all duration-500 overflow-hidden ${isLogin ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
              <div className="relative group">
                <input
                  type="text"
                  required={!isLogin}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition-all shadow-inner"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition-all shadow-inner"
                placeholder="Email Address"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type="password"
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition-all shadow-inner"
                placeholder="Password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] transform transition-all active:scale-95"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-pink-400 font-bold hover:text-pink-300 hover:underline transition-all"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Auth;