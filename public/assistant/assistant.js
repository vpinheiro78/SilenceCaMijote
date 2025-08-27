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
let lastRecipe = null;

// Mots-clés culinaires
const foodKeywords = ["poulet","poisson","chocolat","tomate","pâtes","riz","légume","salade","gâteau","pizza","soupe","fromage","beurre","pain","steak","cake","fruit","épice","poivre","sel"];

// Injecte styles
function injectStyles(){ /* ... inchangé ... */ }

// Header
function updateHeader(){ /* ... inchangé ... */ }

// Messages
function addMessage(text, type='bot'){ /* ... inchangé ... */ }
function addMessageHTML(html, type='bot'){ /* ... inchangé ... */ }

// Input
function addInputField(placeholder, callback){ /* ... inchangé ... */ }

// Choix
function addChoices(options){ /* ... inchangé ... */ }

// Démarrage
function start(){ /* ... inchangé ... */ }

// Gestion des choix
function handleChoice(choice){
  addMessage(choice,'user');
  document.querySelectorAll('.choices').forEach(c=>c.remove());

  if(choice.includes("🍅") || choice.includes("ingredients")){
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
    // Nouveau : demande nombre de personnes pour recette de saison
    askPersons("surprise");
  }
}

// Demander nombre de personnes
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
      sendToOpenAI("envie");
    } else if(type==="ingredients"){
      addMessage(t.confirmIngredients);
      sendToOpenAI("ingredients");
    } else if(type==="surprise"){
      addMessage(t.surprise);
      generateSeasonRecipe();
    }
  });
}

// -------- Recette de saison : récupération + affichage --------
function getSeason(){ /* ... inchangé ... */ }
function stripMarkdown(s){ /* ... inchangé ... */ }
function normalize(s){ /* ... inchangé ... */ }
function parseRecipe(raw){ /* ... inchangé ... */ }
function renderRecipeCard(recipe){ /* ... inchangé ... */ }
function showFollowupOptions(){ /* ... inchangé ... */ }
function escapeHTML(s){ /* ... inchangé ... */ }
function recipePlainText(){ /* ... inchangé ... */ }
function shareWhatsApp(){ /* ... inchangé ... */ }
function saveAsImage(){ /* ... inchangé ... */ }
function copyShoppingList(){ /* ... inchangé ... */ }

// -------- Nouvelle fonction d'envoi pour tous les choix sauf surprise --------
function sendToOpenAI(type){
  addMessage("✨ Génération de la recette… Patientez un instant 🍳");

  let promptMessage = "";
  const personsText = userPersons && !isNaN(userPersons) ? userPersons : 1;

  if(type==="ingredients"){
    promptMessage = `Donne-moi une recette originale pour ${personsText} personne(s) en utilisant uniquement ces ingrédients : ${userIngredients}. Réponds en français, complète, structurée en trois parties : titre, ingrédients avec quantités, préparation étape par étape.`;
  } else if(type==="envie"){
    promptMessage = `Donne-moi une recette originale pour ${personsText} personne(s) correspondant à cette envie : ${userEnvie}. Réponds en français, complète, structurée en trois parties : titre, ingrédients avec quantités, préparation étape par étape.`;
  }

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
        const parsed = parseRecipe(data.reply);
        renderRecipeCard(parsed);
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

// Recette de saison
function generateSeasonRecipe(fromAnotherIdea=false){
  addMessage("✨ Génération de la recette… Patientez un instant 🍳");
  const season = getSeason();
  const personsText = userPersons && !isNaN(userPersons) ? userPersons : 1;
  const promptMessage = `Donne-moi une recette ${season} détaillée pour ${personsText} personne(s), avec sections Ingrédients et Préparation. Réponds en français, complète et structurée.`;

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
        const parsed = parseRecipe(data.reply);
        renderRecipeCard(parsed);
        if(!fromAnotherIdea){
          addMessage("🤔 Cela vous tente ?");
        }
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

// démarrage
start();
