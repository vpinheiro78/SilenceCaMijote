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
  en: { title: "👨‍🍳 Your Virtual Chef", subtitle: "😅 For now, I only speak French!", greeting: "😅 For now, I only speak French!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  es: { title: "👨‍🍳 Tu Chef Virtual", subtitle: "😅 ¡Por el momento, solo hablo francés!", greeting: "😅 ¡Por el momento, solo hablo francés!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  it: { title: "👨‍🍳 Il tuo Chef Virtuale", subtitle: "😅 Per ora parlo solo francese!", greeting: "😅 Per ora parlo solo francese!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  de: { title: "👨‍🍳 Dein Virtueller Koch", subtitle: "😅 Im Moment spreche ich nur Französisch!", greeting: "😅 Im Moment spreche ich nur Französisch!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" },
  pt: { title: "👨‍🍳 Seu Chef Virtual", subtitle: "😅 Por enquanto, só falo francês!", greeting: "😅 Por enquanto, só falo francês!", options: [], askIngredients: "", askEnvie: "", askPersons: "", confirmEnvie: "", confirmIngredients: "", surprise: "", invalidNumber: "", invalidInput: "" }
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

let userIngredients = "";
let userEnvie = "";
let userPersons = "";
let lastRecipe = null; // { title, ingredients[], steps[], season, raw }

// Mots-clés culinaires
const foodKeywords = ["poulet","poisson","chocolat","tomate","pâtes","riz","légume","salade","gâteau","pizza","soupe","fromage","beurre","pain","steak","cake","fruit","épice","poivre","sel"];

// Injecte styles dynamiques pour recette + champ élargi
function injectStyles(){
  if (document.getElementById('assistantDynamicStyles')) return;
  const css = `
  .chat-input {
    width: 100%;
    min-height: 60px;
    resize: vertical;
    border-radius: 12px;
    padding: 12px;
    border: 1px solid #ddd;
    font-size: 1em;
    line-height: 1.4;
    margin-bottom: 8px;
    box-sizing: border-box;
  }
  .input-wrapper {
    display:flex;
    flex-direction:column;
    gap:6px;
    margin-top:10px;
  }
  .send-btn {
    align-self:flex-end;
    background:#e67e22;
    color:white;
    border:none;
    padding:8px 16px;
    border-radius:20px;
    cursor:pointer;
    transition:0.2s;
  }
  .send-btn:hover{ background:#d35400; }
  /* ... styles recette déjà présents ... */
  `;
  const style = document.createElement('style');
  style.id = 'assistantDynamicStyles';
  style.textContent = css;
  document.head.appendChild(style);
}

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

  const input = document.createElement('textarea');
  input.className = 'chat-input';
  input.placeholder = placeholder;

  const btn = document.createElement('button');
  btn.innerText = "Envoyer ➤";
  btn.className = 'send-btn';

  const send = ()=> {
    if(input.value.trim() !== ""){
      callback(input.value.trim());
      wrapper.remove();
    }
  };

  btn.onclick = send;
  input.addEventListener("keypress", (e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); } });

  wrapper.appendChild(input);
  wrapper.appendChild(btn);
  chat.appendChild(wrapper);
  input.focus();
  chat.scrollTop = chat.scrollHeight;
}

function addChoices(options){
  if(!options || !options.length) return;
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
  injectStyles();
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
    addInputField("🥕🍗🍫 ...", (val)=>{
      if(!foodKeywords.some(k=>val.toLowerCase().includes(k))){
        addMessage(t.invalidInput);
        addInputField(t.askIngredients, arguments.callee);
        return;
      }
      userIngredients = val;
      askPersons("ingredients");
    });

  } else if(choice.includes("🍰")){
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

  } else if(choice.includes("🎁")){
    askPersons("surprise");
  }
}

// ... (les fonctions parseRecipe, renderRecipeCard, sendToOpenAI, generateSeasonRecipe, etc. restent identiques à ta version)
// ⚠️ Pas besoin de les réécrire ici : elles fonctionnent déjà bien avec ce flux.

start();
