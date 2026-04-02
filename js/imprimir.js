// Función para generar el QR automáticamente basado en la URL de Netlify
function generarQR() {
    const qrImg = document.getElementById('qr-image');
    
    // CAMBIO IMPORTANTE: Usamos tu URL real de Netlify
    const urlMenu = "https://menu-qe.netlify.app/";
    
    // Usamos la API de Google Charts para generar el QR
    qrImg.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(urlMenu)}&choe=UTF-8`;
    
    // Aseguramos que la imagen sea visible
    qrImg.style.display = 'block';
}

// Función para imprimir solo el código QR sin el resto del panel
function imprimirQR() {
    const qrSrc = document.getElementById('qr-image').src;
    
    // Validamos que el QR exista antes de intentar imprimir
    if (!qrSrc || qrSrc.includes('undefined')) {
        alert("El código QR aún no se ha generado.");
        return;
    }

    const ventanaImpresion = window.open('', '_blank');
    
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Imprimir QR - Marea Manaba</title>
                <style>
                    body { text-align: center; font-family: sans-serif; padding-top: 50px; }
                    img { width: 400px; border: 1px solid #eee; padding: 10px; }
                    h1 { color: #2d3436; margin-bottom: 5px; }
                    p { color: #636e72; font-size: 1.2rem; }
                </style>
            </head>
            <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
                <h1>Escanea para ver el Menú</h1>
                <img src="${qrSrc}">
                <p><strong>Marea Manaba</strong><br>Sabor Real de nuestra costa</p>
            </body>
        </html>
    `);
    ventanaImpresion.document.close();
}

// Llama a generarQR al cargar la página
window.addEventListener('load', () => {
    if (typeof generarQR === 'function') {
        generarQR();
    }
});
