// assistant.js

// Langue héritée automatiquement depuis index.html
let currentLang = localStorage.getItem('siteLang') || 'fr';

// Dictionnaire multilingue
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
    askIngredients: "Parlez-moi de ce que vous avez sous la main 🥕🍗🍫 (ex: tomates, riz, poulet...) :",
    askDesire: "Parlez-moi de vos envies (ex: un dessert au chocolat, un plat épicé…) :",
    askPeople: "Pour combien de personnes souhaitez-vous cette recette ? 👨‍👩‍👧‍👦",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    sendBtn: "➤ Envoyer"
  },
  en: {
    title: "👨‍🍳 Your Virtual Chef",
    subtitle: "I’m here to imagine unique and personalized recipes with you. Step into the gourmet 2.0 universe where YOU are the star! ✨",
    greeting: "Hello 👋, I’m Hugo, your Virtual Chef! How can I delight you today? 😋",
    options: [
      "🍅 Create a recipe with what I have at home",
      "🍰 Create a recipe based on my cravings",
      "🎁 Surprise me with a seasonal recipe"
    ],
    askIngredients: "Tell me what you have at home 🥕🍗🍫 (ex: tomatoes, rice, chicken...):",
    askDesire: "Tell me about your cravings (ex: a chocolate dessert, a spicy dish…):",
    askPeople: "For how many people should I prepare this recipe? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    sendBtn: "➤ Send"
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "Estoy aquí para imaginar recetas únicas y personalizadas contigo. ¡Entra en el universo gourmet 2.0 donde TÚ eres el protagonista! ✨",
    greeting: "Hola 👋, soy Hugo, tu Chef Virtual! ¿Cómo puedo deleitarte hoy? 😋",
    options: [
      "🍅 Crear una receta con lo que tengo en casa",
      "🍰 Crear una receta según mis antojos",
      "🎁 Sorpréndeme con una receta de temporada"
    ],
    askIngredients: "Cuéntame qué tienes en casa 🥕🍗🍫 (ej: tomates, arroz, pollo...):",
    askDesire: "Háblame de tus antojos (ej: un postre de chocolate, un plato picante…):",
    askPeople: "¿Para cuántas personas preparo la receta? 👨‍👩‍👧‍👦",
    surprise: "✨ ¡Voilà! Una receta de temporada solo para ti…",
    sendBtn: "➤ Enviar"
  },
  it: {
    title: "👨‍🍳 Il tuo Chef Virtuale",
    subtitle: "Sono qui per immaginare con te ricette uniche e personalizzate. Entra nell’universo gourmet 2.0 dove TU sei il protagonista! ✨",
    greeting: "Ciao 👋, sono Hugo, il tuo Chef Virtuale! Come posso deliziarti oggi? 😋",
    options: [
      "🍅 Crea una ricetta con quello che ho a casa",
      "🍰 Crea una ricetta in base ai miei desideri",
      "🎁 Sorprendimi con una ricetta di stagione"
    ],
    askIngredients: "Dimmi cosa hai a casa 🥕🍗🍫 (es: pomodori, riso, pollo...):",
    askDesire: "Parlami dei tuoi desideri (es: un dolce al cioccolato, un piatto speziato…):",
    askPeople: "Per quante persone devo preparare questa ricetta? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Una ricetta di stagione solo per te…",
    sendBtn: "➤ Invia"
  },
  pt: {
    title: "👨‍🍳 O Seu Chef Virtual",
    subtitle: "Estou aqui para imaginar receitas únicas e personalizadas com você. Entre no universo gourmet 2.0 onde VOCÊ é a estrela! ✨",
    greeting: "Olá 👋, sou Hugo, o seu Chef Virtual! Como posso encantar você hoje? 😋",
    options: [
      "🍅 Criar uma receita com o que tenho em casa",
      "🍰 Criar uma receita de acordo com os meus desejos",
      "🎁 Surpreenda-me com uma receita da estação"
    ],
    askIngredients: "Diga-me o que você tem em casa 🥕🍗🍫 (ex: tomates, arroz, frango...):",
    askDesire: "Fale-me dos seus desejos (ex: uma sobremesa de chocolate, um prato picante…):",
    askPeople: "Para quantas pessoas devo preparar a receita? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Uma receita da estação só para você…",
    sendBtn: "➤ Enviar"
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Koch",
    subtitle: "Ich bin hier, um mit dir einzigartige und personalisierte Rezepte zu kreieren. Tritt ein in die Gourmet-2.0-Welt, in der DU der Star bist! ✨",
    greeting: "Hallo 👋, ich bin Hugo, dein Virtueller Koch! Wie kann ich dich heute verwöhnen? 😋",
    options: [
      "🍅 Ein Rezept mit dem erstellen, was ich zu Hause habe",
      "🍰 Ein Rezept nach meinen Wünschen erstellen",
      "🎁 Überrasche mich mit einem saisonalen Rezept"
    ],
    askIngredients: "Erzähl mir, was du zu Hause hast 🥕🍗🍫 (z.B.: Tomaten, Reis, Huhn...):",
    askDesire: "Erzähl mir von deinen Wünschen (z.B.: ein Schokoladendessert, ein würziges Gericht…):",
    askPeople: "Für wie viele Personen soll ich das Rezept vorbereiten? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Ein saisonales Rezept nur für dich…",
    sendBtn: "➤ Senden"
  }
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let userIngredients = "";
let userDesire = "";
let userPeople = "";

// 🔥 Fonction mise à jour du titre et sous-titre
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

// Champ de saisie style bulle de chat
function addInput(callback){
  const wrapper = document.createElement('div');
  wrapper.className = "message user-input";

  const input = document.createElement('input');
  input.type = "text";
  input.className = "chat-input";
  input.placeholder = ""; // pas de placeholder pour un style clean

  const send = document.createElement('button');
  send.className = "send-btn";
  send.innerText = t.sendBtn;

  send.onclick = ()=>{
    if(input.value.trim() !== ""){
      const val = input.value.trim();
      chat.removeChild(wrapper);
      addMessage(val,'user');
      callback(val);
    }
  };

  input.addEventListener("keypress",(e)=>{
    if(e.key === "Enter"){
      send.click();
    }
  });

  wrapper.appendChild(input);
  wrapper.appendChild(send);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
  input.focus();
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
    addInput((val)=>{
      userIngredients = val;
      addMessage(t.askPeople);
      addInput((val)=>{
        userPeople = val;
        addMessage("👌 Parfait, j’ai tout noté ! (Ingrédients + personnes)");
      });
    });

  } else if(choice.includes("🍰")){
    addMessage(t.askDesire);
    addInput((val)=>{
      userDesire = val;
      addMessage(t.askPeople);
      addInput((val)=>{
        userPeople = val;
        addMessage("👌 Parfait, j’ai tout noté ! (Envie + personnes)");
      });
    });

  } else if(choice.includes("🎁")){
    addMessage(t.surprise);
  }
}

// démarrage
start();
