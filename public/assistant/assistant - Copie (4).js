// assistant.js

// Langue héritée automatiquement depuis index.html
let currentLang = localStorage.getItem('siteLang') || 'fr';

const texts = {
  fr: {
    title: "👨‍🍳 Votre Chef Virtuel",
    subtitle: "Je suis là pour imaginer avec vous des recettes uniques et personnalisées. Entrez dans l’univers gourmand 2.0 où vous êtes l’acteur ! ✨",
    greeting: "Bonjour 👋, je suis Hugo, votre Chef Virtuel ! Comment puis-je vous régaler aujourd’hui ? 😋",
    options: [
      "🍅 Créer une recette avec mes ingrédients",
      "🍰 Créer une recette selon mes envies",
      "🎁 Surprenez-moi avec une recette de saison"
    ],
    askIngredients: "Dites-moi les ingrédients principaux 🥕🍗🍫 :",
    askType: "Vous avez envie d’un dessert 🍰 ou d’un plat 🍽️ ?",
    askDesire: "Très bien 😍 ! Dites-moi clairement votre envie (ex: tarte aux pommes, plat léger au poulet…)",
    askPeople: "Pour combien de personnes doit-on préparer la recette ? 👨‍👩‍👧‍👦",
    askDessert: "Parfait 😍 ! Quel est l’ingrédient vedette (chocolat, fruit…) ?",
    askPlat: "Super ! Vous préférez à base de viande 🥩 ou de poisson 🐟 ?",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Plat",
    validateBtn: "Valider ✅"
  },
  en: {
    title: "👨‍🍳 Your Virtual Chef",
    subtitle: "I’m here to imagine unique and personalized recipes with you. Step into the gourmet 2.0 universe where YOU are the star! ✨",
    greeting: "Hello 👋, I’m Hugo, your Virtual Chef! How can I delight you today? 😋",
    options: [
      "🍅 Create a recipe with my ingredients",
      "🍰 Create a recipe based on my cravings",
      "🎁 Surprise me with a seasonal recipe"
    ],
    askIngredients: "Tell me your main ingredients 🥕🍗🍫 :",
    askType: "Do you feel like a dessert 🍰 or a main dish 🍽️?",
    askDesire: "Great 😍! Please tell me your craving clearly (e.g. apple pie, light chicken dish…)",
    askPeople: "For how many people should we prepare the recipe? 👨‍👩‍👧‍👦",
    askDessert: "Perfect 😍! What’s the star ingredient (chocolate, fruit…)?",
    askPlat: "Great! Do you prefer meat 🥩 or fish 🐟?",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Main Dish",
    validateBtn: "Validate ✅"
  },
  // idem pour de, it, pt, es -> tu peux dupliquer en traduisant "askDesire", "askPeople", "validateBtn"
};

// Sélection du bon jeu de textes
let t = texts[currentLang] || texts['fr'];

// 🔥 Variables pour stocker les réponses
let userIngredients = "";
let userDesire = "";
let userType = "";
let userPeople = "";

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

// 🔥 Fonction mise à jour du titre et sous-titre
function updateHeader() {
  document.getElementById('title').innerText = t.title;
  document.getElementById('subtitle').innerText = t.subtitle;
}

// 🔥 Mise à jour de la langue
function setLanguage(lang) {
  if (!texts[lang]) lang = 'fr';
  currentLang = lang;
  localStorage.setItem('siteLang', lang);
  t = texts[currentLang];
  updateHeader();
}

// 🔥 Messages et choix
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

// 🆕 Ajout input libre
function addInput(callback){
  const div = document.createElement('div');
  div.className = 'input-block';
  const input = document.createElement('input');
  input.type = "text";
  input.placeholder = "...";
  const btn = document.createElement('button');
  btn.innerText = t.validateBtn;
  btn.onclick = ()=> {
    if(input.value.trim()!==""){
      callback(input.value.trim());
      div.remove();
    }
  };
  div.appendChild(input);
  div.appendChild(btn);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// 🔥 Démarrage
function start(){
  updateHeader();
  addMessage(t.greeting);
  addChoices(t.options);
  container.classList.add('show');
}

// 🔥 Gestion des choix
function handleChoice(choice){
  addMessage(choice,'user');
  document.querySelectorAll('.choices').forEach(c=>c.remove());

  if(choice.includes("🍅") || choice.toLowerCase().includes("ingredients")){
    addMessage(t.askIngredients);
    addInput(val=>{
      userIngredients = val;
      addMessage("👉 " + val,'user');
      addMessage(t.askPeople);
      addInput(p=>{
        userPeople = p;
        addMessage("👨‍👩‍👧‍👦 " + p,'user');
        // ici on pourra envoyer à l’API
      });
    });

  } else if(choice.includes("🍰") || choice.toLowerCase().includes("cravings")){
    addMessage(t.askDesire);
    addInput(val=>{
      userDesire = val;
      addMessage("👉 " + val,'user');
      addMessage(t.askPeople);
      addInput(p=>{
        userPeople = p;
        addMessage("👨‍👩‍👧‍👦 " + p,'user');
        // ici on pourra envoyer à l’API
      });
    });

  } else if(choice.includes("🎁") || choice.toLowerCase().includes("surprise")){
    addMessage(t.surprise);

  } else if(choice.includes("Dessert") || choice.includes("Sobremesa") || choice.includes("Postre")){
    userType = "dessert";
    addMessage(t.askDessert);
    addInput(val=>{
      userIngredients = val;
      addMessage("👉 " + val,'user');
      addMessage(t.askPeople);
      addInput(p=>{
        userPeople = p;
        addMessage("👨‍👩‍👧‍👦 " + p,'user');
      });
    });

  } else if(choice.includes("Plat") || choice.includes("Main Dish") || choice.includes("Hauptgericht") || choice.includes("Piatto principale") || choice.includes("Prato Principal") || choice.includes("Plato principal")){
    userType = "plat";
    addMessage(t.askPlat);
    addInput(val=>{
      userIngredients = val;
      addMessage("👉 " + val,'user');
      addMessage(t.askPeople);
      addInput(p=>{
        userPeople = p;
        addMessage("👨‍👩‍👧‍👦 " + p,'user');
      });
    });
  }
}

// 🔥 Initialisation
setLanguage(currentLang);
start();
