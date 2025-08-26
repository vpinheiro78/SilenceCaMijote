// assistant.js

// Langue héritée automatiquement
let currentLang = localStorage.getItem('siteLang') || 'fr';

const texts = {
  fr: {
    greeting: "Bonjour 👋, je suis Hugo, votre Chef Virtuel ! Comment puis-je vous régaler aujourd’hui ? 😋",
    options: [
      "🍅 Créer une recette avec mes ingrédients",
      "🍰 Créer une recette selon mes envies",
      "🎁 Surprenez-moi avec une recette de saison"
    ],
    askIngredients: "Dites-moi les ingrédients principaux 🥕🍗🍫 :",
    askType: "Vous avez envie d’un dessert 🍰 ou d’un plat 🍽️ ?",
    askDessert: "Parfait 😍 ! Quel est l’ingrédient vedette (chocolat, fruit…) ?",
    askPlat: "Super ! Vous préférez à base de viande 🥩 ou de poisson 🐟 ?",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Plat"
  },
  en: {
    greeting: "Hello 👋, I’m Hugo, your Virtual Chef! How can I delight you today? 😋",
    options: [
      "🍅 Create a recipe with my ingredients",
      "🍰 Create a recipe based on my cravings",
      "🎁 Surprise me with a seasonal recipe"
    ],
    askIngredients: "Tell me your main ingredients 🥕🍗🍫 :",
    askType: "Do you feel like a dessert 🍰 or a main dish 🍽️?",
    askDessert: "Perfect 😍! What’s the star ingredient (chocolate, fruit…)?",
    askPlat: "Great! Do you prefer meat 🥩 or fish 🐟?",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Main Dish"
  }
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

function addMessage(text, type='bot'){
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerText = text;
  chat.appendChild(div);
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
  addMessage(t.greeting);
  addChoices(t.options);
  container.classList.add('show');
}

function handleChoice(choice){
  addMessage(choice,'user');
  document.querySelectorAll('.choices').forEach(c=>c.remove());

  if(choice.includes("🍅") || choice.includes("ingredients")){
    addMessage(t.askIngredients);

  } else if(choice.includes("🍰") || choice.includes("cravings")){
    addMessage(t.askType);
    addChoices([t.dessertBtn, t.platBtn]);

  } else if(choice.includes("🎁") || choice.includes("Surprise")){
    addMessage(t.surprise);

  } else if(choice.includes("Dessert")){
    addMessage(t.askDessert);

  } else if(choice.includes("Plat") || choice.includes("Main Dish")){
    addMessage(t.askPlat);
  }
}

// démarrage
start();
