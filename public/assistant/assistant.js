// assistant.js
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const inputContainer = document.getElementById("input-container");

  let userIngredients = [];
  let userEnvie = "";
  let userPersons = 1;
  let userRecipeText = "";
  let usedIngredientsHistory = [];

  // === Fonctions utilitaires ===
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

  // === Barre de progression / sablier ===
  function showPreparationAnimation(callback) {
    const anim = document.createElement("div");
    anim.className = "preparation-animation";
    anim.innerHTML = "⏳ Je vous prépare une recette rien que pour vous…";
    const bar = document.createElement("div");
    bar.style.width = "0%";
    bar.style.height = "6px";
    bar.style.background = "#e67e22";
    bar.style.marginTop = "5px";
    anim.appendChild(bar);
    chat.appendChild(anim);
    chat.scrollTop = chat.scrollHeight;

    let width = 0;
    const interval = setInterval(() => {
      width += 2 + Math.random() * 3;
      if (width >= 100) width = 100;
      bar.style.width = width + "%";
      if (width === 100) {
        clearInterval(interval);
        anim.remove();
        callback();
      }
    }, 50);
  }

  // === Gestion nombre de personnes ===
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

  // === Backend ===
  async function sendToBackend(message) {
    if (!message || message.trim().length === 0) {
      addMessage("⚠️ Message manquant. Merci de préciser vos ingrédients ou envies.");
      return;
    }
    try {
      const res = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, persons: userPersons })
      });
      const data = await res.json();
      if (data.reply) {
        userRecipeText = data.reply;
        usedIngredientsHistory.push(...userIngredients);
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

  // === Formatage Markdown ===
  function formatRecipeForDisplay(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const formatted = [];

    lines.forEach(line => {
      let div;
      if (/^# /.test(line)) { // titre principal
        div = document.createElement("h1");
        div.innerText = line.replace(/^#\s*/, '');
        div.style.fontSize = "28px";
        div.style.fontWeight = "bold";
        div.style.marginBottom = "10px";
      } 
      else if (/^## /.test(line)) { // sous-titre
        div = document.createElement("div");
        div.innerHTML = `<b>${line.replace(/^## /, '')}</b>`;
        div.style.fontSize = "20px";
        div.style.marginTop = "15px";
        div.style.marginBottom = "5px";
      } 
      else if (/^### /.test(line)) { // sous-sous-titre
        div = document.createElement("div");
        div.innerHTML = `<b>${line.replace(/^### /, '')}</b>`;
        div.style.fontSize = "18px";
        div.style.marginTop = "10px";
        div.style.marginBottom = "3px";
      } 
      else if (/^- /.test(line)) { // ingrédients
        div = document.createElement('div');
        div.innerText = line.replace(/^- /, '');
        div.style.marginBottom = "3px";
      } 
      else if (/^\d+/.test(line)) { // étapes
        div = document.createElement('div');
        div.innerText = line.replace(/\*\*/g,'');
        div.style.marginBottom = "5px";
      } 
      else {
        div = document.createElement('p');
        div.innerText = line.replace(/\*\*/g,'');
      }
      formatted.push(div);
    });

    return formatted;
  }

  // === Feedback ===
  function offerFeedback() {
    addChoices([
      { label: "👍 Top ! Merci, je vais essayer", action: satisfied },
      { label: "🔄 As-tu autre chose à me proposer ?", action: repeatRecipe },
      { label: "✏️ Changer mes ingrédients ou envies", action: modifyInputs }
    ]);
  }

  // === Téléchargement et partage ===
  function satisfied() {
    addMessage("Top ! 😄 Tu peux télécharger ou partager ta recette.");
    const div = document.createElement("div");
    div.className = "choices";
    chat.appendChild(div);

    // Télécharger
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "choice-btn";
    downloadBtn.innerText = "⬇️ Télécharger ma recette";
    downloadBtn.onclick = () => downloadRecipe(userRecipeText);
    div.appendChild(downloadBtn);

    // WhatsApp
    const whatsappBtn = document.createElement("button");
    whatsappBtn.className = "choice-btn";
    whatsappBtn.innerText = "💬 Partager sur WhatsApp";
    whatsappBtn.onclick = () => {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(userRecipeText)}`;
      window.open(url, "_blank");
    };
    div.appendChild(whatsappBtn);
  }

  function downloadRecipe(recipeText) {
    if (!recipeText) return;
    const tempDiv = document.createElement("div");
    tempDiv.style.padding = "20px";
    tempDiv.style.background = "#fff8f0";
    tempDiv.style.borderRadius = "15px";
    tempDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempDiv.style.width = "600px";
    tempDiv.style.position = "absolute"; 
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    // logo
    const logo = document.createElement("img");
    logo.src = "assistant/logo.png";
    logo.style.width = "80px";
    logo.style.display = "block";
    logo.style.marginBottom = "10px";
    tempDiv.appendChild(logo);

    // titre
    const titre = document.createElement("h1");
    titre.innerText = recipeText.split("\n")[0].replace(/^#\s*/, '');
    titre.style.fontSize = "28px";
    titre.style.fontWeight = "bold";
    titre.style.marginBottom = "10px";
    tempDiv.appendChild(titre);

    // contenu ingrédients & préparation
    const lines = recipeText.split("\n").map(l => l.trim()).filter(Boolean);
    let inIngredients = false, inPreparation = false;

    lines.forEach(line => {
      if (/ingrédients/i.test(line)) { inIngredients = true; inPreparation = false; return; }
      if (/préparation/i.test(line)) { inPreparation = true; inIngredients = false; return; }

      if (inIngredients && line.startsWith('- ')) {
        const card = document.createElement('span');
        card.className = 'ingredient-card';
        card.style.display = 'inline-block';
        card.style.background = '#ffe6d1';
        card.style.padding = '8px 12px';
        card.style.margin = '5px';
        card.style.borderRadius = '10px';
        card.style.fontWeight = 'bold';
        card.style.fontSize = '0.95em';
        card.innerText = line.replace(/^- /, '');
        tempDiv.appendChild(card);
      } 
      else if (inPreparation && /^\d+/.test(line)) {
        const divEtape = document.createElement('div');
        divEtape.className = 'etape-card';
        divEtape.style.background = '#fff3e0';
        divEtape.style.borderRadius = '12px';
        divEtape.style.marginBottom = '15px';
        divEtape.style.padding = '15px';
        divEtape.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        const match = line.match(/^(\d+)\. (.*)/);
        if (match) {
          divEtape.innerHTML = `<span class="etape-num" style="display:inline-block;background:#e67e22;color:white;font-weight:bold;border-radius:50%;width:30px;height:30px;line-height:30px;text-align:center;margin-right:10px;">${match[1]}</span> <p>${match[2].replace(/\*\*/g,'')}</p>`;
        } else { divEtape.innerText = line.replace(/\*\*/g,''); }
        tempDiv.appendChild(divEtape);
      }
    });

    function capture(element){
      html2canvas(element, { useCORS: true, scale: 2 }).then(canvas => {
        const img = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = img;
        a.download = 'ma_recette.png';
        a.click();
        element.remove();
      }).catch(err => { console.error("Erreur capture:", err); element.remove(); });
    }

    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => capture(tempDiv);
      document.body.appendChild(script);
    } else { capture(tempDiv); }
  }

  // === Répéter ou modifier ===
  function repeatRecipe() {
    addMessage("🔄 Je te prépare une nouvelle suggestion ... 🍳");
    const msg = userIngredients.length ? `Recette avec ${userIngredients.join(", ")}` : userEnvie;
    askPersons(msg);
  }

  function modifyInputs() {
    addChoices([
      { label: "Modifier les ingrédients", action: () => {
        addInputField("Quels ingrédients veux-tu changer ?", val => {
          userIngredients = val.split(",").map(s => s.trim());
          addMessage("Je vous prépare une nouvelle recette rien que pour vous... 🍳");
          const msg = `Recette avec ${userIngredients.join(", ")}` + (userEnvie ? `, type: ${userEnvie}` : "");
          askPersons(msg);
        });
      }},
      { label: "Modifier l'envie / type de recette", action: () => handleChoice("envie") }
    ]);
  }

  // === Choix principal ===
  function handleChoice(choice) {
    if (choice === "frigo") {
      addInputField("Quels ingrédients as-tu sous la main ? (séparés par des virgules)", val => {
        userIngredients = val.split(",").map(s => s.trim());
        const msg = `Recette avec ${userIngredients.join(", ")}`;
        askPersons(msg);
      });
    } else if (choice === "envie") {
      addChoices([
        { label: "Plat rapide", action: () => { userEnvie="rapide et sain"; askPersons(userEnvie); } },
        { label: "Plat familial", action: () => { userEnvie="plat réconfortant"; askPersons(userEnvie); } },
        { label: "Exotique", action: () => { userEnvie="exotique"; askPersons(userEnvie); } },
        { label: "Végétarien", action: () => { userEnvie="végétarien"; askPersons(userEnvie); } },
        { label: "Festif", action: () => { userEnvie="festif"; askPersons(userEnvie); } },
        { label: "Écrire mes envies", action: () => addInputField("Décris ce qui te fait envie...", val => { userEnvie=val; askPersons(userEnvie); }) }
      ]);
    } else if (choice === "surprise") {
      showPreparationAnimation(() => sendToBackend("Surprends-moi avec une recette originale !"));
    }
  }

  // === Démarrage ===
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
