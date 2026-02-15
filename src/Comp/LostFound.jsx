import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Lost');
  const [imageFile, setImageFile] = useState(null); // Image ke liye naya state

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('lost_found_items')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setItems(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;

    try {
      // 1. Agar user ne image select ki hai, toh pehle usay Storage mein upload karein
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; // Unique naam banaya

        const { error: uploadError } = await supabase.storage
          .from('images') // Aapke bucket ka naam
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Upload hone ke baad image ka Public URL hasil karein
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
          
        imageUrl = urlData.publicUrl;
      }

      // 2. Ab database mein post ki baqi details aur image ka URL save karein
      const { error: dbError } = await supabase
        .from('lost_found_items')
        .insert([{ 
          title, 
          description, 
          type, 
          status: 'Pending',
          image_url: imageUrl // Naya column
        }]);

      if (dbError) throw dbError;

      Swal.fire({
        title: 'Posted!',
        text: 'Your item has been posted successfully.',
        icon: 'success',
        confirmButtonColor: '#66b032',
        timer: 2000
      });
      
      // Form clear karein
      setTitle('');
      setDescription('');
      setImageFile(null);
      document.getElementById('imageInput').value = ''; // File input ko clear karne ke liye
      fetchItems();

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#0057a8'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans animate-fade-in">
      <div className="mb-8 border-b-2 border-[#0057a8] pb-4">
        <h2 className="text-3xl font-bold text-[#0057a8]">Lost & Found</h2>
        <p className="text-gray-600 mt-1">Report lost items or post items you have found on campus.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-10">
        <h3 className="text-lg font-bold text-[#66b032] mb-4">Post a New Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item Title (e.g., Blue Wallet)" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032]" 
            />
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] bg-white text-gray-700"
            >
              <option value="Lost">I Lost Something</option>
              <option value="Found">I Found Something</option>
            </select>
          </div>
          
          <textarea 
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the item..." 
            rows="3" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b032] resize-none"
          ></textarea>

          {/* IMAGE UPLOAD INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
            <input 
              id="imageInput"
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0057a8] hover:file:bg-blue-100 transition-colors border border-gray-300 rounded-lg"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-[#0057a8] hover:bg-[#004484] text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Uploading & Posting...' : 'Submit Post'}
          </button>
        </form>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Posts</h3>
      
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No items posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              
              {/* Image Preview Area */}
              {item.image_url ? (
                <div className="w-full h-48 bg-gray-100">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              <div className={`px-4 py-2 text-white font-bold text-sm flex justify-between items-center ${item.type === 'Lost' ? 'bg-red-500' : 'bg-[#66b032]'}`}>
                <span>{item.type}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{item.status}</span>
              </div>
              
              <div className="p-4 flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFound;