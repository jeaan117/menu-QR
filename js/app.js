
    const SUB_URL = "https://zyuixtcdcyobxxthrboz.supabase.co";
    const SUB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWl4dGNkY3lvYnh4dGhyYm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzY3NzksImV4cCI6MjA5MDY1Mjc3OX0.4PjTGCC8UPHo-So8GrcqF-OqtQJNt3i7J6kEnd7CpNw";

    // Inicializamos el cliente oficial para Realtime
    const supabaseClient = supabase.createClient(SUB_URL, SUB_KEY);
    const contenedor = document.getElementById('menu-digital');

    async function cargarMenu() {
        try {
            const { data, error } = await supabaseClient
                .from('platillos')
                .select('*')
                .order('disponibilidad', { ascending: false });

            if (error) throw error;
            renderizarMenu(data);
        } catch (error) {
            console.error("Error:", error);
            contenedor.innerHTML = "<p>Error al conectar con la base de datos.</p>";
        }
    }

    function renderizarMenu(data) {
        contenedor.innerHTML = ""; 
        
        data.forEach(plato => {
            const card = document.createElement('div');
            
            // CAMBIO CLAVE: Forzamos la evaluación a booleano real
            // Esto acepta true, "true", 1 o "1" como disponible.
            const estaDisponible = String(plato.disponibilidad) === 'true' || plato.disponibilidad === 1 || plato.disponibilidad === true;

            // Aplicamos la clase basándonos en la evaluación forzada
            card.className = "card " + (estaDisponible ? "" : "out-of-stock");

            card.innerHTML = `
                <div class="info">
                    <h3>${plato.nombre}</h3>
                    <p>${plato.desc}</p>
                </div>
                <div class="price">$${parseFloat(plato.precio).toFixed(2)}</div>
            `;
            
            contenedor.appendChild(card);
        });
    }

    // SUSCRIPCIÓN EN TIEMPO REAL
    // Cada vez que cambies algo en Supabase, la página se actualiza sola
    supabaseClient
        .channel('cambios-menu')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'platillos' }, (payload) => {
            console.log('Cambio detectado en la base de datos');
            cargarMenu(); // Recarga los datos automáticamente
        })
        .subscribe();

    // Carga inicial
    cargarMenu();
