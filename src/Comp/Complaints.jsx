const fetchComplaints = async () => {
    // 1. Pehle current logged-in user maloom karein
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 2. Sirf us user ki complaints database se mangwayen (.eq ka matlab 'equal')
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_email', user.email) // Yeh line magic karegi!
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setComplaints(data);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Current user maloom karein
    const { data: { user } } = await supabase.auth.getUser();

    // Data mein user ka email bhi sath bhej dein
    const { error } = await supabase
      .from('complaints')
      .insert([{ 
        category, 
        description, 
        status: 'Submitted',
        user_email: user.email // Yahan user ka email save ho jayega
      }]);

    if (error) {
      alert('Error submitting complaint: ' + error.message);
    } else {
      alert('Complaint registered successfully!');
      setDescription('');
      fetchComplaints();
    }
    setLoading(false);
  };