require('dotenv').config();
const supabase = require('./supabase');

const products = [
    { producto: 'Café Americano', cantidad: 50, precio: 3.50 },
    { producto: 'Cappuccino', cantidad: 40, precio: 4.50 },
    { producto: 'Croissant de Mantequilla', cantidad: 20, precio: 2.50 },
    { producto: 'Sandwich de Pollo', cantidad: 15, precio: 6.50 },
    { producto: 'Jugo de Naranja Natural', cantidad: 30, precio: 4.00 }
];

async function seed() {
    console.log('🌱 Seeding database...');

    // Optional: Clear existing items to avoid duplicates if run multiple times
    // await supabase.from('menu_items').delete().neq('id', 0); 

    const { data, error } = await supabase
        .from('menu_items')
        .insert(products)
        .select();

    if (error) {
        console.error('❌ Error seeding data:', error);
    } else {
        console.log('✅ 5 Products added successfully:');
        console.table(data);
    }
}

seed();
