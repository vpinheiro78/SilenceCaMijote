// /public/assistant/assistant.js

document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById("chat");
  const inputContainer = document.getElementById("input-container");

  // --- Helpers pour l'UI ---
  function addMessage(text, sender = "bot") {
    const msg = document.createElement("div");
    msg.className = sender === "bot" ? "bot-message" : "user-message";
    msg.innerHTML = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function addChoices(choices) {
    const container = document.createElement("div");
    container.className = "choices";
    choices.forEach(({ label, value }) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.onclick = () => handleChoice(value);
      container.appendChild(btn);
    });
    chatContainer.appendChild(container);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function addInputField(placeholder, onSubmit) {
    inputContainer.innerHTML = "";

    const textarea = document.createElement("textarea");
    textarea.placeholder = placeholder;
    textarea.className = "big-textarea"; // style plus imposant
    inputContainer.appendChild(textarea);

    const btn = document.createElement("button");
    btn.textContent = "Envoyer";
    btn.onclick = () => {
      const value = textarea.value.trim();
      if (value) {
        addMessage(value, "user");
        inputContainer.innerHTML = "";
        onSubmit(value);
      }
    };
    inputContainer.appendChild(btn);

    textarea.focus();
  }

  // --- Fonction manquante : demander le nombre de personnes ---
  function askPersons(mode, userMessage) {
    addInputField("Pour combien de personnes ?", (value) => {
      const persons = parseInt(value, 10);
      if (!isNaN(persons) && persons > 0) {
        send(userMessage, persons, mode);
      } else {
        addMessage("⚠️ Merci d’indiquer un nombre valide.");
        askPersons(mode, userMessage);
      }
    });
  }

  // --- Envoi au backend ---
  async function send(message, persons = 1, mode = "default") {
    try {
      const response = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, persons, mode })
      });

      const data = await response.json();
      if (data.reply) {
        addMessage(data.reply, "bot");
      } else {
        addMessage("⚠️ Pas de réponse du serveur.");
      }
    } catch (err) {
      console.error(err);
      addMessage("⚠️ Erreur de communication avec le serveur.");
    }
  }

  // --- Gestion des choix principaux ---
  function handleChoice(choice) {
    if (choice === "frigo") {
      addInputField("Quels ingrédients as-tu sous la main ?", (value) => {
        askPersons("frigo", value);
      });
    } else if (choice === "envie") {
      addInputField("Quelle recette te fait envie ? (ex: plat réconfortant, exotique...)", (value) => {
        askPersons("envie", value);
      });
    } else if (choice === "surprise") {
      addMessage("🎁 Super ! Je prépare une surprise culinaire...");
      askPersons("surprise", "Surprends-moi avec une recette originale !");
    }
  }

  // --- Démarrage ---
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
