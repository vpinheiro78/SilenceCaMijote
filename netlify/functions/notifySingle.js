<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Admin - Silence ça mijote</title>
<link rel="stylesheet" href="../style.css"/>
</head>
<body>
<header class="site-header">
  <h1>Admin</h1>
  <a href="stats.html" class="btn-liste-courses" style="margin-left:12px;">📊 Statistiques</a>
  <a href="../index.html">Retour site</a>
</header>

<main style="max-width:1100px;margin:18px auto;padding:12px">

  <!-- SECTION RECETTE -->
  <section style="background:#fff;padding:14px;border-radius:10px;box-shadow:0 3px 8px rgba(0,0,0,0.04)">
    <h2>Créer / Modifier une recette</h2>
    <form id="recipeForm">
      <input type="hidden" name="id" />
      <label>Titre<br/><input name="titre" required style="width:100%;padding:12px;font-size:16px"/></label><br/><br/>
      <label>Description<br/><textarea name="description" rows="3" style="width:100%;padding:12px;font-size:15px"></textarea></label><br/>
      <label>Catégorie<br/>
        <select name="categorie" style="padding:10px;font-size:15px">
          <option value="dessert">dessert</option>
          <option value="viande">viande</option>
          <option value="poisson">poisson</option>
          <option value="accompagnement">accompagnement</option>
          <option value="autre">autre</option>
        </select>
      </label><br/><br/>
      <label>Image (fichier)<br/><input type="file" name="imagefile" accept="image/*" /></label><br/>
      <button type="button" id="uploadBtn">Uploader l'image</button>
      <span id="uploadStatus" style="margin-left:8px;color:#333"></span><br/><br/>
      <label>Ou URL image<br/><input name="photo_url" style="width:100%;padding:10px;font-size:15px" placeholder="https://..."/></label><br/><br/>
      <label>Vidéo YouTube (URL)<br/><input name="lien_youtube" style="width:100%;padding:10px;font-size:15px" placeholder="https://www.youtube.com/watch?v=..."/></label><br/><br/>
      <label>Ingrédients (un par ligne)<br/><textarea name="ingredients" rows="4" style="width:100%;padding:12px;font-size:15px"></textarea></label><br/>
      <label>Préparation / Étapes (une étape par ligne)<br/><textarea name="preparation" rows="6" style="width:100%;padding:12px;font-size:15px"></textarea></label><br/><br/>
      <button type="submit">Enregistrer</button>
      <button type="button" id="resetBtn">Réinitialiser</button>
    </form>
  </section>

  <!-- LISTE DES RECETTES -->
  <section style="margin-top:18px">
    <h2>Recettes existantes</h2>
    <div id="list"></div>
  </section>

  <!-- TEST ENVOI EMAIL -->
  <section style="margin-top:30px; background:#fff;padding:14px;border-radius:10px;box-shadow:0 3px 8px rgba(0,0,0,0.04)">
    <h2>Test Envoi Email</h2>
    <label>Adresse email destinataire<br/>
      <input type="email" id="testEmail" placeholder="exemple@domaine.com" style="width:100%;padding:10px;font-size:15px"/>
    </label><br/><br/>
    <button type="button" id="sendTestEmail">Envoyer Email</button>
    <p id="emailStatus" style="margin-top:8px;color:#333;font-weight:bold"></p>
  </section>

  <!-- NOTIFICATION ABONNÉ -->
  <section style="margin-top:30px; background:#fff;padding:14px;border-radius:10px;box-shadow:0 3px 8px rgba(0,0,0,0.04)">
    <h2>Notifier un abonné</h2>
    <label>Choisir une recette<br/>
      <select id="recetteSelect" style="width:100%;padding:10px;font-size:15px">
        <option value="">-- Sélectionnez une recette --</option>
      </select>
    </label><br/><br/>
    <label>Choisir un abonné<br/>
      <select id="abonneSelect" style="width:100%;padding:10px;font-size:15px">
        <option value="">-- Sélectionnez un abonné --</option>
      </select>
    </label><br/><br/>
    <button type="button" id="sendNotification">Envoyer notification</button>
    <p id="notifStatus" style="margin-top:8px;color:#333;font-weight:bold"></p>
  </section>

</main>

<script type="module">

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://ttkgzzamsfnittbqqvft.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2d6emFtc2ZuaXR0YnFxdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjg4MTEsImV4cCI6MjA3MDQwNDgxMX0.aE5GxrKrNJoqr1g8ASVG9Vdf7k_OLuyCOe2vZAp0-wY'

const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('recipeForm')
const listDiv = document.getElementById('list')
const uploadBtn = document.getElementById('uploadBtn')
const uploadStatus = document.getElementById('uploadStatus')

let uploadedPath = ''

// UPLOAD IMAGE
uploadBtn.addEventListener('click', async () => {
  const file = form.elements['imagefile'].files[0]
  if (!file) return alert('Choisissez un fichier')
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g,'_')}`
  uploadStatus.innerText = 'Upload en cours...'
  const { data, error } = await supabase.storage.from('photos-recettes').upload(fileName, file)
  if (error) { uploadStatus.innerText = 'Erreur'; return console.error(error) }
  uploadedPath = data.path
  const { data: publicUrlData } = supabase.storage.from('photos-recettes').getPublicUrl(uploadedPath)
  form.elements['photo_url'].value = publicUrlData.publicUrl
  uploadStatus.innerText = 'Upload réussi !'
})

// LISTE RECETTES
async function loadList() {
  const { data, error } = await supabase.from('recettes').select('*').order('created_at', { ascending: false })
  if (error) return listDiv.innerHTML = '<p>Erreur chargement</p>'
  listDiv.innerHTML = ''
  data.forEach(r => {
    const card = document.createElement('div')
    card.className = 'card'
    card.style.padding = '12px'
    card.style.marginBottom = '10px'
    card.innerHTML = `
      <strong>${r.titre}</strong> — ${r.categorie} <br/>
      <button data-id="${r.id}" class="edit">Modifier</button>
      <button data-id="${r.id}" class="del">Supprimer</button>
    `
    listDiv.appendChild(card)
  })

  listDiv.querySelectorAll('.del').forEach(btn => btn.addEventListener('click', async e => {
    if(!confirm('Supprimer ?')) return
    const id = e.target.dataset.id
    const { error } = await supabase.from('recettes').delete().eq('id', id)
    if(error) console.error(error); else loadList()
  }))

  listDiv.querySelectorAll('.
