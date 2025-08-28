// assistant.js

// Langue héritée automatiquement depuis index.html
let currentLang = localStorage.getItem('siteLang') || 'fr';

const texts = {
  fr: {
    title: "👨‍🍳 Votre Chef Virtuel",
    subtitle: "Je suis là pour imaginer avec vous des recettes uniques et personnalisées. Entrez dans l’univers gourmand 2.0 où vous êtes l’acteur ! ✨",
    greeting: "Bonjour 👋, je suis Hugo, votre Chef Virtuel ! Comment puis-je vous régaler aujourd’hui ? 😋",
    options: [
      "🍅 Créer une recette avec ce que j’ai sous la main",
      "🍰 Créer une recette selon mes envies",
      "🎁 Surprenez-moi avec une recette de saison"
    ],
    askIngredients: "Dites-moi ce que vous avez sous la main 🥕🍗🍫 :",
    askEnvie: "Parlez-moi de vos envies (ex: un dessert au chocolat, un plat épicé…) 😋 :",
    askPersons: "Pour combien de personnes voulez-vous préparer ce plat ? 👨‍👩‍👧‍👦",
    confirmEnvie: "🍽️ Super, j’ai noté vos envies et le nombre d’invités !",
    confirmIngredients: "🥕 Super, j’ai noté vos ingrédients et combien vous serez à table !",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    invalidNumber: "⚠️ Merci d’indiquer un nombre valide de personnes (ex: 2, 4, 6).",
    invalidInput: "🤔 Ça ne ressemble pas à une envie culinaire… essayons encore !"
  },
  en: { title: "👨‍🍳 Your Virtual Chef", subtitle: "😅 For now, I only speak French!", greeting: "😅 For now, I only speak French!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  es: { title: "👨‍🍳 Tu Chef Virtual", subtitle: "😅 ¡Por el momento, solo hablo francés!", greeting: "😅 ¡Por el momento, solo hablo francés!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  it: { title: "👨‍🍳 Il tuo Chef Virtuale", subtitle: "😅 Per ora parlo solo francese!", greeting: "😅 Per ora parlo solo francese!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  de: { title: "👨‍🍳 Dein Virtueller Koch", subtitle: "😅 Im Moment spreche ich nur Französisch!", greeting: "😅 Im Moment spreche ich nur Französisch!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  pt: { title: "👨‍🍳 Seu Chef Virtual", subtitle: "😅 Por enquanto, só falo francês!", greeting: "😅 Por enquanto, só falo francês!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" }
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let userIngredients = "";
let userEnvie = "";
let userPersons = "";
let lastRecipe = null; // { title, ingredients[], steps[], season, raw }

// Mots-clés culinaires
const foodKeywords = ["poulet","poisson","chocolat","tomate","pâtes","riz","légume","salade","gâteau","pizza","soupe","fromage","beurre","pain","steak","cake","fruit","épice","poivre","sel"];

// Injecte un style léger pour la fiche recette + boutons
function injectStyles(){
  if (document.getElementById('assistantDynamicStyles')) return;
  const css = `
  .recipe-card{
    background:#fff; border-radius:16px; padding:16px 18px;
    box-shadow:0 8px 24px rgba(0,0,0,0.06);
    border-left:6px solid #e67e22; margin:8px 0;
  }
  .rc-header{display:flex; align-items:center; justify-content:space-between; gap:12px;}
  .rc-title{font-size:1.05rem; font-weight:700; color:#d35400; margin:0;}
  .rc-chip{background:#ffe6d1; color:#d35400; padding:4px 10px; border-radius:999px; font-size:12px; white-space:nowrap;}
  .rc-section{margin-top:10px;}
  .rc-section h4{margin:8px 0 6px; font-size:1rem; color:#333;}
  .rc-list{margin:0; padding-left:18px;}
  .rc-actions{display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;}
  .btn-main,.btn-alt{
    border:none; border-radius:999px; padding:10px 14px; cursor:pointer; font-weight:600;
    box-shadow:0 2px 8px rgba(0,0,0,0.08); transition:transform .05s ease;
  }
  .btn-main{background:#e67e22; color:#fff;}
  .btn-alt{background:#fff; color:#e67e22; border:2px solid #e67e22;}
  .btn-main:active,.btn-alt:active{transform:translateY(1px);}
  .followup{background:#fff8f0; border:1px dashed #f0b27a; border-radius:12px; padding:12px; margin-top:10px;}
  .followup p{margin:.2rem 0;}
  .followup .mini-actions{display:flex; flex-wrap:wrap; gap:8px; margin-top:6px;}
  .mini-btn{padding:8px 12px; border-radius:999px; border:1px solid #e67e22; background:#fff; color:#e67e22; cursor:pointer;}
  .feedback{font-size:.95em;}
  `;
  const style = document.createElement('style');
  style.id = 'assistantDynamicStyles';
  style.textContent = css;
  document.head.appendChild(style);
}

function updateHeader() {
  document.getElementById('title').innerText = t.title;
  document.getElementById('subtitle').innerText = t.subtitle;
}

function addMessage(text, type='bot'){
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addMessageHTML(html, type='bot'){
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = html;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Champ de saisie style "chat"
function addInputField(placeholder, callback){
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'chat-input';
  input.placeholder = placeholder;

  const btn = document.createElement('button');
  btn.innerText = "➤";
  btn.className = 'send-btn';

  btn.onclick = ()=>{ if(input.value.trim() !== ""){ callback(input.value.trim()); wrapper.remove(); } };

  input.addEventListener("keypress", (e)=>{ if(e.key === "Enter" && input.value.trim() !== ""){ callback(input.value.trim()); wrapper.remove(); } });

  wrapper.appendChild(input);
  wrapper.appendChild(btn);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
}

function addChoices(options){
  if(!options || !options.length) return;
  const div = document.createElement('div');
  div.className = 'choices';
  options.forEach(opt=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = opt;
    btn.onclick = ()=> handleChoice(opt);
    div.appendChild(btn);
  });
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function start(){
  injectStyles();
  updateHeader();
  addMessage(t.greeting);
  addChoices(t.options);
  container.classList.add('show');
}

function handleChoice(choice){
  addMessage(choice,'user');
  document.querySelectorAll('.choices').forEach(c=>c.remove());

  if(choice.includes("🍅") || choice.includes("ingredients") || choice.includes("Create a recipe with what I have")){
    addMessage(t.askIngredients);
    addInputField("🥕🍗🍫 ...", (val)=>{
      if(!foodKeywords.some(k=>val.toLowerCase().includes(k))){
        addMessage(t.invalidInput);
        addInputField(t.askIngredients, arguments.callee);
        return;
      }
      userIngredients = val;
      askPersons("ingredients");
    });

  } else if(choice.includes("🍰") || choice.includes("cravings")){
    addMessage(t.askEnvie);
    addInputField("🍰🍲 ...", (val)=>{
      if(!foodKeywords.some(k=>val.toLowerCase().includes(k))){
        addMessage(t.invalidInput);
        addInputField(t.askEnvie, arguments.callee);
        return;
      }
      userEnvie = val;
      askPersons("envie");
    });

  } else if(choice.includes("🎁") || choice.includes("Surprise")){
    // Demande le nombre de personnes puis génère la recette de saison
    askPersons("surprise");
  }
}

function askPersons(type){
  addMessage(t.askPersons);
  addInputField("ex: 2, 4, 6", (val)=>{
    if(isNaN(val) || parseInt(val)<=0){
      addMessage(t.invalidNumber);
      askPersons(type);
      return;
    }
    userPersons = parseInt(val);
    if(type==="envie"){
      addMessage(t.confirmEnvie);
      sendToOpenAI("envie");
    } else if(type==="ingredients"){
      addMessage(t.confirmIngredients);
      sendToOpenAI("ingredients");
    } else if(type==="surprise"){
      addMessage(t.surprise);
      generateSeasonRecipe();
    }
  });
}

// -------- Recette de saison : récupération + affichage harmonisé --------

function getSeason(){
  const m = new Date().getMonth();
  if([11,0,1].includes(m)) return "hiver";
  if([2,3,4].includes(m)) return "printemps";
  if([5,6,7].includes(m)) return "été";
  return "automne";
}

function stripMarkdown(s){
  return s
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g,'')
    .replace(/^#{1,6}\s*/gm,'')
    .replace(/^\s*[-*•]\s*/gm,'• ')
    .replace(/^>\s?/gm,'')
    .trim();
}

function normalize(s){
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,''); // suppr. accents
}

function parseRecipe(raw){
  const clean = stripMarkdown(raw);
  const lines = clean.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);

  // Chercher sections
  const idxIng = lines.findIndex(l => /ingr[ée]dients?/.test(normalize(l)));
  const idxPrep = lines.findIndex(l => /(pr[ée]paration|instructions?|etapes?)/.test(normalize(l)));

  let title = "Recette de saison";
  // titre = première ligne “forte”
  if(lines[0] && !/ingr|prep|etapes/i.test(lines[0])) title = lines[0];

  let ingredients = [];
  let steps = [];

  if(idxIng !== -1){
    const start = idxIng + 1;
    const end = idxPrep !== -1 ? idxPrep : lines.length;
    ingredients = lines.slice(start, end)
      .filter(l => /^(\d+[\w\s]*|[•\-*])/.test(l) || l.includes('•'))
      .map(l => l.replace(/^•\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);
  }

  if(idxPrep !== -1){
    const start = idxPrep + 1;
    steps = lines.slice(start)
      .map(l => l.replace(/^\d+\.\s*/, '').replace(/^•\s*/, '').trim())
      .filter(Boolean);
  }

  // fallback si pas d’extraction nette
  if(ingredients.length === 0 && steps.length === 0){
    return { title, ingredients: [], steps: [clean], season: getSeason(), raw: clean };
  }
  return { title, ingredients, steps, season: getSeason(), raw: clean };
}

function renderRecipeCard(recipe){
  lastRecipe = recipe;

  const card = document.createElement('div');
  card.className = 'recipe-card';

  const titleHTML = `
    <div class="rc-header">
      <h3 class="rc-title">${escapeHTML(recipe.title)}</h3>
      <span class="rc-chip">${recipe.season}</span>
    </div>
  `;

  const ingHTML = recipe.ingredients.length
    ? `<div class="rc-section">
         <h4>📝 Ingrédients</h4>
         <ul class="rc-list">
           ${recipe.ingredients.map(i=>`<li>${escapeHTML(i)}</li>`).join('')}
         </ul>
       </div>` : '';

  const stepsHTML = recipe.steps.length
    ? `<div class="rc-section">
         <h4>👨‍🍳 Préparation</h4>
         <ol class="rc-list">
           ${recipe.steps.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}
         </ol>
       </div>` : '';

  const actionsHTML = `
    <div class="rc-actions">
      <button class="btn-alt" id="btn-new-idea">🔄 Donne-moi une autre idée</button>
      <button class="btn-main" id="btn-accept">✅ Parfait, on teste !</button>
    </div>
  `;

  card.innerHTML = `${titleHTML}${ingHTML}${stepsHTML}${actionsHTML}`;
  chat.appendChild(card);
  chat.scrollTop = chat.scrollHeight;

  card.querySelector('#btn-new-idea').addEventListener('click', ()=> generateSeasonRecipe(true));
  card.querySelector('#btn-accept').addEventListener('click', showFollowupOptions);
}

function showFollowupOptions(){
  const box = document.createElement('div');
  box.className = 'followup';
  box.innerHTML = `
    <p>🤔 Cela vous tente ?</p>
    <div class="mini-actions">
      <button class="mini-btn" id="btn-wa">📩 Envoyer par WhatsApp</button>
      <button class="mini-btn" id="btn-img">📸 Enregistrer en photo</button>
      <button class="mini-btn" id="btn-copy-list">🛒 Copier la liste de courses</button>
    </div>
    <p class="feedback">🙏 Si vous la testez, faites-nous un retour : 
      <a href="mailto:contact.silencecamijote@gmail.com">contact.silencecamijote@gmail.com</a>
    </p>
  `;
  chat.appendChild(box);
  chat.scrollTop = chat.scrollHeight;

  box.querySelector('#btn-wa').addEventListener('click', shareWhatsApp);
  box.querySelector('#btn-img').addEventListener('click', saveAsImage);
  box.querySelector('#btn-copy-list').addEventListener('click', copyShoppingList);
}

function escapeHTML(s){
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

function recipePlainText(){
  if(!lastRecipe) return "";
  const { title, ingredients, steps, season } = lastRecipe;
  const ing = ingredients.length ? ingredients.map(i=>`• ${i}`).join('\n') : '(non précisé)';
  const stp = steps.length ? steps.map((s,i)=> `${i+1}. ${s}`).join('\n') : '(non précisé)';
  return `${title} (${season})
  
Ingrédients :
${ing}

Préparation :
${stp}`;
}

function shareWhatsApp(){
  const text = recipePlainText();
  if(!text) return;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// Génère une image PNG simple avec le texte de la recette
function saveAsImage(){
  const text = recipePlainText();
  if(!text) return;

  // mise en page basique
  const lines = text.split('\n');
  const padding = 40;
  const lineHeight = 28;
  const width = 1080;

  // calcul hauteur
  const height = Math.max(600, padding*2 + lines.length * lineHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // fond
  ctx.fillStyle = '#fff8f0';
  ctx.fillRect(0, 0, width, height);

  // cadre
  ctx.fillStyle = '#e67e22';
  ctx.fillRect(0, 0, width, 12);

  // texte
  ctx.fillStyle = '#333';
  ctx.font = '20px Segoe UI, Arial, sans-serif';
  let y = padding;

  lines.forEach(line=>{
    // wrap simple si trop long
    const maxWidth = width - padding*2;
    const words = line.split(' ');
    let buf = '';
    words.forEach(w=>{
      const test = buf ? buf + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth){
        ctx.fillText(buf, padding, y);
        y += lineHeight;
        buf = w;
      } else {
        buf = test;
      }
    });
    ctx.fillText(buf, padding, y);
    y += lineHeight;
  });

  const link = document.createElement('a');
  link.download = 'recette.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function copyShoppingList(){
  if(!lastRecipe || !lastRecipe.ingredients.length){
    alert("Aucune liste d’ingrédients détectée.");
    return;
  }
  const list = lastRecipe.ingredients.map(i=>`• ${i}`).join('\n');
  navigator.clipboard.writeText(list).then(()=>{ addMessage("🛒 Liste de courses copiée dans le presse-papiers !"); });
}

// -------- Nouvelle fonction d'envoi pour tous les choix sauf surprise --------
function sendToOpenAI(type){
  addMessage("✨ Génération de la recette… Patientez un instant 🍳");

  let promptMessage = "";
  const personsText = userPersons && !isNaN(userPersons) ? userPersons : 1;

  if(type==="ingredients"){
    promptMessage = `Donne-moi une recette originale pour ${personsText} personne(s) en utilisant uniquement ces ingrédients : ${userIngredients}. Réponds en français, complète, structurée en trois parties : titre, ingrédients avec quantités, préparation étape par étape.`;
  } else if(type==="envie"){
    promptMessage = `Donne-moi une recette originale pour ${personsText} personne(s) correspondant à cette envie : ${userEnvie}. Réponds en français, complète, structurée en trois parties : titre, ingrédients avec quantités, préparation étape par étape.`;
  }

  fetch("/.netlify/functions/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: promptMessage, persons: personsText })
  })
  .then(res => res.json())
  .then(data => {
    if(data.reply){
      const parsed = parseRecipe(data.reply);
      renderRecipeCard(parsed);
    } else {
      addMessage("⚠️ Oups, réponse serveur vide.");
    }
  })
  .catch(err=>{
    console.error(err);
    addMessage("⚠️ Erreur serveur, réessayez plus tard.");
  });
}

// Recette de saison
function generateSeasonRecipe(fromAnotherIdea=false){
  addMessage("✨ Génération de la recette… Patientez un instant 🍳");
  const season = getSeason();
  const personsText = userPersons && !isNaN(userPersons) ? userPersons : 1;
  const promptMessage = `Donne-moi une recette ${season} détaillée pour ${personsText} personne(s), avec sections Ingrédients et Préparation. Réponds en français, complète et structurée.`;

  fetch("/.netlify/functions/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: promptMessage, persons: personsText })
  })
  .then(res => res.json())
  .then(data => {
    if(data.reply){
      const parsed = parseRecipe(data.reply);
      renderRecipeCard(parsed);
      if(!fromAnotherIdea){
        addMessage("🤔 Cela vous tente ?");
      }
    } else {
      addMessage("⚠️ Oups, réponse serveur vide.");
    }
  })
  .catch(err=>{
    console.error(err);
    addMessage("⚠️ Erreur serveur, réessayez plus tard.");
  });
}

// démarrage
start();
