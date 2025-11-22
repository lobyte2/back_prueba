import { supabase } from '../data/supabase.js';

export const obtenerTodos = async () => {
    const { data, error } = await supabase.from('productos').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data;
};

export const obtenerPorId = async (id) => {
    const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
    if (error) return null;
    return data;
};

export const crear = async (datosProducto) => {
    const { id, ...restoDatos } = datosProducto; // Quitamos ID para que la DB lo genere
    const { data, error } = await supabase.from('productos').insert([restoDatos]).select().single();
    if (error) throw error;
    return data;
};

export const actualizar = async (id, datosActualizados) => {
    const { data, error } = await supabase.from('productos').update(datosActualizados).eq('id', id).select().single();
    if (error) return null;
    return data;
};

export const eliminar = async (id) => {
    const { data, error } = await supabase.from('productos').delete().eq('id', id).select().single();
    if (error) return null;
    return data;
};