document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const inputContainer = document.getElementById("input-container");

  let userIngredients = "";
  let userEnvie = "";
  let userPersons = 1;
  let userRecipeText = "";

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

  function askPersons(callbackMessage) {
    addInputField("Pour combien de personnes ?", (value) => {
      const persons = parseInt(value, 10);
      if (!isNaN(persons) && persons > 0) {
        userPersons = persons;
        startPreparation(callbackMessage);
      } else {
        addMessage("⚠️ Merci d’indiquer un nombre valide.");
        askPersons(callbackMessage);
      }
    });
  }

  // --- Barre de progression douce avec messages de patience ---
  function showPreparationAnimation() {
    return new Promise((resolve) => {
      const anim = document.createElement("div");
      anim.className = "preparation-animation";
      anim.innerHTML = "⏳ Je prépare pour vous une belle recette...";

      const barContainer = document.createElement("div");
      barContainer.style.width = "100%";
      barContainer.style.height = "6px";
      barContainer.style.background = "#eee";
      barContainer.style.marginTop = "5px";

      const bar = document.createElement("div");
      bar.style.width = "0%";
      bar.style.height = "100%";
      bar.style.background = "#e67e22";
      barContainer.appendChild(bar);
      anim.appendChild(barContainer);
      chat.appendChild(anim);
      chat.scrollTop = chat.scrollHeight;

      let width = 0;
      const interval = setInterval(() => {
        if (width < 90) {
          width += 0.2; // progression douce
          bar.style.width = width + "%";
        }
      }, 50);

      // messages de patience
      const messages = [
        "Je hache vos ingrédients... 🔪",
        "Je fais mijoter la sauce... 🍲",
        "Je dispose joliment les épices... 🌿"
      ];
      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        if (msgIndex < messages.length) {
          addMessage(messages[msgIndex]);
          msgIndex++;
        } else {
          clearInterval(msgInterval);
        }
      }, 4000);

      resolve({
        finish: () => {
          clearInterval(interval);
          bar.style.width = "100%";
          anim.remove();
        }
      });
    });
  }

  async function startPreparation(callbackMessage) {
    const prepAnim = await showPreparationAnimation();
    // en parallèle, on lance le fetch
    sendToBackend(callbackMessage).then(() => {
      prepAnim.finish(); // barre complète dès que la recette est prête
    });
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
      } else if (/^### /.test(line)) {
        div = document.createElement("div");
        div.innerHTML = `<b>${line.replace(/^### /, '')}</b>`;
        div.style.fontSize = "18px";
        div.style.marginTop = "10px";
        div.style.marginBottom = "3px";
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
      { label: "✏️ Changer mes ingrédients ou envies", action: modifyInputs }
    ]);
  }

  // Téléchargement / partage
  function satisfied() {
    addMessage("Top ! Je suis ravi 😄. Vous pouvez télécharger ou partager votre recette.");

    const div = document.createElement("div");
    div.className = "choices";
    chat.appendChild(div);

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "choice-btn";
    downloadBtn.innerText = "⬇️ Télécharger ma recette";
    downloadBtn.onclick = downloadRecipe;
    div.appendChild(downloadBtn);

    const whatsappBtn = document.createElement("button");
    whatsappBtn.className = "choice-btn";
    whatsappBtn.innerText = "💬 Partager sur WhatsApp";
    whatsappBtn.onclick = () => {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(userRecipeText)}`;
      window.open(url, "_blank");
    };
    div.appendChild(whatsappBtn);
  }

  function downloadRecipe() {
    const blob = new Blob([userRecipeText], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ma_recette.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function repeatRecipe() {
    addMessage("Je te prépare une nouvelle suggestion ... 🍳");
    if (userIngredients) startPreparation(userIngredients);
    else if (userEnvie) startPreparation(userEnvie);
  }

  function modifyInputs() {
    addChoices([
      { label: "Modifier les ingrédients", action: () => {
          addInputField("Quels ingrédients veux-tu changer ?", val => {
            userIngredients = val;
            startPreparation(userIngredients);
          });
      }},
      { label: "Modifier l'envie / type de recette", action: () => {
          addInputField("Quelles envies voulez-vous modifier ?", val => {
            userEnvie = val;
            startPreparation(userEnvie);
          });
      }}
    ]);
  }

  function handleChoice(choice) {
    if (choice === "frigo") {
      addInputField("Quels ingrédients as-tu sous la main ?", val => {
        userIngredients = val;
        askPersons(userIngredients);
      });
    } else if (choice === "envie") {
      addChoices([
        { label: "🍽 Plat rapide / sain", action: () => { userEnvie = "Plat rapide et sain"; askPersons(userEnvie); }},
        { label: "🍛 Exotique", action: () => { userEnvie = "Exotique"; askPersons(userEnvie); }},
        { label: "🥩 Viande", action: () => { userEnvie = "Plat avec viande"; askPersons(userEnvie); }},
        { label: "🐟 Poisson / fruits de mer", action: () => { userEnvie = "Plat avec poisson"; askPersons(userEnvie); }},
        { label: "🥗 Végétarien", action: () => { userEnvie = "Végétarien"; askPersons(userEnvie); }},
        { label: "📝 Autre / écrire moi", action: () => addInputField("Quelle recette souhaitez-vous ?", val => { userEnvie = val; askPersons(userEnvie); })}
      ]);
    } else if (choice === "surprise") {
      addMessage("🎁 Super ! Je prépare une surprise culinaire...");
      askPersons("Surprends-moi avec une recette originale !");
    }
  }

  function start() {
    addMessage("👨‍🍳 Bonjour ! Je suis Hugo, ton chef virtuel.");
    addMessage("Que voulez-vous cuisiner aujourd’hui ?");
    addChoices([
      { label: "🍅 Avec ce que j’ai sous la main", action: () => handleChoice("frigo") },
      { label: "🍰 Selon mes envies", action: () => handleChoice("envie") },
      { label: "🎁 Me laisser surprendre", action: () => handleChoice("surprise") }
    ]);
  }

  start();
});
