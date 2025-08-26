// assistant.js

// Langue héritée automatiquement depuis index.html
let currentLang = localStorage.getItem('siteLang') || 'fr';

// Textes multilingues
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
    askDesire: "Parlez-moi de vos envies (ex: un dessert au chocolat, un plat épicé…) :",
    askPersons: "Pour combien de personnes souhaitez-vous cette recette ? 👨‍👩‍👧‍👦",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
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
    askDesire: "Tell me your cravings (e.g., a chocolate dessert, a spicy chicken dish…) :",
    askPersons: "For how many people should I make this recipe? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "Estoy aquí para imaginar recetas únicas y personalizadas contigo. ¡Entra en el universo gourmet 2.0 donde TÚ eres el protagonista! ✨",
    greeting: "Hola 👋, soy Hugo, tu Chef Virtual. ¿Cómo puedo sorprenderte hoy? 😋",
    options: [
      "🍅 Crear una receta con mis ingredientes",
      "🍰 Crear una receta según mis antojos",
      "🎁 Sorpréndeme con una receta de temporada"
    ],
    askIngredients: "Dime los ingredientes principales 🥕🍗🍫 :",
    askDesire: "Cuéntame tus antojos (ej: un postre de chocolate, un plato picante…) :",
    askPersons: "¿Para cuántas personas quieres esta receta? 👨‍👩‍👧‍👦",
    surprise: "✨ ¡Tachán! Aquí tienes una idea de temporada solo para ti…",
  },
  it: {
    title: "👨‍🍳 Il tuo Chef Virtuale",
    subtitle: "Sono qui per immaginare ricette uniche e personalizzate con te. Entra nell’universo gourmet 2.0 dove TU sei il protagonista! ✨",
    greeting: "Ciao 👋, sono Hugo, il tuo Chef Virtuale! Come posso deliziarti oggi? 😋",
    options: [
      "🍅 Crea una ricetta con i miei ingredienti",
      "🍰 Crea una ricetta secondo i miei desideri",
      "🎁 Sorprendimi con una ricetta di stagione"
    ],
    askIngredients: "Dimmi gli ingredienti principali 🥕🍗🍫 :",
    askDesire: "Parlami dei tuoi desideri (es: un dolce al cioccolato, un piatto speziato…) :",
    askPersons: "Per quante persone vuoi questa ricetta? 👨‍👩‍👧‍👦",
    surprise: "✨ Ta-daa! Ecco un’idea di stagione solo per te…",
  },
  pt: {
    title: "👨‍🍳 Seu Chef Virtual",
    subtitle: "Estou aqui para imaginar receitas únicas e personalizadas com você. Entre no universo gourmet 2.0 onde VOCÊ é a estrela! ✨",
    greeting: "Olá 👋, sou Hugo, seu Chef Virtual! Como posso te encantar hoje? 😋",
    options: [
      "🍅 Criar uma receita com meus ingredientes",
      "🍰 Criar uma receita de acordo com meus desejos",
      "🎁 Surpreenda-me com uma receita da estação"
    ],
    askIngredients: "Diga-me os ingredientes principais 🥕🍗🍫 :",
    askDesire: "Fale-me dos seus desejos (ex: uma sobremesa de chocolate, um prato apimentado…) :",
    askPersons: "Para quantas pessoas você quer esta receita? 👨‍👩‍👧‍👦",
    surprise: "✨ Tcharam! Aqui está uma ideia da estação só para você…",
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Koch",
    subtitle: "Ich bin hier, um mit dir einzigartige und personalisierte Rezepte zu kreieren. Tritt ein in das Gourmet-Universum 2.0, in dem DU der Star bist! ✨",
    greeting: "Hallo 👋, ich bin Hugo, dein virtueller Koch! Wie kann ich dich heute verwöhnen? 😋",
    options: [
      "🍅 Ein Rezept mit meinen Zutaten erstellen",
      "🍰 Ein Rezept nach meinen Wünschen erstellen",
      "🎁 Überrasche mich mit einem saisonalen Rezept"
    ],
    askIngredients: "Sag mir deine Hauptzutaten 🥕🍗🍫 :",
    askDesire: "Erzähl mir von deinen Wünschen (z.B. ein Schokoladendessert, ein würziges Hähnchengericht…) :",
    askPersons: "Für wie viele Personen soll ich das Rezept machen? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Eine saisonale Idee nur für dich…",
  }
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let recipeData = {
  ingredients: "",
  desire: "",
  persons: ""
};

// 🔥 Mise à jour header
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

function addInput(placeholder, callback){
  const div = document.createElement('div');
  div.className = 'message user input-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.className = 'chat-input';

  const sendBtn = document.createElement('button');
  sendBtn.innerText = "➤";
  sendBtn.className = 'send-btn';

  sendBtn.onclick = ()=>{
    if(input.value.trim() !== ""){
      addMessage(input.value,'user');
      div.remove();
      callback(input.value.trim());
    }
  };

  div.appendChild(input);
  div.appendChild(sendBtn);
  chat.appendChild(div);
  input.focus();
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

  if(choice.includes("🍅") || choice.includes("ingredients")){
    addMessage(t.askIngredients);
    addInput("...", val=>{
      recipeData.ingredients = val;
      addMessage(t.askPersons);
      addInput("...", p=>{
        recipeData.persons = p;
        console.log("👉 Recette data:", recipeData);
      });
    });

  } else if(choice.includes("🍰") || choice.includes("cravings")){
    addMessage(t.askDesire);
    addInput("...", val=>{
      recipeData.desire = val;
      addMessage(t.askPersons);
      addInput("...", p=>{
        recipeData.persons = p;
        console.log("👉 Recette data:", recipeData);
      });
    });

  } else if(choice.includes("🎁") || choice.includes("Surprise")){
    addMessage(t.surprise);
  }
}

// 🚀 Démarrage
start();
