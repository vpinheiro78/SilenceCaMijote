// --- Gestion de la langue ---
let currentLang = localStorage.getItem('siteLang') || 'fr';

const texts = {
  fr: {
    title: "Assistant des Saveurs",
    greeting: "Bonjour, je suis votre chef virtuel ! Comment puis-je vous aider ?",
    options: [
      "Créer une recette avec des ingrédients de votre choix",
      "Créer une recette selon vos envies",
      "Surprenez-moi avec une recette de saison"
    ],
    askIngredients: "Quels ingrédients voulez-vous inclure ?",
    askType: "Préférez-vous un dessert ou un plat ?",
    askDessert: "Quel est l’ingrédient principal ?",
    askPlat: "Viande ou poisson ?",
    surprise: "Voici une recette de saison pour vous !"
  },
  en: {
    title: "Flavor Assistant",
    greeting: "Hello, I am your virtual chef! How can I help you?",
    options: [
      "Create a recipe with ingredients of your choice",
      "Create a recipe based on your cravings",
      "Surprise me with a seasonal recipe"
    ],
    askIngredients: "Which ingredients do you want to include?",
    askType: "Do you prefer a dessert or a main dish?",
    askDessert: "What is the main ingredient?",
    askPlat: "Meat or fish?",
    surprise: "Here’s a seasonal recipe for you!"
  }
  // Ajoute les autres langues de la même manière
};

function updateLanguage(lang){
  currentLang = lang;
  localStorage.setItem('siteLang', lang);
  document.getElementById('assistant-title').innerText = texts[lang].title || texts['fr'].title;
}

document.querySelectorAll('#langSelector img').forEach(img=>{
  img.addEventListener('click', ()=> updateLanguage(img.dataset.lang));
});

updateLanguage(currentLang);

// --- Gestion du chat ---
const chat = document.getElementById('chat-container');

function addMessage(content, type='bot'){
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.innerText = content;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// --- Choix interactifs ---
function addChoices(options){
  const container = document.createElement('div');
  container.className = 'choices';
  options.forEach(opt=>{
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = opt;
    btn.onclick = ()=> handleChoice(opt);
    container.appendChild(btn);
  });
  chat.appendChild(container);
  chat.scrollTop = chat.scrollHeight;
}

let step = 0;

function startAssistant(){
  addMessage(texts[currentLang].greeting);
  addChoices(texts[currentLang].options);
}

function handleChoice(choice){
  addMessage(choice, 'user');
  
  // supprimer les anciens boutons
  document.querySelectorAll('.choices').forEach(c => c.remove());

  const t = texts[currentLang];
  
  if(choice === t.options[0]){ // ingrédients
    step = 1;
    addMessage(t.askIngredients);
    // ici tu peux ajouter un input pour que l'utilisateur tape les ingrédients
  } else if(choice === t.options[1]){ // selon envies
    step = 2;
    addMessage(t.askType);
    addChoices(["Dessert", "Plat"]);
  } else if(choice === t.options[2]){ // surprise
    step = 3;
    addMessage(t.surprise);
    // ici tu peux afficher directement une recette de saison depuis Supabase
  } else if(choice === "Dessert"){
    step = 4;
    addMessage(t.askDessert);
  } else if(choice === "Plat"){
    step = 5;
    addMessage(t.askPlat);
  }
}

// démarrage
startAssistant();
