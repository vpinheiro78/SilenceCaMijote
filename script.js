// Import Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 📌 À remplacer par tes infos Supabase
const supabaseUrl = 'https://TON-PROJET.supabase.co'
const supabaseKey = 'TA_CLE_PUBLIQUE_ANONYME'
const supabase = createClient(supabaseUrl, supabaseKey)

// Sélecteurs HTML
const recipesContainer = document.getElementById('recipes')
const searchInput = document.getElementById('search')
const categoryButtons = document.querySelectorAll('.cat-btn')

let allRecipes = []
let currentCategory = 'all'
let currentSearch = ''

// Fonction d'affichage
function displayRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    recipesContainer.innerHTML = `<p>Aucune recette trouvée.</p>`
    return
  }

  recipesContainer.innerHTML = recipes.map(r => `
    <article class="recipe-card">
      <img src="${r.photo_url}" alt="Photo de ${r.title}" class="recipe-img"/>
      <h2>${r.title}</h2>
      <p>${r.description}</p>
    </article>
  `).join('')
}

// Fonction de filtrage
function filterRecipes() {
  let filtered = allRecipes

  if (currentCategory !== 'all') {
    filtered = filtered.filter(r => r.category && r.category.toLowerCase() === currentCategory.toLowerCase())
  }

  if (currentSearch.trim() !== '') {
    const searchLower = currentSearch.toLowerCase()
    filtered = filtered.filter(r =>
      (r.title && r.title.toLowerCase().includes(searchLower)) ||
      (r.description && r.description.toLowerCase().includes(searchLower))
    )
  }

  displayRecipes(filtered)
}

// Chargement depuis Supabase
async function loadRecipes() {
  const { data, error } = await supabase
    .from('recipes') // 📌 nom exact de ta table
    .select('id, title, description, photo_url, category')
    .order('id', { ascending: false })

  if (error) {
    console.error('Erreur chargement recettes:', error)
    recipesContainer.innerHTML = `<p>Erreur de chargement des recettes.</p>`
    return
  }

  allRecipes = data
  filterRecipes()
}

// Gestion des événements
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value
  filterRecipes()
})

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.cat
    categoryButtons.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    filterRecipes()
  })
})

// Lancement
loadRecipes()
