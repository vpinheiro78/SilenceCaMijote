// Import Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 📌 Infos Supabase
const supabaseUrl = 'https://ttkgzzamsfnittbqqvft.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2d6emFtc2ZuaXR0YnFxdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjg4MTEsImV4cCI6MjA3MDQwNDgxMX0.aE5GxrKrNJoqr1g8ASVG9Vdf7k_OLuyCOe2vZAp0-wY'
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
  <a href="recette/recette.html?id=${r.id}" class="recipe-card">
    <img src="${r.photo_url}" alt="Photo de ${r.titre}" class="recipe-img"/>
    <h2>${r.titre}</h2>
    <p>${r.description || ''}</p>
  </a>
`).join('')
}

// Fonction de filtrage
function filterRecipes() {
  let filtered = allRecipes

  // Filtre catégorie
  if (currentCategory !== 'all') {
    filtered = filtered.filter(r => {
      const catBase = (r.categorie || '').toLowerCase().trim()
      const catButton = currentCategory.toLowerCase().trim()
      return catBase.startsWith(catButton) // tolère pluriels (ex: "desserts")
    })
  }

  // Recherche texte

if (currentSearch.trim() !== '') {
  const searchLower = currentSearch.toLowerCase()
  filtered = filtered.filter(r =>
    (r.titre && r.titre.toLowerCase().includes(searchLower)) ||
    (r.description && r.description.toLowerCase().includes(searchLower)) ||
    (r.categorie && r.categorie.toLowerCase().includes(searchLower)) ||
    (r.ingredients && Array.isArray(r.ingredients) && r.ingredients.join(', ').toLowerCase().includes(searchLower)) ||
    (r.ingredients && typeof r.ingredients === 'string' && r.ingredients.toLowerCase().includes(searchLower))
  )
}
  displayRecipes(filtered)
}

// Chargement depuis Supabase
async function loadRecipes() {
  const { data, error } = await supabase
    .from('recettes') // 📌 nom exact de ta table
    .select('id, titre, description, categorie, photo_url,ingredients,lien_youtube')
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
