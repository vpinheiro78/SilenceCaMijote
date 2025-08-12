let recipes = [];
async function fetchRecipes() {
    const res = await fetch('data/recipes.json');
    recipes = await res.json();
    displayRecipes(recipes);
}
function displayRecipes(list) {
    const container = document.getElementById('recipeContainer');
    container.innerHTML = '';
    list.forEach(r => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.innerHTML = `
            <img src="${r.image}" alt="${r.nom}">
            <h3>${r.nom}</h3>
            <p>${r.presentation}</p>
        `;
        container.appendChild(card);
    });
}
function filterCategory(cat) {
    displayRecipes(recipes.filter(r => r.categorie === cat));
}
document.getElementById('searchInput').addEventListener('input', e => {
    const val = e.target.value.toLowerCase();
    displayRecipes(recipes.filter(r => r.nom.toLowerCase().includes(val) || r.presentation.toLowerCase().includes(val)));
});
fetchRecipes();

async function loadRecettes() {
    const { data, error } = await supabase
        .from("recettes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erreur chargement recettes:", error);
        return;
    }

    afficherRecettes(data);
}