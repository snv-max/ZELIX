process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://obkvtnutntcseqeapzci.supabase.co';
const supabaseAnonKey = 'sb_publishable_yGk55yfQV9EZBJPk0oQ0lw_LtW3HgBH';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email, role, full_name')
      .limit(10);

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      console.log('Profiles in DB:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
