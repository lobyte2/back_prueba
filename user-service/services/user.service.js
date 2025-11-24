import { supabase } from '../data/supabase.js';

export const obtenerTodos = async () => {
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) throw error;
    return data;
};

export const crear = async (datos) => {
    const { data: existente } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', datos.email)
        .single();

    if (existente) throw new Error('El correo ya existe');

    const { error } = await supabase.from('usuarios').insert([{
        email: datos.email,
        password: datos.password,
        fullName: datos.fullName || 'Nuevo Usuario',
        phone: datos.phone || 'N/A',
        region: datos.region || 'N/A',
        role: datos.role || 'user'
    }]);

    if (error) throw new Error(error.message);

    return await obtenerTodos();
};

export const eliminarPorId = async (usuarioId) => {
    const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', usuarioId);

    if (error) throw new Error(error.message);

    return await obtenerTodos();
};
