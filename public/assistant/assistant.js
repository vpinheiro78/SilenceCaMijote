// assistant.js
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const inputContainer = document.getElementById("input-container");

  function addMessage(text, sender = "bot") {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.innerText = text;
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
      btn.onclick = () => handleChoice(opt.value);
      div.appendChild(btn);
    });
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function addInputField(placeholder, callback) {
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

  function askPersons(mode, userMessage) {
    addInputField("Pour combien de personnes ?", (value) => {
      const persons = parseInt(value, 10);
      if (!isNaN(persons) && persons > 0) {
        sendToBackend(userMessage, persons);
      } else {
        addMessage("⚠️ Merci d’indiquer un nombre valide.");
        askPersons(mode, userMessage);
      }
    });
  }

  async function sendToBackend(message, persons = 1) {
    try {
      const res = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, persons })
      });
      const data = await res.json();
      if (data.reply) addMessage(data.reply, "bot");
      else addMessage("⚠️ Pas de réponse du serveur.");
    } catch (err) {
      console.error(err);
      addMessage("⚠️ Erreur de communication avec le serveur.");
    }
  }

  function handleChoice(choice) {
    if (choice === "frigo") {
      addInputField("Quels ingrédients as-tu sous la main ?", (val) => {
        askPersons("frigo", val);
      });
    } else if (choice === "envie") {
      addInputField("Quelle recette te fait envie ? (ex: plat réconfortant, exotique...)", (val) => {
        askPersons("envie", val);
      });
    } else if (choice === "surprise") {
      addMessage("🎁 Super ! Je prépare une surprise culinaire...");
      askPersons("surprise", "Surprends-moi avec une recette originale !");
    }
  }

  function start() {
    addMessage("👨‍🍳 Bonjour ! Je suis Hugo, ton chef virtuel.");
    addMessage("Que veux-tu cuisiner aujourd’hui ?");
    addChoices([
      { label: "🍅 Créer une recette avec ce que j’ai sous la main", value: "frigo" },
      { label: "🍰 Créer une recette selon mes envies", value: "envie" },
      { label: "🎁 Me laisser surprendre", value: "surprise" }
    ]);
  }

  start();
});
