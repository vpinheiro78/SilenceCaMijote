// assistant.js – Hugo 2.0
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const inputContainer = document.getElementById("input-container");

  let userIngredients = [];
  let userEnvie = "";
  let userPersons = 1;
  let userRecipeText = "";
  let usedIngredientsHistory = [];

  function addMessage(content, sender = "bot") {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    if (Array.isArray(content)) {
      content.forEach(c => div.appendChild(c));
    } else {
      div.innerHTML = content;
    }
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function addChoices(options) {
    const div = document.createElement("div");
    div.className = "choices";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.innerText = opt.label;
      btn.onclick = () => {
        div.remove();
        opt.action();
      };
      div.appendChild(btn);
    });
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function addInputField(placeholder, callback, multiple = false) {
    inputContainer.innerHTML = "";
    const textarea = document.createElement("textarea");
    textarea.placeholder = placeholder;
    textarea.className = "big-textarea";
    inputContainer.appendChild(textarea);

    const btn = document.createElement("button");
    btn.innerText = "Envoyer";
    btn.className = "send-btn";
    btn.onclick = () => {
      const value = textarea.value.trim();
      if (value) {
        addMessage(value, "user");
        inputContainer.innerHTML = "";
        callback(value);
      }
    };
    inputContainer.appendChild(btn);
    textarea.focus();
  }

  function confirmIngredients(callback) {
    const list = userIngredients.join(", ");
    addMessage(`Parfait ! Donc tu as : ${list}. Veux-tu ajouter autre chose ? 🥕🍗🥦`);
    addChoices([
      { label: "Oui, ajouter d'autres ingrédients", action: () => askIngredients(callback) },
      { label: "Non, c'est tout", action: () => askPersons(callback) }
    ]);
  }

  function askIngredients(callback) {
    addInputField("Quels ingrédients as-tu sous la main ? (séparés par des virgules)", (val) => {
      const newIngredients = val.split(",").map(i => i.trim()).filter(Boolean);
      userIngredients.push(...newIngredients);
      confirmIngredients(callback);
    });
  }

  function askPersons(callbackMessage) {
    addInputField("Pour combien de personnes ?", (value) => {
      const persons = parseInt(value, 10);
      if (!isNaN(persons) && persons > 0) {
        userPersons = persons;
        showPreparationAnimation(() => sendToBackend(callbackMessage));
      } else {
        addMessage("⚠️ Merci d’indiquer un nombre valide.");
        askPersons(callbackMessage);
      }
    });
  }

  function askEnvie(callback) {
    addChoices([
      { label: "Plat rapide", action: () => callback("rapide et sain") },
      { label: "Plat familial", action: () => callback("plat réconfortant") },
      { label: "Exotique", action: () => callback("exotique") },
      { label: "Végétarien", action: () => callback("végétarien") },
      { label: "Festif", action: () => callback("festif") }
    ]);
  }

  function showPreparationAnimation(callback) {
    const anim = document.createElement("div");
    anim.className = "preparation-animation";
    anim.innerText = "👨‍🍳 Hugo prépare votre recette…";
    chat.appendChild(anim);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
      anim.remove();
      callback();
    }, 1500 + Math.random() * 1000);
  }

  async function sendToBackend(message) {
    try {
      const res = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, persons: userPersons })
      });
      const data = await res.json();
      if (data.reply) {
        userRecipeText = data.reply;
        // Enregistrement des ingrédients utilisés pour éviter répétitions
        userIngredients.forEach(i => { if (!usedIngredientsHistory.includes(i)) usedIngredientsHistory.push(i); });
        const formatted = formatRecipeForDisplay(data.reply);
        addMessage(formatted, "bot");
        offerFeedback();
      } else {
        addMessage("⚠️ Pas de réponse du serveur.");
      }
    } catch (err) {
      console.error(err);
      addMessage("⚠️ Erreur de communication avec le serveur.");
    }
  }

  function formatRecipeForDisplay(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const formatted = [];
    lines.forEach(line => {
      let div;
      if (/^# /.test(line)) {
        div = document.createElement("h1");
        div.innerText = line.replace(/^# /, '');
        div.style.fontSize = "28px";
        div.style.fontWeight = "bold";
        div.style.marginBottom = "10px";
      } else if (/^## /.test(line)) {
        div = document.createElement("div");
        div.innerHTML = `<b>${line.replace(/^## /, '')}</b>`;
        div.style.fontSize = "20px";
        div.style.marginTop = "15px";
        div.style.marginBottom = "5px";
      } else if (/^- /.test(line)) {
        div = document.createElement('div');
        div.innerText = line.replace(/^- /, '');
        div.style.marginBottom = "3px";
      } else if (/^\d+/.test(line)) {
        div = document.createElement('div');
        div.innerText = line.replace(/\*\*/g,'');
        div.style.marginBottom = "5px";
      } else {
        div = document.createElement('p');
        div.innerText = line.replace(/\*\*/g,'');
      }
      formatted.push(div);
    });
    return formatted;
  }

  function offerFeedback() {
    addChoices([
      { label: "👍 Top ! Merci, je vais essayer", action: satisfied },
      { label: "🔄 As-tu autre chose à me proposer ?", action: repeatRecipe },
      { label: "✏️ Changer mes ingrédients ou envies", action: modifyInputs },
      { label: "💡 Variante rapide", action: () => repeatRecipe("rapide et sain") },
      { label: "🍽 Version végétarienne", action: () => repeatRecipe("végétarien") }
    ]);
  }

  function satisfied() {
    addMessage("Top ! Je suis ravi 😄. Tu peux télécharger ou partager ta recette.");
    // Télécharger et WhatsApp restent inchangés, comme ton code actuel
    // ...
  }

  function repeatRecipe(style = "") {
    addMessage("Je te prépare une nouvelle suggestion ... 🍳");
    let msg = style ? `Recette ${style} avec ${userIngredients.join(", ")}` : (userIngredients.join(", ") || userEnvie);
    sendToBackend(msg);
  }

  function modifyInputs() {
    addChoices([
      { label: "Modifier les ingrédients", action: () => askIngredients((msg) => sendToBackend(msg)) },
      { label: "Modifier l'envie / type de recette", action: () => askEnvie((val) => {
          userEnvie = val;
          askPersons(userEnvie);
      }) }
    ]);
  }

  function handleChoice(choice) {
    if (choice === "frigo") askIngredients((msg) => askPersons(msg));
    else if (choice === "envie") askEnvie((val) => {
      userEnvie = val;
      askPersons(userEnvie);
    });
    else if (choice === "surprise") {
      addMessage("🎁 Super ! Je prépare une surprise culinaire...");
      askPersons("Surprends-moi avec une recette originale !");
    }
  }

  function start() {
    addMessage("👨‍🍳 Bonjour ! Je suis Hugo, ton chef virtuel.");
    addMessage("Que veux-tu cuisiner aujourd’hui ?");
    addChoices([
      { label: "🍅 Avec ce que j’ai sous la main", action: () => handleChoice("frigo") },
      { label: "🍰 Selon mes envies", action: () => handleChoice("envie") },
      { label: "🎁 Me laisser surprendre", action: () => handleChoice("surprise") }
    ]);
  }

  start();
});
