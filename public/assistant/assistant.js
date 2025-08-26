// ===============================
// Assistant Virtuel - Multi-langues
// ===============================

// Récupération de la langue sauvegardée ou détection automatique
let currentLang = localStorage.getItem('siteLang') 
  || navigator.language.slice(0, 2) 
  || 'fr';

// Toutes les traductions
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
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "Estoy aquí para imaginar contigo recetas únicas y personalizadas. ¡Entra en el universo gourmet 2.0 donde tú eres el protagonista! ✨",
    greeting: "¡Hola 👋! Soy Hugo, tu Chef Virtual. ¿Cómo puedo sorprenderte hoy? 😋",
    options: [
      "🍅 Crear una receta con mis ingredientes",
      "🍰 Crear una receta según mis antojos",
      "🎁 Sorpréndeme con una receta de temporada"
    ],
    askIngredients: "Dime los ingredientes principales 🥕🍗🍫 :",
    askType: "¿Quieres un postre 🍰 o un plato principal 🍽️?",
    askDessert: "¡Perfecto 😍! ¿Cuál es el ingrediente estrella (chocolate, fruta…)?",
    askPlat: "¡Genial! ¿Prefieres carne 🥩 o pescado 🐟?",
    surprise: "✨ ¡Voilà! Una receta de temporada solo para ti…",
    dessertBtn: "🍰 Postre",
    platBtn: "🍽️ Plato principal"
  },
  it: {
    title: "👨‍🍳 Il Tuo Chef Virtuale",
    subtitle: "Sono qui per immaginare con te ricette uniche e personalizzate. Entra nell’universo gourmet 2.0 dove TU sei il protagonista! ✨",
    greeting: "Ciao 👋, sono Hugo, il tuo Chef Virtuale! Come posso deliziarti oggi? 😋",
    options: [
      "🍅 Crea una ricetta con i miei ingredienti",
      "🍰 Crea una ricetta secondo i miei desideri",
      "🎁 Sorprendimi con una ricetta di stagione"
    ],
    askIngredients: "Dimmi gli ingredienti principali 🥕🍗🍫 :",
    askType: "Vuoi un dessert 🍰 o un piatto principale 🍽️?",
    askDessert: "Perfetto 😍! Qual è l’ingrediente protagonista (cioccolato, frutta…)?",
    askPlat: "Fantastico! Preferisci carne 🥩 o pesce 🐟?",
    surprise: "✨ Voilà! Una ricetta di stagione solo per te…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Piatto principale"
  },
  pt: {
    title: "👨‍🍳 O Seu Chef Virtual",
    subtitle: "Estou aqui para imaginar consigo receitas únicas e personalizadas. Entre no universo gourmet 2.0 onde VOCÊ é a estrela! ✨",
    greeting: "Olá 👋, sou o Hugo, o seu Chef Virtual! Como posso deliciá-lo hoje? 😋",
    options: [
      "🍅 Criar uma receita com os meus ingredientes",
      "🍰 Criar uma receita de acordo com os meus desejos",
      "🎁 Surpreenda-me com uma receita da estação"
    ],
    askIngredients: "Diga-me os ingredientes principais 🥕🍗🍫 :",
    askType: "Prefere uma sobremesa 🍰 ou um prato principal 🍽️?",
    askDessert: "Perfeito 😍! Qual é o ingrediente estrela (chocolate, fruta…)?",
    askPlat: "Ótimo! Prefere carne 🥩 ou peixe 🐟?",
    surprise: "✨ Voilà! Uma receita da estação só para você…",
    dessertBtn: "🍰 Sobremesa",
    platBtn: "🍽️ Prato principal"
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Chef",
    subtitle: "Ich bin hier, um gemeinsam mit dir einzigartige und personalisierte Rezepte zu kreieren. Tauche ein in die Gourmet-Welt 2.0, in der DU die Hauptrolle spielst! ✨",
    greeting: "Hallo 👋, ich bin Hugo, dein virtueller Chef! Wie darf ich dich heute verwöhnen? 😋",
    options: [
      "🍅 Ein Rezept mit meinen Zutaten erstellen",
      "🍰 Ein Rezept nach meinen Wünschen erstellen",
      "🎁 Überrasche mich mit einem saisonalen Rezept"
    ],
    askIngredients: "Nenne mir die Hauptzutaten 🥕🍗🍫 :",
    askType: "Möchtest du ein Dessert 🍰 oder ein Hauptgericht 🍽️?",
    askDessert: "Perfekt 😍! Was ist die Hauptzutat (Schokolade, Obst…)?",
    askPlat: "Super! Bevorzugst du Fleisch 🥩 oder Fisch 🐟?",
    surprise: "✨ Voilà! Ein saisonales Rezept nur für dich…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Hauptgericht"
  }
};

// Choix du pack de traduction
const t = texts[currentLang] || texts['fr'];

// ===============================
// Fonctions utilitaires
// ===============================
function updateHeader() {
  document.getElementById("assistantTitle").innerText = t.title;
  document.getElementById("assistantSubtitle").innerText = t.subtitle;
}

function addMessage(content, sender = "assistant") {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showOptions() {
  const options = t.options.map(opt => `<button class="option">${opt}</button>`).join("");
  addMessage(options, "assistant");
  document.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", () => handleOption(btn.innerText));
  });
}

// ===============================
// Logique conversationnelle
// ===============================
function handleOption(choice) {
  if (choice.includes("ingrédient") || choice.includes("ingrediente") || choice.includes("ingredient")) {
    addMessage(t.askIngredients, "assistant");
  }
  else if (choice.includes("envie") || choice.includes("cravings") || choice.includes("antojos") || choice.includes("desideri") || choice.includes("desejos") || choice.includes("Wünschen")) {
    addMessage(t.askType, "assistant");
    addMessage(
      `<button class="option">${t.dessertBtn}</button> <button class="option">${t.platBtn}</button>`,
      "assistant"
    );
    document.querySelectorAll(".option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.innerText.includes("Dessert") || btn.innerText.includes("Postre") || btn.innerText.includes("Dolce") || btn.innerText.includes("Sobremesa")) {
          addMessage(t.askDessert, "assistant");
        } else {
          addMessage(t.askPlat, "assistant");
        }
      });
    });
  }
  else if (choice.includes("Surpr") || choice.includes("surprise") || choice.includes("Sorpr") || choice.includes("Sorpresa") || choice.includes("Surpre") || choice.includes("Überrasch")) {
    addMessage(t.surprise, "assistant");
  }
}

// ===============================
// Initialisation
// ===============================
window.onload = () => {
  updateHeader();
  addMessage(t.greeting, "assistant");
  showOptions();
};
