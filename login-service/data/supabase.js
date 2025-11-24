import { createClient } from '@supabase/supabase-js';

// Ahora leemos desde las variables de entorno de Render
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);