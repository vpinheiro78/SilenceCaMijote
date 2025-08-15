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
// Fonction d'affichage
function displayRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    recipesContainer.innerHTML = `<p>Aucune recette trouvée.</p>`
    return
  }

  recipesContainer.innerHTML = recipes.map(r => `
    <a href="recette/recette.html?id=${r.id}" class="recipe-card">
      <div class="recipe-img-wrapper">
        <img src="${r.photo_url}" alt="Photo de ${r.titre}" class="recipe-img"/>
        ${r.lien_youtube ? `
          <div class="video-badge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20">
              <path d="M23.498 6.186a2.98 2.98 0 0 0-2.094-2.112C19.34 3.5 12 3.5 12 3.5s-7.34 0-9.404.574A2.98 2.98 0 0 0 .502 6.186C0 8.26 0 12 0 12s0 3.74.502 5.814a2.98 2.98 0 0 0 2.094 2.112C4.66 20.5 12 20.5 12 20.5s7.34 0 9.404-.574a2.98 2.98 0 0 0 2.094-2.112C24 15.74 24 12 24 12s0-3.74-.502-5.814ZM9.75 15.5v-7l6 3.5-6 3.5Z"/>
            </svg>
          </div>
        ` : ''}
      </div>
      <h2>${r.titre}</h2>
      <p>${r.description || ''}</p>
      ${r.note_moyenne ? `<div class="rating">${generateStars(r.note_moyenne)}</div>` : ''}

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
    .select('id, titre, description, categorie, photo_url,ingredients,note_moyenne,lien_youtube,nombre_votes')
    .order('id', { ascending: false })

  if (error) {
    console.error('Erreur chargement recettes:', error)
    recipesContainer.innerHTML = `<p>Erreur de chargement des recettes.</p>`
    return
  }

  allRecipes = data
  filterRecipes()
}

//génération étoile
function generateStars(rating) {
  const maxStars = 5
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5 ? 1 : 0
  const emptyStars = maxStars - fullStars - halfStar

  return `
    ${'<span class="star full">★</span>'.repeat(fullStars)}
    ${halfStar ? '<span class="star half">★</span>' : ''}
    ${'<span class="star empty">★</span>'.repeat(emptyStars)}
  `
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
// Formulaire d'abonnement
const subscribeForm = document.getElementById('subscribeForm')
const subscribeMessage = document.getElementById('subscribeMessage')

subscribeForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = subscribeForm.email.value.trim()
  if (!email) return

  // Ajout dans Supabase
  const { data, error } = await supabase
    .from('abonnes')
    .insert([{ email }])

  if (error) {
    if (error.code === '23505') {
      subscribeMessage.style.color = 'orange'
      subscribeMessage.innerText = "Vous êtes déjà abonné !"
    } else {
      subscribeMessage.style.color = 'red'
      subscribeMessage.innerText = "Erreur, réessayez."
      console.error(error)
    }
    return
  }

  subscribeMessage.style.color = 'green'
  subscribeMessage.innerText = "Merci pour votre abonnement !"
  subscribeForm.reset()
})
