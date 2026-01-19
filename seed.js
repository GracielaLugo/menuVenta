require('dotenv').config();
const supabase = require('./supabase');

const products = [
    {
        producto: 'Café Americano',
        cantidad: 50,
        precio: 35.00,
        foto: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'
    },
    {
        producto: 'Cappuccino',
        cantidad: 40,
        precio: 45.00,
        foto: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80'
    },
    {
        producto: 'Croissant',
        cantidad: 20,
        precio: 25.00,
        foto: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&w=600&q=80'
    },
    {
        producto: 'Sandwich de Pollo',
        cantidad: 15,
        precio: 65.00,
        foto: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80'
    },
    {
        producto: 'Jugo de Naranja',
        cantidad: 30,
        precio: 40.00,
        foto: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80'
    }
];

async function seed() {
    console.log('🌱 Seeding database with photos...');

    // We will loop and upsert based on name matching or just insert new ones.
    // Simplifying to just insert for now.

    // First, let's try to empty the table to avoid duplicates for this demo
    // WARNING: This deletes everything!
    const { error: deleteError } = await supabase.from('menu_items').delete().neq('id', 0);
    if (deleteError) console.error("Error clearing table:", deleteError);

    const { data, error } = await supabase
        .from('menu_items')
        .insert(products)
        .select();

    if (error) {
        console.error('❌ Error seeding data:', error);
    } else {
        console.log('✅ Products with photos added successfully!');
        console.table(data);
    }
}

seed();
