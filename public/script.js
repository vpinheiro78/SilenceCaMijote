// Import Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 📌 Infos Supabase
const supabaseUrl = 'https://ttkgzzamsfnittbqqvft.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2d6emFtc2ZuaXR0YnFxdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjg4MTEsImV4cCI6MjA3MDQwNDgxMX0.aE5GxrKrNJoqr1g8ASVG9Vdf7k_OLuyCOe2vZAp0-wY'
const supabase = createClient(supabaseUrl, supabaseKey)

// 🔥 Langue actuelle
let currentLang = localStorage.getItem('siteLang') || 'fr'
const availableLangs = ['fr','en','es','de','it','pt']
const defaultLang = 'fr'

// Sélecteurs HTML
const recipesContainer = document.getElementById('recipes')
const searchInput = document.getElementById('search')                                                                                         
const categoryButtons = document.querySelectorAll('.cat-btn')
const subscribeForm = document.getElementById('subscribeForm')
const subscribeMessage = document.getElementById('subscribeMessage')

let allRecipes = []
let currentCategory = 'all'
let currentSearch = ''

// ----------------- FONCTIONS ----------------- //

// Affichage recettes
function displayRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    recipesContainer.innerHTML = `<p>Aucune recette trouvée.</p>`
    return
  }

  recipesContainer.innerHTML = recipes.map(r => `
    <a href="recette/recette.html?slug=${r.slug}" class="recipe-card">
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

// Filtrage recettes
function filterRecipes() {
  let filtered = allRecipes

  if (currentCategory !== 'all') {
    filtered = filtered.filter(r => (r.categorie || '').toLowerCase().startsWith(currentCategory.toLowerCase()))
  }

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

// Génération étoiles
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

// Charger recettes depuis Supabase
async function loadRecipes() {
  const { data, error } = await supabase
    .from('recettes')
    .select(`
      id,
	  slug,
      titre,
      description,
      categorie,
      photo_url,
      ingredients,
      note_moyenne,
      lien_youtube,
      nombre_votes,
      traductions:recettes_traductions(langue, titre, description)
    `)
    .order('id', { ascending: false })

  if (error) {
    console.error('Erreur chargement recettes:', error)
    recipesContainer.innerHTML = `<p>Erreur de chargement des recettes.</p>`
    return
  }

  allRecipes = data.map(r => {
    const trad = r.traductions?.find(t => t.langue === currentLang)
    return {
      ...r,
      titre: trad?.titre || r.titre,
      description: trad?.description || r.description
    }
  })

  filterRecipes()
}

// Changer langue
function changeLanguage(lang) {
  if (!availableLangs.includes(lang)) lang = defaultLang
  currentLang = lang
  localStorage.setItem('siteLang', lang)

  fetch(`translations/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('site-blurb').innerText = data.blurb.main
      document.getElementById('search').placeholder = data.search.placeholder
      document.querySelector('#subscribeForm h3').innerText = data.newsletter.title
      document.querySelector('#subscribeForm input[name="email"]').setAttribute('placeholder', data.newsletter.email_placeholder)
      document.querySelector('#subscribeForm button').innerText = data.newsletter.subscribe_button

      const categories = data.categories
      document.querySelector('button[data-cat="all"]').innerText = categories.all
      document.querySelector('button[data-cat="dessert"]').innerText = categories.dessert
      document.querySelector('button[data-cat="viande"]').innerText = categories.viande
      document.querySelector('button[data-cat="poisson"]').innerText = categories.poisson
      document.querySelector('button[data-cat="accompagnement"]').innerText = categories.accompagnement
      document.querySelector('button[data-cat="autre"]').innerText = categories.autre
    })
    .finally(() => {
      loadRecipes() // 🔥 fonctionne maintenant
    })
}

// ----------------- ÉVÉNEMENTS ----------------- //

searchInput.addEventListener('input', e => {
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

subscribeForm.addEventListener('submit', async e => {
  e.preventDefault()
  const email = subscribeForm.email.value.trim()
  if (!email) return

  const { data, error } = await supabase
    .from('abonnes')
    .insert([{ email }])

  if (error) {
    subscribeMessage.style.color = error.code === '23505' ? 'orange' : 'red'
    subscribeMessage.innerText = error.code === '23505' ? "Vous êtes déjà abonné !" : "Erreur, réessayez."
    return
  }

  subscribeMessage.style.color = 'green'
  subscribeMessage.innerText = "Merci pour votre abonnement !"

  try {
    await fetch('/.netlify/functions/notifySubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
  } catch (e) {
    console.error('Erreur envoi emails:', e)
  }

  subscribeForm.reset()
})

// ----------------- INITIALISATION ----------------- //
document.querySelectorAll('#langSelector img').forEach(img => {
  img.addEventListener('click', () => changeLanguage(img.dataset.lang))
})

// Charger la langue et les recettes au démarrage
changeLanguage(currentLang)
