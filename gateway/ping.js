import axios from "axios";

const urls = [
    "https://back-user-3q47.onrender.com/",
    "https://back-login-dvr8.onrender.com/",
    "https://back-gate.onrender.com/",
    "https://back-product-vv5t.onrender.com/",
    "https://back-cart-n1xz.onrender.com/",
    "https://back-blog-zxmt.onrender.com/"
];

const wakeUp = async () => {
    console.log("⏱️ Ejecutando ping a microservicios...");

    for (const url of urls) {
        try {
            await axios.get(url, { timeout: 5000 });
            console.log(`✅ Ping OK → ${url}`);
        } catch (error) {
            console.log(`❌ Ping FAIL → ${url}`);
        }
    }
};

// Ejecutar cada 5 minutos
setInterval(wakeUp, 5 * 60 * 1000);

// Ejecutar inmediatamente al iniciar
wakeUp();
