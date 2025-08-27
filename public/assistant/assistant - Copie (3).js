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
    askDessert: "Parfait 😍 ! Quel est l’ingrédient vedette (chocolat, fruit…) ?",
    askPlat: "Super ! Vous préférez à base de viande 🥩 ou de poisson 🐟 ?",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Plat"
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
    askDessert: "Perfect 😍! What’s the star ingredient (chocolate, fruit…)?",
    askPlat: "Great! Do you prefer meat 🥩 or fish 🐟?",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Main Dish"
  },
  de: {
    title: "👨‍🍳 Ihr Virtueller Koch",
    subtitle: "Ich bin hier, um gemeinsam mit Ihnen einzigartige und personalisierte Rezepte zu kreieren. Tauchen Sie ein in das Gourmet-2.0-Universum, in dem SIE die Hauptrolle spielen! ✨",
    greeting: "Hallo 👋, ich bin Hugo, Ihr Virtueller Koch! Wie kann ich Sie heute verwöhnen? 😋",
    options: [
      "🍅 Ein Rezept mit meinen Zutaten erstellen",
      "🍰 Ein Rezept nach meinen Wünschen erstellen",
      "🎁 Überraschen Sie mich mit einem saisonalen Rezept"
    ],
    askIngredients: "Nennen Sie mir die Hauptzutaten 🥕🍗🍫 :",
    askType: "Möchten Sie ein Dessert 🍰 oder ein Hauptgericht 🍽️?",
    askDessert: "Perfekt 😍! Was ist die Hauptzutat (Schokolade, Obst…)?",
    askPlat: "Super! Bevorzugen Sie Fleisch 🥩 oder Fisch 🐟?",
    surprise: "✨ Ta-daa! Hier ist eine saisonale Idee nur für Sie…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Hauptgericht"
  },
  it: {
    title: "👨‍🍳 Il tuo Chef Virtuale",
    subtitle: "Sono qui per immaginare con te ricette uniche e personalizzate. Entra nell’universo gourmet 2.0 dove TU sei il protagonista! ✨",
    greeting: "Ciao 👋, sono Hugo, il tuo Chef Virtuale! Come posso deliziarti oggi? 😋",
    options: [
      "🍅 Crea una ricetta con i miei ingredienti",
      "🍰 Crea una ricetta secondo i miei desideri",
      "🎁 Sorprendimi con una ricetta di stagione"
    ],
    askIngredients: "Dimmi gli ingredienti principali 🥕🍗🍫 :",
    askType: "Hai voglia di un dessert 🍰 o di un piatto principale 🍽️?",
    askDessert: "Perfetto 😍! Qual è l’ingrediente principale (cioccolato, frutta…)?",
    askPlat: "Ottimo! Preferisci a base di carne 🥩 o di pesce 🐟?",
    surprise: "✨ Ta-daa! Ecco un’idea stagionale solo per te…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Piatto principale"
  },
  pt: {
    title: "👨‍🍳 Seu Chef Virtual",
    subtitle: "Estou aqui para imaginar receitas únicas e personalizadas com você. Entre no universo gourmet 2.0 onde VOCÊ é o protagonista! ✨",
    greeting: "Olá 👋, eu sou Hugo, seu Chef Virtual! Como posso te deliciar hoje? 😋",
    options: [
      "🍅 Criar uma receita com meus ingredientes",
      "🍰 Criar uma receita conforme meus desejos",
      "🎁 Surpreenda-me com uma receita sazonal"
    ],
    askIngredients: "Diga-me os principais ingredientes 🥕🍗🍫 :",
    askType: "Você prefere uma sobremesa 🍰 ou um prato principal 🍽️?",
    askDessert: "Perfeito 😍! Qual é o ingrediente principal (chocolate, fruta…)?",
    askPlat: "Ótimo! Prefere carne 🥩 ou peixe 🐟?",
    surprise: "✨ Ta-daa! Aqui está uma ideia sazonal só para você…",
    dessertBtn: "🍰 Sobremesa",
    platBtn: "🍽️ Prato Principal"
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "Estoy aquí para imaginar contigo recetas únicas y personalizadas. ¡Entra en el universo gourmet 2.0 donde TÚ eres la estrella! ✨",
    greeting: "Hola 👋, soy Hugo, tu Chef Virtual! ¿Cómo puedo deleitarte hoy? 😋",
    options: [
      "🍅 Crear una receta con mis ingredientes",
      "🍰 Crear una receta según mis deseos",
      "🎁 Sorpréndeme con una receta de temporada"
    ],
    askIngredients: "Dime los ingredientes principales 🥕🍗🍫 :",
    askType: "¿Te apetece un postre 🍰 o un plato principal 🍽️?",
    askDessert: "Perfecto 😍! ¿Cuál es el ingrediente estrella (chocolate, fruta…)?",
    askPlat: "¡Genial! ¿Prefieres carne 🥩 o pescado 🐟?",
    surprise: "✨ Ta-daa! Aquí tienes una idea de temporada solo para ti…",
    dessertBtn: "🍰 Postre",
    platBtn: "🍽️ Plato principal"
  }
};

// Sélection du bon jeu de textes
let t = texts[currentLang] || texts['fr'];

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
  } else if(choice.includes("🍰") || choice.toLowerCase().includes("cravings")){
    addMessage(t.askType);
    addChoices([t.dessertBtn, t.platBtn]);
  } else if(choice.includes("🎁") || choice.toLowerCase().includes("surprise")){
    addMessage(t.surprise);
  } else if(choice.includes("Dessert") || choice.includes("Sobremesa") || choice.includes("Postre")){
    addMessage(t.askDessert);
  } else if(choice.includes("Plat") || choice.includes("Main Dish") || choice.includes("Hauptgericht") || choice.includes("Piatto principale") || choice.includes("Prato Principal") || choice.includes("Plato principal")){
    addMessage(t.askPlat);
  }
}

// 🔥 Initialisation
setLanguage(currentLang);
start();
