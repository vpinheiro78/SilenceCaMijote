// Langue héritée
let currentLang = localStorage.getItem('siteLang') || 'fr';

const texts = {
  fr: {
    title: "👨‍🍳 Votre Chef Virtuel",
    subtitle: "Entrez dans l’univers gourmand 2.0 où vous êtes l’acteur ! ✨",
    greeting: "Bonjour 👋, je suis Hugo, votre Chef Virtuel !",
    options: ["🍅 Ingrédients sous la main", "🍰 Selon vos envies", "🎁 Surprise de saison"],
    askIngredients: "Dites-moi ce que vous avez sous la main 🥕🍗🍫 :",
    askEnvie: "Parlez-moi de vos envies (ex: un dessert au chocolat, un plat épicé…) 😋 :",
    askPersons: "Pour combien de personnes ? 👨‍👩‍👧‍👦",
    confirmIngredients: "🥕 Super, j’ai noté vos ingrédients et combien vous serez à table !",
    confirmEnvie: "🍽️ Super, j’ai noté vos envies et le nombre d’invités !",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…",
    invalidNumber: "⚠️ Merci d’indiquer un nombre valide de personnes.",
    invalidInput: "🤔 Ça ne ressemble pas à une envie culinaire… essayons encore !"
  },
  en: {
    title: "👨‍🍳 Your Virtual Chef",
    subtitle: "Step into the gourmet 2.0 universe where YOU are the star! ✨",
    greeting: "Hello 👋, I’m Hugo, your Virtual Chef!",
    options: ["🍅 What I have", "🍰 My cravings", "🎁 Seasonal surprise"],
    askIngredients: "Tell me what you have at home 🥕🍗🍫 :",
    askEnvie: "Tell me about your cravings (ex: chocolate dessert, spicy dish…) 😋 :",
    askPersons: "For how many people? 👨‍👩‍👧‍👦",
    confirmIngredients: "🥕 Perfect, noted your ingredients and the number of guests!",
    confirmEnvie: "🍽️ Great, noted your cravings and number of guests!",
    surprise: "✨ Voilà! A seasonal recipe just for you…",
    invalidNumber: "⚠️ Please enter a valid number of people.",
    invalidInput: "🤔 That doesn’t sound like a food craving… try again!"
  }
  // ajouter es, it, pt, de ici
};

const t = texts[currentLang] || texts['fr'];
const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let userIngredients = "", userEnvie = "", userPersons = 0;

// Start assistant
function start() {
  document.getElementById('title').innerText = t.title;
  document.getElementById('subtitle').innerText = t.subtitle;
  addMessage(t.greeting);
  addChoices(t.options);
  container.classList.add('show');
}

function addMessage(text, type='bot') {
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

// Champ style chat
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

  const sendValue = ()=>{
    if(input.value.trim() === "") return;
    callback(input.value.trim());
    wrapper.remove();
  };

  btn.onclick = sendValue;
  input.addEventListener('keypress', e=>{if(e.key==='Enter') sendValue();});

  wrapper.appendChild(input);
  wrapper.appendChild(btn);
  chat.appendChild(wrapper);
  input.focus();
  chat.scrollTop = chat.scrollHeight;
}

function handleChoice(choice){
  addMessage(choice,'user');
  document.querySelectorAll('.choices').forEach(c=>c.remove());

  if(choice.includes("🍅") || choice.toLowerCase().includes("ingredients")){
    addMessage(t.askIngredients);
    addInputField("Écrivez ici ce que vous avez sous la main...", val=>{
      userIngredients = val;
      askPersons("ingredients");
    });

  } else if(choice.includes("🍰") || choice.toLowerCase().includes("cravings")){
    addMessage(t.askEnvie);
    addInputField("Écrivez ici votre envie gourmande...", val=>{
      userEnvie = val;
      askPersons("envie");
    });

  } else if(choice.includes("🎁") || choice.toLowerCase().includes("surprise")){
    addMessage(t.surprise);
  }
}

function askPersons(type){
  addMessage(t.askPersons);
  addInputField("Nombre d'invités...", val=>{
    const num = parseInt(val);
    if(isNaN(num) || num<=0){
      addMessage(t.invalidNumber);
      askPersons(type);
      return;
    }
    userPersons = num;
    addMessage(type==="envie"? t.confirmEnvie : t.confirmIngredients);
    // Ici on pourrait lancer l'API pour générer la recette
  });
}

// Lancement
start();
