const SUB_URL = "https://zyuixtcdcyobxxthrboz.supabase.co";
const SUB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWl4dGNkY3lvYnh4dGhyYm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzY3NzksImV4cCI6MjA5MDY1Mjc3OX0.4PjTGCC8UPHo-So8GrcqF-OqtQJNt3i7J6kEnd7CpNw";
const supabaseClient = supabase.createClient(SUB_URL, SUB_KEY);

async function cargarAdmin() {
    const { data, error } = await supabaseClient
        .from("platillos")
        .select("*")
        .order("id");
    
    if (error) {
        console.error("Error cargando platos:", error);
        return;
    }
    renderizarAdmin(data);
}

function renderizarAdmin(data) {
    const container = document.getElementById("admin-container");
    if (!container) return;
    container.innerHTML = "";
    data.forEach((plato) => {
        const div = document.createElement("div");
        div.className = "admin-card";
        div.innerHTML = `
            <div>
                <strong>${plato.nombre}</strong><br>
                $<input type="number" step="0.01" value="${plato.precio}" 
                    onchange="actualizarPrecio(${plato.id}, this.value)">
            </div>
            <button class="status-btn ${plato.disponibilidad ? "btn-on" : "btn-off"}" 
                onclick="toggleStock(${plato.id}, ${plato.disponibilidad})">
                ${plato.disponibilidad ? "DISPONIBLE" : "AGOTADO"}
            </button>
        `;
        container.appendChild(div);
    });
}

// --- LAS FUNCIONES MAGICAS ---

async function toggleStock(id, estadoActual) {
    const nuevoEstado = !estadoActual;
    const { error } = await supabaseClient
        .from("platillos")
        .update({ disponibilidad: nuevoEstado })
        .eq("id", id);

    if (!error) cargarAdmin(); 
}

async function actualizarPrecio(id, nuevoPrecio) {
    await supabaseClient
        .from("platillos")
        .update({ precio: parseFloat(nuevoPrecio) })
        .eq("id", id);
}

function generarQR() {
    const qrImg = document.getElementById("qr-image");
    if (!qrImg) {
        console.error("No se encontró el elemento qr-image");
        return;
    }

    // CAMBIADO: Tu URL real de Netlify
    const urlMenu = "https://menu-qe.netlify.app";

    // Construimos la URL de la API de Google
    const apiUrl = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + encodeURIComponent(urlMenu) + "&choe=UTF-8";

    // Aplicamos a la imagen
    qrImg.src = apiUrl;

    // Forzamos visibilidad
    qrImg.style.display = "block";
    qrImg.style.margin = "0 auto";
}

// UNIFICAMOS EL ARRANQUE: Ejecutar todo cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
    generarQR();
    cargarAdmin();
});
