// assistant.js

// Langue héritée automatiquement depuis index.html
let currentLang = localStorage.getItem('siteLang') || 'fr';

// 🔥 Textes multilingues
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
    askCustom: "Super ! Décrivez-moi votre envie (ex: tarte aux pommes, curry épicé…) :",
    askPeople: "Pour combien de personnes devons-nous prévoir ce délice ? 👨‍👩‍👧‍👦",
    askDessert: "Parfait 😍 ! Quel est l’ingrédient vedette (chocolat, fruit…) ?",
    askPlat: "Super ! Vous préférez à base de viande 🥩 ou de poisson 🐟 ?",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Plat",
    sendBtn: "Envoyer"
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
    askCustom: "Great! Describe your craving (e.g. apple pie, spicy curry…):",
    askPeople: "For how many people should I prepare this delight? 👨‍👩‍👧‍👦",
    askDessert: "Perfect 😍! What’s the star ingredient (chocolate, fruit…)?",
    askPlat: "Great! Do you prefer meat 🥩 or fish 🐟?",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Main Dish",
    sendBtn: "Send"
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "Estoy aquí para imaginar contigo recetas únicas y personalizadas. ¡Entra en el universo gourmet 2.0 donde tú eres el protagonista! ✨",
    greeting: "Hola 👋, soy Hugo, tu Chef Virtual. ¿Cómo puedo deleitarte hoy? 😋",
    options: [
      "🍅 Crear una receta con mis ingredientes",
      "🍰 Crear una receta según mis antojos",
      "🎁 Sorpréndeme con una receta de temporada"
    ],
    askIngredients: "Dime los ingredientes principales 🥕🍗🍫 :",
    askType: "¿Quieres un postre 🍰 o un plato 🍽️?",
    askCustom: "¡Genial! Describe tu antojo (ej: tarta de manzana, curry picante…):",
    askPeople: "¿Para cuántas personas debo preparar esta delicia? 👨‍👩‍👧‍👦",
    askDessert: "¡Perfecto 😍! ¿Cuál es el ingrediente estrella (chocolate, fruta…)?",
    askPlat: "¡Genial! ¿Prefieres carne 🥩 o pescado 🐟?",
    surprise: "✨ ¡Tachán! Aquí tienes una idea de temporada solo para ti…",
    dessertBtn: "🍰 Postre",
    platBtn: "🍽️ Plato",
    sendBtn: "Enviar"
  },
  it: {
    title: "👨‍🍳 Il tuo Chef Virtuale",
    subtitle: "Sono qui per immaginare con te ricette uniche e personalizzate. Entra nell’universo gourmet 2.0 dove tu sei il protagonista! ✨",
    greeting: "Ciao 👋, sono Hugo, il tuo Chef Virtuale! Come posso deliziarti oggi? 😋",
    options: [
      "🍅 Crea una ricetta con i miei ingredienti",
      "🍰 Crea una ricetta secondo i miei desideri",
      "🎁 Sorprendimi con una ricetta di stagione"
    ],
    askIngredients: "Dimmi gli ingredienti principali 🥕🍗🍫 :",
    askType: "Vuoi un dessert 🍰 o un piatto 🍽️?",
    askCustom: "Perfetto! Descrivimi il tuo desiderio (es: torta di mele, curry piccante…):",
    askPeople: "Per quante persone devo preparare questa delizia? 👨‍👩‍👧‍👦",
    askDessert: "Perfetto 😍! Qual è l’ingrediente principale (cioccolato, frutta…)?",
    askPlat: "Ottimo! Preferisci carne 🥩 o pesce 🐟?",
    surprise: "✨ Ta-daa! Ecco un’idea di stagione solo per te…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Piatto",
    sendBtn: "Invia"
  },
  pt: {
    title: "👨‍🍳 O Seu Chef Virtual",
    subtitle: "Estou aqui para imaginar consigo receitas únicas e personalizadas. Entre no universo gourmet 2.0 onde VOCÊ é o protagonista! ✨",
    greeting: "Olá 👋, eu sou o Hugo, o seu Chef Virtual! Como posso deliciá-lo hoje? 😋",
    options: [
      "🍅 Criar uma receita com os meus ingredientes",
      "🍰 Criar uma receita de acordo com os meus desejos",
      "🎁 Surpreenda-me com uma receita da estação"
    ],
    askIngredients: "Diga-me os ingredientes principais 🥕🍗🍫 :",
    askType: "Prefere uma sobremesa 🍰 ou um prato 🍽️?",
    askCustom: "Perfeito! Descreva o seu desejo (ex: tarte de maçã, caril picante…):",
    askPeople: "Para quantas pessoas devo preparar esta delícia? 👨‍👩‍👧‍👦",
    askDessert: "Ótimo 😍! Qual é o ingrediente principal (chocolate, fruta…)?",
    askPlat: "Maravilha! Prefere carne 🥩 ou peixe 🐟?",
    surprise: "✨ Tcharan! Aqui está uma ideia da estação só para você…",
    dessertBtn: "🍰 Sobremesa",
    platBtn: "🍽️ Prato",
    sendBtn: "Enviar"
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Koch",
    subtitle: "Ich bin hier, um mit dir einzigartige und personalisierte Rezepte zu kreieren. Tritt ein in die Gourmet-Welt 2.0, in der DU der Star bist! ✨",
    greeting: "Hallo 👋, ich bin Hugo, dein virtueller Koch! Wie darf ich dich heute verwöhnen? 😋",
    options: [
      "🍅 Ein Rezept mit meinen Zutaten erstellen",
      "🍰 Ein Rezept nach meinen Wünschen erstellen",
      "🎁 Überrasche mich mit einem saisonalen Rezept"
    ],
    askIngredients: "Nenne mir die Hauptzutaten 🥕🍗🍫 :",
    askType: "Möchtest du ein Dessert 🍰 oder ein Hauptgericht 🍽️?",
    askCustom: "Super! Beschreibe deinen Wunsch (z.B. Apfelkuchen, scharfes Curry…):",
    askPeople: "Für wie viele Personen soll ich dieses Gericht zubereiten? 👨‍👩‍👧‍👦",
    askDessert: "Perfekt 😍! Was ist die Hauptzutat (Schokolade, Obst…)?",
    askPlat: "Toll! Bevorzugst du Fleisch 🥩 oder Fisch 🐟?",
    surprise: "✨ Voilà! Eine saisonale Idee nur für dich…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Hauptgericht",
    sendBtn: "Senden"
  }
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

