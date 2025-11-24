import { createClient } from '@supabase/supabase-js';

// LEER LAS VARIABLES DE ENTORNO (Inyectadas por Render)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);