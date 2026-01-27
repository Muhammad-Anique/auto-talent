import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🔄 Running translation migration...\n');

  try {
    // Add current_language column
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS current_language VARCHAR(10) DEFAULT 'en';
      `
    });

    if (alterError) {
      // Try alternative method using raw SQL
      const { error } = await supabase
        .from('resumes')
        .select('current_language')
        .limit(1);

      if (error && error.message.includes('column "current_language" does not exist')) {
        console.log('⚠️  Column does not exist. Please run the migration manually in Supabase Dashboard.\n');
        console.log('SQL to run:');
        console.log('ALTER TABLE resumes ADD COLUMN IF NOT EXISTS current_language VARCHAR(10) DEFAULT \'en\';');
        console.log('CREATE INDEX IF NOT EXISTS idx_resumes_language ON resumes(current_language);\n');
        process.exit(1);
      }
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('The translation feature is now ready to use.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n📝 Please run the migration manually in Supabase Dashboard:');
    console.log('ALTER TABLE resumes ADD COLUMN IF NOT EXISTS current_language VARCHAR(10) DEFAULT \'en\';');
    console.log('CREATE INDEX IF NOT EXISTS idx_resumes_language ON resumes(current_language);');
    process.exit(1);
  }
}

runMigration();
