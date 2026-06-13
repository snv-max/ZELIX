process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://obkvtnutntcseqeapzci.supabase.co';
const supabaseAnonKey = 'sb_publishable_yGk55yfQV9EZBJPk0oQ0lw_LtW3HgBH';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const email = `test_qa_${Math.random().toString(36).substring(2, 9)}@example.com`;
  const password = 'TestPassword123!';
  
  console.log(`Attempting to sign up: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'QA Test User'
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
    } else {
      console.log('Signup success details:');
      console.log('User ID:', data.user ? data.user.id : 'None');
      console.log('Session returned (null means confirmation required):', data.session);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
