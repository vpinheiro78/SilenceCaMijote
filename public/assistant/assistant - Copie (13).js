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
  en: {
    title: "👨‍🍳 Your Virtual Chef",
    subtitle: "😅 For now, I only speak French!",
    greeting: "😅 For now, I only speak French!",
    options: []
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "😅 ¡Por el momento, solo hablo francés!",
    greeting: "😅 ¡Por el momento, solo hablo francés!",
    options: []
  },
  it: {
    title: "👨‍🍳 Il tuo Chef Virtuale",
    subtitle: "😅 Per ora parlo solo francese!",
    greeting: "😅 Per ora parlo solo francese!",
    options: []
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Koch",
    subtitle: "😅 Im Moment spreche ich nur Französisch!",
    greeting: "😅 Im Moment spreche ich nur Französisch!",
    options: []
  },
  pt: {
    title: "👨‍🍳 Seu Chef Virtual",
    subtitle: "😅 Por enquanto, só falo francês!",
    greeting: "😅 Por enquanto, só falo francês!",
    options: []
  }
};

const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let userIngredients = "";
let userEnvie = "";
let userPersons = "";

const foodKeywords = ["poulet","poisson","chocolat","tomate","pâtes","riz","légume","salade","gâteau","pizza","soupe","fromage","beurre","pain","steak","cake","fruit","épice","poivre","sel"];

function updateHeader() {
  document.getElementById('title').innerText = t.title;
  document.getElementById('subtitle').innerText = t.subtitle;
}

function addMessage(text, type='bot', isHTML=false){
  const div = document.createElement('div');
  div.className = `message ${type}`;
  if(isHTML){
    div.innerHTML = text;
  } else {
    div.innerText = text;
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

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

  btn.onclick = ()=>{
    if(input.value.trim() !== ""){
      callback(input.value.trim());
      wrapper.remove();
    }
  };

  input.addEventListener("keypress", (e)=>{
    if(e.key === "Enter" && input.value.trim() !== ""){
      callback(input.value.trim());
      wrapper.remove();
    }
  });

  wrapper.appendChild(input);
  wrapper.appendChild(btn);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
}

function addChoices(options){
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
  updateHeader();
  addMessage(t.greeting);
  addChoices(t.options);
  container.classList.add('show');
}

function handleChoice(choice){
  addMessage(choice,'user');
  document.querySelectorAll('.choices').forEach(c=>c.remove());

  if(choice.includes("🍅")){
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

  } else if(choice.includes("🍰")){
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

  } else if(choice.includes("🎁")){
    generateSeasonRecipe();
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
    } else {
      addMessage(t.confirmIngredients);
    }
  });
}

// Générer recette de saison
function generateSeasonRecipe(){
  addMessage("✨ Génération de la recette… Patientez un instant 🍳");

  const month = new Date().getMonth(); 
  let season = "";
  switch(month){
    case 11: case 0: case 1: season = "hiver"; break;
    case 2: case 3: case 4: season = "printemps"; break;
    case 5: case 6: case 7: season = "été"; break;
    case 8: case 9: case 10: season = "automne"; break;
  }

  const promptMessage = `Donne-moi une recette ${season} détaillée pour 1 personne, avec une liste d'ingrédients et des étapes de préparation.`;

  fetch("/.netlify/functions/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: promptMessage })
  })
  .then(res => res.json())
  .then(data => {
    if(data.reply){
      const html = renderRecipe(data.reply);
      addMessage(html, 'bot', true);
    } else {
      addMessage("⚠️ Oups, réponse serveur vide.");
    }
  })
  .catch(err=>{
    console.error(err);
    addMessage("⚠️ Erreur serveur, réessayez plus tard.");
  });
}

// Transformer le texte en recette HTML
function renderRecipe(recipeText){
  const parts = recipeText.split(/Préparation|Instructions|Étapes/i);

  const ingredients = parts[0].replace(/Ingrédients?:/i, "").trim().split("\n").filter(l => l.trim() !== "");
  const steps = parts[1] ? parts[1].trim().split("\n").filter(l => l.trim() !== "") : [];

  return `
    <div class="recipe-card">
      <h2 class="recipe-title">🍽️ Recette de saison</h2>
      <div class="recipe-content">
        <h3>📝 Ingrédients :</h3>
        <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h3>👨‍🍳 Préparation :</h3>
        <ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>
      </div>
    </div>
    <div class="recipe-actions">
      <p>🤔 Cela vous tente ?</p>
      <button class="btn" onclick="generateSeasonRecipe()">🔄 Donne-moi une autre idée</button>
      <button class="btn-primary" onclick="acceptRecipe()">✅ Parfait, je vais tester cette recette</button>
    </div>
    <div id="after-accept" style="display:none; text-align:center; margin-top:20px;">
      <p>✨ Super choix ! Tu veux garder la recette ?</p>
      <button onclick="shareWhatsApp()">📲 Envoyer sur WhatsApp</button>
      <button onclick="saveImage()">🖼️ Enregistrer en photo</button>
      <p style="margin-top:15px; font-size:0.9em;">
        🛒 Tu peux aussi générer une <strong>liste de courses</strong> avec les ingrédients manquants.<br>
        📩 Et n’hésite pas à nous faire un retour sur :  
        <a href="mailto:contact.silencecamijote@gmail.com">contact.silencecamijote@gmail.com</a>
      </p>
    </div>
  `;
}

function acceptRecipe(){
  document.getElementById('after-accept').style.display = 'block';
}

function shareWhatsApp(){
  const text = "Voici une recette que j’ai trouvée avec Silence Ça Mijote 😋🍳";
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

function saveImage(){
  alert("📸 Fonction d’enregistrement en image à implémenter !");
}

// démarrage
start();
