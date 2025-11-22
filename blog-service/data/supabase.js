import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xutbwdgffsgbdayxsxgw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dGJ3ZGdmZnNnYmRheXhzeGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDQ5NTEsImV4cCI6MjA3OTMyMDk1MX0.V-FQ5df2iQgJB00SMqYwk8KlGQ5Rzu11LbhQPkctdoc';

export const supabase = createClient(supabaseUrl, supabaseKey);