// Variables pour stocker les réponses
let userIngredients = "";
let userCustom = "";
let userPeople = "";

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

// 🔥 Fonction mise à jour du header
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

// 🔥 Champ de saisie stylisé façon bulle de chat
function addInput(placeholder, callback){
  const wrapper = document.createElement('div');
  wrapper.className = "message user input-wrapper";

  const input = document.createElement('input');
  input.type = "text";
  input.placeholder = placeholder;
  input.className = "chat-input";

  const btn = document.createElement('button');
  btn.innerText = t.sendBtn;
  btn.className = "send-btn";

  btn.onclick = ()=>{
    if(input.value.trim()!==""){
      const val = input.value.trim();
      wrapper.remove();
      addMessage(val,'user');
      callback(val);
    }
  };

  wrapper.appendChild(input);
  wrapper.appendChild(btn);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
  input.focus();
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

  if(choice.includes("🍅") || choice.includes("ingredients") || choice.includes("ingredientes") || choice.includes("ingredienti") || choice.includes("Zutaten")){
    addMessage(t.askIngredients);
    addInput(t.askIngredients, (val)=>{
      userIngredients = val;
      addMessage(t.askPeople);
      addInput(t.askPeople,(val)=> userPeople = val);
    });

  } else if(choice.includes("🍰") || choice.includes("cravings") || choice.includes("antojos") || choice.includes("desideri") || choice.includes("Wünschen")){
    addMessage(t.askType);
    addChoices([t.dessertBtn, t.platBtn]);

  } else if(choice.includes("🎁") || choice.includes("Surprise") || choice.includes("Sorpréndeme") || choice.includes("Sorprendimi") || choice.includes("Überrasche")){
    addMessage(t.surprise);

  } else if(choice.includes("Dessert") || choice.includes("Postre") || choice.includes("Dolce") || choice.includes("Dessert")){
    addMessage(t.askCustom);
    addInput(t.askCustom, (val)=>{
      userCustom = val;
      addMessage(t.askPeople);
      addInput(t.askPeople,(val)=> userPeople = val);
    });

  } else if(choice.includes("Plat") || choice.includes("Main Dish") || choice.includes("Plato") || choice.includes("Piatto") || choice.includes("Hauptgericht")){
    addMessage(t.askCustom);
    addInput(t.askCustom, (val)=>{
      userCustom = val;
      addMessage(t.askPeople);
      addInput(t.askPeople,(val)=> userPeople = val);
    });
  }
}

// 🚀 démarrage
start();
