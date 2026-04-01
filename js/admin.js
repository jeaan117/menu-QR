const SUB_URL = "https://zyuixtcdcyobxxthrboz.supabase.co";
        const SUB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dWl4dGNkY3lvYnh4dGhyYm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzY3NzksImV4cCI6MjA5MDY1Mjc3OX0.4PjTGCC8UPHo-So8GrcqF-OqtQJNt3i7J6kEnd7CpNw"; 
        const supabaseClient = supabase.createClient(SUB_URL, SUB_KEY);

        async function cargarAdmin() {
            const { data } = await supabaseClient.from('platillos').select('*').order('id');
            renderizarAdmin(data);
        }

        function renderizarAdmin(data) {
            const container = document.getElementById('admin-container');
            container.innerHTML = "";
            data.forEach(plato => {
                const div = document.createElement('div');
                div.className = "admin-card";
                div.innerHTML = `
                    <div>
                        <strong>${plato.nombre}</strong><br>
                        $<input type="number" value="${plato.precio}" 
                            onchange="actualizarPrecio(${plato.id}, this.value)">
                    </div>
                    <button class="status-btn ${plato.disponibilidad ? 'btn-on' : 'btn-off'}" 
                        onclick="toggleStock(${plato.id}, ${plato.disponibilidad})">
                        ${plato.disponibilidad ? 'DISPONIBLE' : 'AGOTADO'}
                    </button>
                `;
                container.appendChild(div);
            });
        }

        // --- LAS FUNCIONES MAGICAS ---

        async function toggleStock(id, estadoActual) {
            const nuevoEstado = !estadoActual;
            const { error } = await supabaseClient
                .from('platillos')
                .update({ disponibilidad: nuevoEstado })
                .eq('id', id);
            
            if (!error) cargarAdmin(); // Refresca el panel
        }

        async function actualizarPrecio(id, nuevoPrecio) {
            await supabaseClient
                .from('platillos')
                .update({ precio: nuevoPrecio })
                .eq('id', id);
        }

        window.onload = cargarAdmin;