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
    askIngredients: "Qu’avez-vous sous la main ? (ex: tomates, riz, poulet…)",
    askDesire: "Parlez-moi de vos envies culinaires 😋. Donnez le maximum de détails (ex: un dessert au chocolat, un plat épicé aux légumes…)",
    askPeople: "Pour combien de personnes souhaitez-vous cette recette ? 👨‍👩‍👧‍👦",
    surprise: "✨ Ta-daa ! Voici une idée de saison rien que pour vous…"
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
    askIngredients: "What do you have on hand? (e.g. tomatoes, rice, chicken…)",
    askDesire: "Tell me about your cravings 😋. Give as many details as possible (e.g. a chocolate dessert, a spicy veggie dish…)",
    askPeople: "For how many people should I create this recipe? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! A seasonal recipe just for you…"
  },
  es: {
    title: "👨‍🍳 Tu Chef Virtual",
    subtitle: "Estoy aquí para imaginar recetas únicas y personalizadas contigo. ¡Entra en el universo gourmet 2.0 donde TÚ eres el protagonista! ✨",
    greeting: "Hola 👋, soy Hugo, tu Chef Virtual. ¿Cómo puedo sorprenderte hoy? 😋",
    options: [
      "🍅 Crear una receta con lo que tengo",
      "🍰 Crear una receta según mis antojos",
      "🎁 Sorpréndeme con una receta de temporada"
    ],
    askIngredients: "¿Qué tienes a mano? (ej: tomates, arroz, pollo…)",
    askDesire: "Cuéntame tus antojos culinarios 😋. Da el máximo de detalles (ej: un postre de chocolate, un plato picante con verduras…)",
    askPeople: "¿Para cuántas personas quieres la receta? 👨‍👩‍👧‍👦",
    surprise: "✨ ¡Tachán! Aquí tienes una idea de temporada solo para ti…"
  },
  it: {
    title: "👨‍🍳 Il tuo Chef Virtuale",
    subtitle: "Sono qui per immaginare con te ricette uniche e personalizzate. Entra nell’universo gourmet 2.0 dove TU sei il protagonista! ✨",
    greeting: "Ciao 👋, sono Hugo, il tuo Chef Virtuale! Come posso deliziarti oggi? 😋",
    options: [
      "🍅 Crea una ricetta con quello che ho",
      "🍰 Crea una ricetta in base alle mie voglie",
      "🎁 Sorprendimi con una ricetta di stagione"
    ],
    askIngredients: "Cosa hai a disposizione? (es: pomodori, riso, pollo…)",
    askDesire: "Parlami delle tue voglie culinarie 😋. Dai più dettagli possibili (es: un dolce al cioccolato, un piatto speziato di verdure…)",
    askPeople: "Per quante persone desideri la ricetta? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Un’idea di stagione solo per te…"
  },
  pt: {
    title: "👨‍🍳 Seu Chef Virtual",
    subtitle: "Estou aqui para imaginar receitas únicas e personalizadas com você. Entre no universo gourmet 2.0 onde VOCÊ é a estrela! ✨",
    greeting: "Olá 👋, sou Hugo, seu Chef Virtual! Como posso te encantar hoje? 😋",
    options: [
      "🍅 Criar uma receita com o que eu tenho",
      "🍰 Criar uma receita de acordo com meus desejos",
      "🎁 Surpreenda-me com uma receita da estação"
    ],
    askIngredients: "O que você tem em casa? (ex: tomates, arroz, frango…)",
    askDesire: "Fale-me dos seus desejos culinários 😋. Dê o máximo de detalhes (ex: uma sobremesa de chocolate, um prato apimentado com legumes…)",
    askPeople: "Para quantas pessoas devo criar a receita? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Uma ideia de temporada só para você…"
  },
  de: {
    title: "👨‍🍳 Dein Virtueller Koch",
    subtitle: "Ich bin hier, um mit dir einzigartige und personalisierte Rezepte zu kreieren. Tritt ein in die Gourmetwelt 2.0, in der DU der Star bist! ✨",
    greeting: "Hallo 👋, ich bin Hugo, dein Virtueller Koch! Womit darf ich dich heute verwöhnen? 😋",
    options: [
      "🍅 Ein Rezept mit dem, was ich habe",
      "🍰 Ein Rezept nach meinen Wünschen",
      "🎁 Überrasche mich mit einem saisonalen Rezept"
    ],
    askIngredients: "Was hast du zur Verfügung? (z. B. Tomaten, Reis, Huhn…)",
    askDesire: "Erzähl mir von deinen kulinarischen Wünschen 😋. Gib so viele Details wie möglich (z. B. ein Schokoladendessert, ein würziges Gemüsegericht…)",
    askPeople: "Für wie viele Personen soll das Rezept sein? 👨‍👩‍👧‍👦",
    surprise: "✨ Voilà! Eine saisonale Idee nur für dich…"
  }
};

// Sélection du bon jeu de textes
const t = texts[currentLang] || texts['fr'];

// Variables pour stocker les réponses utilisateur
let userAnswers = {
  ingredients: null,
  desire: null,
  people: null
};

const chat = document.getElementById('chat');
const container = document.getElementById('assistantContainer');

// 🔥 Mise à jour du header
function updateHeader() {
  document.getElementById('title').innerText = t.title;
  document.getElementById('subtitle').innerText = t.subtitle;
}

function addMessage(text, type = 'bot') {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addChoices(options) {
  const div = document.createElement('div');
  div.className = 'choices';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerText = opt;
    btn.onclick = () => handleChoice(opt);
    div.appendChild(btn);
  });
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addInput(question, key) {
  addMessage(question);
  const wrapper = document.createElement('div');
  wrapper.className = 'input-wrapper';

  const textarea = document.createElement('textarea');
  textarea.className = 'chat-input';
  textarea.rows = 2;
  textarea.placeholder = "";

  const btn = document.createElement('button');
  btn.innerText = "OK ✅";
  btn.className = 'send-btn';

  btn.onclick = () => {
    const val = textarea.value.trim();
    if (!val) return;
    userAnswers[key] = val;
    addMessage(val, 'user');
    wrapper.remove();

    if (key === 'ingredients' || key === 'desire') {
      addInput(t.askPeople, 'people');
    }
  };

  wrapper.appendChild(textarea);
  wrapper.appendChild(btn);
  chat.appendChild(wrapper);
  textarea.focus();
  chat.scrollTop = chat.scrollHeight;
}

function start() {
  updateHeader();
  addMessage(t.greeting);
  addChoices(t.options);
  container.classList.add('show');
}

function handleChoice(choice) {
  addMessage(choice, 'user');
  document.querySelectorAll('.choices').forEach(c => c.remove());

  if (choice.includes("🍅") || choice.includes("ingredients")) {
    addInput(t.askIngredients, 'ingredients');

  } else if (choice.includes("🍰") || choice.includes("cravings")) {
    addInput(t.askDesire, 'desire');

  } else if (choice.includes("🎁") || choice.includes("Surprise")) {
    addMessage(t.surprise);
  }
}

// démarrage
start();
