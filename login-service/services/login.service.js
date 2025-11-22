import { supabase } from '../data/supabase.js';

export const autenticar = async ({ email, password }) => {
    const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

    if (error || !usuario) {
        throw new Error('Credenciales inválidas');
    }
    return { id: usuario.id, email: usuario.email, role: usuario.role };
};

export const registrar = async (datosUsuario) => {
    const { data: existente } = await supabase.from('usuarios').select('id').eq('email', datosUsuario.email).single();
    if (existente) throw new Error('El correo ya está registrado');

    const { data: nuevoUsuario, error } = await supabase.from('usuarios').insert([{
        email: datosUsuario.email,
        password: datosUsuario.password,
        fullName: datosUsuario.fullName,
        phone: datosUsuario.phone,
        region: datosUsuario.region,
        role: 'user'
    }])
        .select().single();

    if (error) throw new Error(error.message);
    return { id: nuevoUsuario.id, email: nuevoUsuario.email, role: nuevoUsuario.role };
};