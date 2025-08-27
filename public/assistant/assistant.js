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
    subtitle: "😅 For now, I only speak French!",
    greeting: "😅 For now, I only speak French!",
    options: [],
    askIngredients: "",
    askEnvie: "",
    askPersons: "",
    confirmEnvie: "",
    confirmIngredients: "",
    surprise: "",
    invalidNumber: "",
    invalidInput: ""
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "😅 ¡Por el momento, solo hablo francés!",
    greeting: "😅 ¡Por el momento, solo hablo francés!",
    options: [],
    askIngredients: "",
    askEnvie: "",
    askPersons: "",
    confirmEnvie: "",
    confirmIngredients: "",
    surprise: "",
    invalidNumber: "",
    invalidInput: ""
  },
  it: {
    title: "👨‍🍳 Il tuo Chef Virtuale",
    subtitle: "😅 Per ora parlo solo francese!",
    greeting: "😅 Per ora parlo solo francese!",
    options: [],
    askIngredients: "",
    askEnvie: "",
    askPersons: "",
    confirmEnvie: "",
    confirmIngredients: "",
    surprise: "",
    invalidNumber: "",
    invalidInput: ""
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Koch",
    subtitle: "😅 Im Moment spreche ich nur Französisch!",
    greeting: "😅 Im Moment spreche ich nur Französisch!",
    options: [],
    askIngredients: "",
    askEnvie: "",
    askPersons: "",
    confirmEnvie: "",
    confirmIngredients: "",
    surprise: "",
    invalidNumber: "",
    invalidInput: ""
  }
};

const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let userIngredients = "";
let userEnvie = "";
let userPersons = "";

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
      if(!foodKeywords.some(k=>val.toLowerCase().includes(k))){
        addMessage(t.invalidInput);
        addInputField(t.askIngredients, arguments.callee);
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
        addInputField(t.askEnvie, arguments.callee);
        return;
      }
      userEnvie = val;
      askPersons("envie");
    });

  } else if(choice.includes("🎁") || choice.includes("Surprise")){
    addMessage("✨ Génération de la recette… Patientez un instant 🍳");

    // Déterminer la saison actuelle
    const month = new Date().getMonth(); // 0 = janvier
    let season = "";
    switch(month){
      case 11: case 0: case 1: season = "hiver"; break;
      case 2: case 3: case 4: season = "printemps"; break;
      case 5: case 6: case 7: season = "été"; break;
      case 8: case 9: case 10: season = "automne"; break;
    }

    const promptMessage = `Donne-moi une recette ${season} détaillée pour 1 personne`;

    fetch("/.netlify/functions/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: promptMessage })
    })
    .then(res => res.text())
    .then(text => {
      try {
        const data = JSON.parse(text);
        if(data.reply){
          addMessage(data.reply);
        } else {
          addMessage("⚠️ Oups, réponse serveur vide.");
        }
      } catch(e){
        console.error("Erreur JSON:", e, text);
        addMessage("⚠️ Réponse serveur invalide.");
      }
    })
    .catch(err=>{
      console.error(err);
      addMessage("⚠️ Erreur serveur, réessayez plus tard.");
    });
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
