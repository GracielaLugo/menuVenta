document.addEventListener('DOMContentLoaded', async () => {
    const menuContainer = document.getElementById('menu-container');

    try {
        const response = await fetch('/api/menu');
        const result = await response.json();

        // Clear loading state
        menuContainer.innerHTML = '';

        if (result.data && result.data.length > 0) {
            result.data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'menu-item';

                // Format price
                const formatter = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN' // Assuming Pesos based on context
                });

                card.innerHTML = `
                    <div class="item-header">
                        <span class="item-name">${item.producto}</span>
                        <span class="item-price">${formatter.format(item.precio)}</span>
                    </div>
                    <div class="item-details">
                        <span>Disponible: ${item.cantidad}</span>
                    </div>
                `;
                menuContainer.appendChild(card);
            });
        } else {
            menuContainer.innerHTML = '<p style="text-align:center">No hay productos disponibles por el momento.</p>';
        }

    } catch (error) {
        console.error('Error fetching menu:', error);
        menuContainer.innerHTML = '<p style="text-align:center; color:red">Error al cargar el menú.</p>';
    }
});
