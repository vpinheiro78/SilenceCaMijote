const SUPABASE_URL = 'https://ttkgzzamsfnittbqqvft.supabase.com';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2d6emFtc2ZuaXR0YnFxdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjg4MTEsImV4cCI6MjA3MDQwNDgxMX0.aE5GxrKrNJoqr1g8ASVG9Vdf7k_OLuyCOe2vZAp0-wY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('recipe-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const image_url = document.getElementById('image_url').value;

    const { data, error } = await supabaseClient.from('recipes').insert([{ title, content, image_url }]);
    if (error) {
        console.error('Erreur ajout recette:', error);
    } else {
        alert('Recette ajoutée avec succès !');
        e.target.reset();
    }
});
