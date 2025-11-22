import { supabase } from '../data/supabase.js';

const getCartFromDB = async (userId) => {
    const { data } = await supabase.from('carritos').select('items').eq('user_id', userId).single();
    return data ? data.items : [];
};

const saveCartToDB = async (userId, items) => {
    const { error } = await supabase.from('carritos').upsert({ user_id: userId, items: items }, { onConflict: 'user_id' });
    if (error) throw new Error('Error guardando carrito');
    return items;
};

export const obtenerCarrito = async (userId) => {
    return await getCartFromDB(userId);
};

export const agregarItem = async (userId, producto) => {
    const carrito = await getCartFromDB(userId);
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) { existe.quantity += 1; }
    else { carrito.push({ ...producto, quantity: 1 }); }
    return await saveCartToDB(userId, carrito);
};

export const eliminarItem = async (userId, productoId) => {
    let carrito = await getCartFromDB(userId);
    carrito = carrito.filter(item => item.id !== parseInt(productoId));
    return await saveCartToDB(userId, carrito);
};

export const vaciarCarrito = async (userId) => {
    return await saveCartToDB(userId, []);
};