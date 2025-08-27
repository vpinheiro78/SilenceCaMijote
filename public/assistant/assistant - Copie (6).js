// assistant.js

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
    askDessert: "Parfait 😍 ! Décrivez votre envie de dessert (ex: chocolat, fruit…) :",
    askPlat: "Super ! Décrivez votre envie de plat (viande, poisson, pâtes…) :",
    askPeople: "Pour combien de personnes voulez-vous la recette ? 👨‍👩‍👧‍👦",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Plat",
    inputPlaceholder: "Écrivez ici..."
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
    askDessert: "Perfect 😍! Describe your dessert craving (chocolate, fruit…) :",
    askPlat: "Great! Describe your dish craving (meat, fish, pasta…) :",
    askPeople: "For how many people should I make the recipe? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Main Dish",
    inputPlaceholder: "Type here..."
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "Estoy aquí para imaginar recetas únicas y personalizadas contigo. ¡Entra en el universo gourmet 2.0 donde TÚ eres la estrella! ✨",
    greeting: "Hola 👋, soy Hugo, tu Chef Virtual! ¿Cómo puedo deleitarte hoy? 😋",
    options: [
      "🍅 Crear una receta con mis ingredientes",
      "🍰 Crear una receta según mis antojos",
      "🎁 Sorpréndeme con una receta de temporada"
    ],
    askIngredients: "Dime los ingredientes principales 🥕🍗🍫 :",
    askType: "¿Quieres un postre 🍰 o un plato 🍽️?",
    askDessert: "¡Perfecto 😍! Describe tu postre deseado (chocolate, fruta…) :",
    askPlat: "¡Genial! Describe tu plato deseado (carne, pescado, pasta…) :",
    askPeople: "¿Para cuántas personas preparo la receta? 👨‍👩‍👧‍👦",
    surprise: "✨ ¡Ta-daa! Una receta de temporada solo para ti…",
    dessertBtn: "🍰 Postre",
    platBtn: "🍽️ Plato",
    inputPlaceholder: "Escribe aquí..."
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
    askType: "Hai voglia di un dolce 🍰 o di un piatto 🍽️?",
    askDessert: "Perfetto 😍! Descrivi il tuo dolce desiderato (cioccolato, frutta…) :",
    askPlat: "Ottimo! Descrivi il tuo piatto desiderato (carne, pesce, pasta…) :",
    askPeople: "Per quante persone preparo la ricetta? 👨‍👩‍👧‍👦",
    surprise: "✨ Ta-daa! Una ricetta di stagione solo per te…",
    dessertBtn: "🍰 Dolce",
    platBtn: "🍽️ Piatto",
    inputPlaceholder: "Scrivi qui..."
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
    askType: "Você quer uma sobremesa 🍰 ou um prato 🍽️?",
    askDessert: "Perfeito 😍! Descreva sua sobremesa desejada (chocolate, fruta…) :",
    askPlat: "Ótimo! Descreva seu prato desejado (carne, peixe, massa…) :",
    askPeople: "Para quantas pessoas preparo a receita? 👨‍👩‍👧‍👦",
    surprise: "✨ Ta-daa! Uma receita da estação só para você…",
    dessertBtn: "🍰 Sobremesa",
    platBtn: "🍽️ Prato",
    inputPlaceholder: "Escreva aqui..."
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Koch",
    subtitle: "Ich bin hier, um mit dir einzigartige und personalisierte Rezepte zu kreieren. Tauche ein in die Gourmet-2.0-Welt, in der DU der Star bist! ✨",
    greeting: "Hallo 👋, ich bin Hugo, dein Virtueller Koch! Wie kann ich dich heute verwöhnen? 😋",
    options: [
      "🍅 Ein Rezept mit meinen Zutaten erstellen",
      "🍰 Ein Rezept nach meinen Wünschen erstellen",
      "🎁 Überrasche mich mit einem saisonalen Rezept"
    ],
    askIngredients: "Sag mir die Hauptzutaten 🥕🍗🍫 :",
    askType: "Möchtest du ein Dessert 🍰 oder ein Hauptgericht 🍽️?",
    askDessert: "Perfekt 😍! Beschreibe dein Wunschdessert (Schokolade, Obst…) :",
    askPlat: "Super! Beschreibe dein Wunschgericht (Fleisch, Fisch, Pasta…) :",
    askPeople: "Für wie viele Personen soll ich das Rezept machen? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Ein saisonales Rezept nur für dich…",
    dessertBtn: "🍰 Dessert",
    platBtn: "🍽️ Hauptgericht",
    inputPlaceholder: "Schreibe hier..."
  }
};

const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

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

// 🆕 champ de saisie stylé comme bulle de chat
function addInputField(placeholder, callback){
  const wrapper = document.createElement('div');
  wrapper.className = 'message user input-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder || t.inputPlaceholder;
  input.className = 'chat-input';
  
  const sendBtn = document.createElement('button');
  sendBtn.innerText = "➤";
  sendBtn.className = 'send-btn';

  sendBtn.onclick = ()=> {
    if(input.value.trim() !== ""){
      addMessage(input.value, 'user');
      wrapper.remove();
      callback(input.value.trim());
    }
  };

  input.addEventListener("keypress", (e)=>{
    if(e.key === "Enter" && input.value.trim() !== ""){
      sendBtn.click();
    }
  });

  wrapper.appendChild(input);
  wrapper.appendChild(sendBtn);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
}

// reste identique
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

let userIngredients = "";
let userCraving = "";
let userPeople = "";

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
    addInputField(t.inputPlaceholder, (val)=>{
      userIngredients = val;
      addMessage(t.askPeople);
      addInputField(t.inputPlaceholder, (people)=>{
        userPeople = people;
        addMessage("✅ Merci, j’ai toutes les infos ! (API bientôt)");
      });
    });

  } else if(choice.includes("🍰") || choice.includes("cravings")){
    addMessage(t.askType);
    addChoices([t.dessertBtn, t.platBtn]);

  } else if(choice.includes("🎁") || choice.includes("Surprise")){
    addMessage(t.surprise);

  } else if(choice.includes("Dessert") || choice.includes("Dolce") || choice.includes("Postre") || choice.includes("Sobremesa")){
    addMessage(t.askDessert);
    addInputField(t.inputPlaceholder, (val)=>{
      userCraving = val;
      addMessage(t.askPeople);
      addInputField(t.inputPlaceholder, (people)=>{
        userPeople = people;
        addMessage("✅ Merci, j’ai toutes les infos ! (API bientôt)");
      });
    });

  } else if(choice.includes("Plat") || choice.includes("Main Dish") || choice.includes("Plato") || choice.includes("Piatto") || choice.includes("Prato") || choice.includes("Hauptgericht")){
    addMessage(t.askPlat);
    addInputField(t.inputPlaceholder, (val)=>{
      userCraving = val;
      addMessage(t.askPeople);
      addInputField(t.inputPlaceholder, (people)=>{
        userPeople = people;
        addMessage("✅ Merci, j’ai toutes les infos ! (API bientôt)");
      });
    });
  }
}

start();
