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
    subtitle: "I’m here to imagine unique and personalized recipes with you. Step into the gourmet 2.0 universe where YOU are the star! ✨",
    greeting: "Hello 👋, I’m Hugo, your Virtual Chef! How can I delight you today? 😋",
    options: [
      "🍅 Create a recipe with what I have",
      "🍰 Create a recipe based on my cravings",
      "🎁 Surprise me with a seasonal recipe"
    ],
    askIngredients: "Tell me what you have at home 🥕🍗🍫 :",
    askEnvie: "Tell me about your cravings (ex: a chocolate dessert, a spicy dish…) 😋 :",
    askPersons: "For how many people do you want to prepare this dish? 👨‍👩‍👧‍👦",
    confirmEnvie: "🍽️ Great, I’ve noted your cravings and the number of guests!",
    confirmIngredients: "🥕 Perfect, I’ve noted your ingredients and how many people you’ll serve!",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    invalidNumber: "⚠️ Please enter a valid number of people (e.g., 2, 4, 6).",
    invalidInput: "🤔 That doesn’t sound like a food craving… let’s try again!"
  },
  // (ajouter es, it, pt, de comme avant si besoin)
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let userIngredients = "";
let userEnvie = "";
let userPersons = "";

// Liste simple de mots-clés culinaires pour filtrer
const foodKeywords = ["poulet","poisson","chocolat","tomate","pâtes","riz","légume","salade","gâteau","pizza","soupe","fromage","beurre","pain","steak","cake","fruit","épice","poivre","sel"];

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

// Champ de saisie style "chat"
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

  if(choice.includes("🍅") || choice.includes("ingredients") || choice.includes("Create a recipe with what I have")){
    addMessage(t.askIngredients);
    addInputField("🥕🍗🍫 ...", (val)=>{
      // Vérification simple
      if(!foodKeywords.some(k=>val.toLowerCase().includes(k))){
        addMessage(t.invalidInput);
        handleChoice(choice); // redemande
        return;
      }
      userIngredients = val;
      askPersons("ingredients");
    });

  } else if(choice.includes("🍰") || choice.includes("cravings")){
    addMessage(t.askEnvie);
    addInputField("🍰🍲 ...", (val)=>{
      if(!foodKeywords.some(k=>val.toLowerCase().includes(k))){
        addMessage(t.invalidInput);
        handleChoice(choice); 
        return;
      }
      userEnvie = val;
      askPersons("envie");
    });

  } else if(choice.includes("🎁") || choice.includes("Surprise")){
    addMessage(t.surprise);
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

// démarrage
start();
