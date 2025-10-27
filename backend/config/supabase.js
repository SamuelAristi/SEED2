const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://raehwuosfeaofhvlvybq.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZWh3dW9zZmVhb2Zodmx2eWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDk3MDMsImV4cCI6MjA3NTE4NTcwM30.XmlhpppCuUA9yzRSRu1afo3l5gogsCkxhIag1sRRdOk';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
