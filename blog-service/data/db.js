// Base de datos en memoria para el blog.
// Como es un servicio nuevo, definimos el "contrato" en español.
const posteos = [
    {
        id: 1,
        tipo: 'novedad',
        titulo: 'Novedades de la tienda',
        texto: 'El SSD M.2 980 PRO de Samsung ofrece un rendimiento excepcional para gamers y profesionales. Puede alcanzar hasta velocidades de lectura hasta 7.000 MB/s y ofrece un almacenamiento de 2TB.',
        urlImagen: 'https://bestmart.cl/cdn/shop/files/tarjeta-ssd-samsung-500gb-980-pro-pcie-40-x4-m2-9509012_800x.jpg?v=1758551364',
        altImagen: 'SSD M.2 980 PRO'
    },
    {
        id: 2,
        tipo: 'dato',
        titulo: 'Datos curiosos',
        texto: 'El Glorious Model O Inalámbrico puede alcanzar hasta 25.000 DPI y una carga de batería al 100% puede durar aproximadamente 71 horas con el RGB apagado.',
        urlImagen: 'https://hardwaremarket.net/wp-content/uploads/2021/03/1_white.jpg',
        altImagen: 'Mouse Glorious Model 0'
    },
    {
        id: 3,
        tipo: 'dato',
        titulo: null, // Sin título, es una continuación
        texto: 'El teclado HyperX Alloy Core RGB puede resistir hasta 120 ml de líquido, lo cual lo hace muy resistente.',
        urlImagen: 'https://media.spdigital.cl/thumbnails/products/rv969_qx_0c03c07b_thumbnail_4096.jpg',
        altImagen: 'Teclado HyperX Alloy Core RGB'
    }
];

export default posteos;