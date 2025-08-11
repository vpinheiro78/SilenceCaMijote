const SUPABASE_URL = 'https://ttkgzzamsfnittbqqvft.supabase.com';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2d6emFtc2ZuaXR0YnFxdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjg4MTEsImV4cCI6MjA3MDQwNDgxMX0.aE5GxrKrNJoqr1g8ASVG9Vdf7k_OLuyCOe2vZAp0-wY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadRecipes() {
    const { data, error } = await supabaseClient.from('recipes').select('*');
    if (error) {
        console.error('Erreur chargement recettes:', error);
        return;
    }
    const list = document.getElementById('recipe-list');
    list.innerHTML = '';
    data.forEach(recipe => {
        const div = document.createElement('div');
        div.classList.add('recipe');
        div.innerHTML = \`
            <img src="\${recipe.image_url}" alt="\${recipe.title}">
            <h2>\${recipe.title}</h2>
            <p>\${recipe.content}</p>
        \`;
        list.appendChild(div);
    });
}

loadRecipes();
