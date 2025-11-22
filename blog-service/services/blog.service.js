import { supabase } from '../data/supabase.js';

export const obtenerTodos = async () => {
    const { data, error } = await supabase.from('posteos').select('*').order('id');
    if (error) throw error;
    return data;
};