// assistant.js
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements de base
  const chat = document.getElementById("chat");
  const inputContainer = document.getElementById("input-container");

  // --- Etat global
  let userIngredients = "";
  let userEnvie = "";
  let userPersons = 1;
  let userRecipeText = "";

  // --- Injecter le mini CSS nécessaire (effet live + progress bar)
  (function injectMiniCSS() {
    const style = document.createElement("style");
    style.innerHTML = `
      .message { margin: 10px 0; line-height: 1.5; }
      .message.bot { background:#fff; }
      .choices { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
      .choice-btn, .send-btn { cursor:pointer; border:none; padding:10px 14px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,.08); }
      .choice-btn { background:#fff; }
      .send-btn { background:#e67e22; color:#fff; font-weight:600; }
      .big-textarea { width:100%; min-height:90px; padding:12px; border-radius:10px; border:1px solid #ddd; margin-bottom:8px; }

      /* Effet "Hugo cuisine en live" */
      .live-cooking {
        display:flex; align-items:center; gap:8px; font-style:italic; opacity:.9;
        background:#fffaf4; border:1px solid #ffe5cc; padding:10px 12px; border-radius:12px;
      }
      .live-cooking .dots span { animation: blink 1.4s infinite both; font-size:18px; }
      .live-cooking .dots span:nth-child(2){ animation-delay:.2s; }
      .live-cooking .dots span:nth-child(3){ animation-delay:.4s; }
      @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }

      /* Progress bar */
      .prep-wrap { margin:8px 0 4px; }
      .prep-title { font-size:14px; opacity:.85; margin-bottom:6px; }
      .prep-bar { width:100%; height:6px; background:#eee; border-radius:999px; overflow:hidden; }
      .prep-bar > div { height:100%; width:0%; background:#e67e22; transition:width .12s linear; }

      /* Petites cartes "étape" lors du rendu pour le PNG */
      .png-ingredient { display:inline-block; background:#ffe6d1; padding:8px 12px; margin:5px; border-radius:10px; font-weight:600; }
      .png-step { background:#fff3e0; border-radius:12px; margin-bottom:15px; padding:15px; box-shadow:0 4px 12px rgba(0,0,0,.08); }
      .png-step .num { display:inline-block; background:#e67e22; color:#fff; font-weight:700; border-radius:50%; width:30px; height:30px; line-height:30px; text-align:center; margin-right:10px; }
    `;
    document.head.appendChild(style);
  })();

  // --- UI helpers
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

  // --- Effet "Hugo cuisine en live" + Progression douce + messages patience
  function showLiveCookingUI() {
    // Bulle "Hugo est en cuisine..."
    const live = document.createElement("div");
    live.className = "message bot live-cooking";
    live.id = "liveCooking";
    live.innerHTML = `
      <span>👨‍🍳 Hugo est en cuisine...</span>
      <span class="dots"><span>.</span><span>.</span><span>.</span></span>
    `;
    chat.appendChild(live);

    // Progress bar
    const wrap = document.createElement("div");
    wrap.className = "prep-wrap message bot";
    wrap.id = "prepWrap";
    wrap.innerHTML = `
      <div class="prep-title">⏳ Je prépare pour vous une belle recette...</div>
      <div class="prep-bar"><div id="prepFill"></div></div>
    `;
    chat.appendChild(wrap);
    chat.scrollTop = chat.scrollHeight;

    // Progression douce : monte jusqu'à 92%, termine sur callback
    const fill = wrap.querySelector("#prepFill");
    let width = 0;
    const interval = setInterval(() => {
      if (width < 92) {
        width += 0.25; // douceur
        fill.style.width = width + "%";
      }
    }, 60);

    // Messages de patience
    const patienceMsgs = [
      "Je hache vos ingrédients... 🔪",
      "Je fais mijoter la sauce... 🍲",
      "Je dispose joliment les herbes... 🌿",
    ];
    let pmIdx = 0;
    const patienceInterval = setInterval(() => {
      if (pmIdx < patienceMsgs.length) {
        addMessage(patienceMsgs[pmIdx], "bot");
        pmIdx++;
      } else {
        clearInterval(patienceInterval);
      }
    }, 3500);

    // Nettoyage + fin
    function finish() {
      clearInterval(interval);
      clearInterval(patienceInterval);
      fill.style.width = "100%";
      setTimeout(() => {
        const liveEl = document.getElementById("liveCooking");
        const wrapEl = document.getElementById("prepWrap");
        if (liveEl) liveEl.remove();
        if (wrapEl) wrapEl.remove();
      }, 180);
    }

    return { finish };
  }

  // --- Flow "combien de personnes"
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

  // --- Lancer la préparation (UI + appel backend)
  async function startPreparation(callbackMessage) {
    const prep = showLiveCookingUI(); // affiche UI attente

    try {
      await sendToBackend(callbackMessage); // dès que la recette arrive, on affiche
    } finally {
      // quoi qu'il arrive, on termine l'UI d'attente
      prep.finish();
    }
  }

  // --- Appel backend (Netlify Function)
  async function sendToBackend(message) {
    try {
      const res = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, persons: userPersons })
      });
      const data = await res.json();
      if (data && data.reply) {
        userRecipeText = data.reply;
        const formatted = formatRecipeForDisplay(data.reply);
        addMessage(formatted, "bot");
        offerFeedback();
      } else {
        addMessage("⚠️ Pas de réponse du serveur.", "bot");
      }
    } catch (err) {
      console.error(err);
      addMessage("⚠️ Erreur de communication avec le serveur.", "bot");
    }
  }

  // --- Mise en forme recette (Markdown simple → DOM)
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

  // --- After-recipe actions
  function offerFeedback() {
    addChoices([
      { label: "👍 Top ! Merci, je vais essayer", action: satisfied },
      { label: "🔄 As-tu autre chose à me proposer ?", action: repeatRecipe },
      { label: "✏️ Changer mes ingrédients ou envies", action: modifyInputs }
    ]);
  }

  // --- Télécharger joli PNG + Partage WhatsApp
  function satisfied() {
    addMessage("Top ! Je suis ravi 😄. Tu peux télécharger ou partager ta recette.", "bot");

    const div = document.createElement("div");
    div.className = "choices";
    chat.appendChild(div);

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "choice-btn";
    downloadBtn.innerText = "⬇️ Télécharger ma recette";
    downloadBtn.onclick = downloadRecipePNG;
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

  function downloadRecipePNG() {
    const tempDiv = document.createElement("div");
    tempDiv.style.padding = "20px";
    tempDiv.style.background = "#fff8f0";
    tempDiv.style.borderRadius = "15px";
    tempDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempDiv.style.width = "600px";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    // logo (facultatif : modifie le chemin si besoin)
    const logo = document.createElement("img");
    logo.src = "assistant/logo.png";
    logo.style.width = "80px";
    logo.style.display = "block";
    logo.style.marginBottom = "10px";
    tempDiv.appendChild(logo);

    // titre
    const titre = document.createElement("h1");
    titre.innerText = (userRecipeText.split("\n")[0] || "").replace(/^#\s*/, '');
    titre.style.fontSize = "28px";
    titre.style.fontWeight = "bold";
    titre.style.marginBottom = "10px";
    tempDiv.appendChild(titre);

    // contenu (ingrédients / préparation)
    const lines = userRecipeText.split("\n").map(l => l.trim()).filter(Boolean);
    let inIngredients = false, inPreparation = false;

    lines.forEach(line => {
      if (/^##\s*ingrédients/i.test(line)) { inIngredients = true; inPreparation = false; return; }
      if (/^##\s*préparation/i.test(line)) { inPreparation = true; inIngredients = false; return; }

      if (inIngredients && line.startsWith('- ')) {
        const card = document.createElement('span');
        card.className = 'png-ingredient';
        card.innerText = line.replace(/^- /, '');
        tempDiv.appendChild(card);
      } else if (inPreparation && /^\d+/.test(line)) {
        const step = document.createElement('div');
        step.className = 'png-step';
        const match = line.match(/^(\d+)\.\s?(.*)/);
        if (match) {
          step.innerHTML = `<span class="num">${match[1]}</span> <span>${match[2].replace(/\*\*/g,'')}</span>`;
        } else {
          step.innerText = line.replace(/\*\*/g,'');
        }
        tempDiv.appendChild(step);
      }
    });

    // capture html2canvas
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

  // --- Actions secondaires
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
          addInputField("Quelles envies veux-tu modifier ?", val => {
            userEnvie = val;
            startPreparation(userEnvie);
          });
      }}
    ]);
  }

  // --- Choix init
  function handleChoice(choice) {
    if (choice === "frigo") {
      addInputField("Quels ingrédients as-tu sous la main ?", val => {
        userIngredients = val;
        // petite confirmation ingrédients + possibilité d'ajouter
        addMessage(`Parfait ! Donc tu as : <b>${val}</b>. Veux-tu ajouter autre chose ? (sinon, dis “non”)`);
        addInputField("Ajoute des ingrédients (ou tape “non”)", more => {
          if (more.toLowerCase() !== "non") userIngredients += ", " + more;
          askPersons(userIngredients);
        });
      });
    } else if (choice === "envie") {
      addChoices([
        { label: "🍽 Plat rapide / sain", action: () => { userEnvie = "Plat rapide et sain"; askPersons(userEnvie); }},
        { label: "🍛 Exotique", action: () => { userEnvie = "Exotique"; askPersons(userEnvie); }},
        { label: "🥩 Viande", action: () => { userEnvie = "Plat avec viande"; askPersons(userEnvie); }},
        { label: "🐟 Poisson / fruits de mer", action: () => { userEnvie = "Plat avec poisson"; askPersons(userEnvie); }},
        { label: "🥗 Végétarien", action: () => { userEnvie = "Végétarien"; askPersons(userEnvie); }},
        { label: "📝 Autre (écrire moi)", action: () => addInputField("Décris ton envie (ex: plat réconfortant, sans lactose, mexicain...)", val => { userEnvie = val; askPersons(userEnvie); })}
      ]);
    } else if (choice === "surprise") {
      addMessage("🎁 Super ! Je prépare une surprise culinaire...");
      askPersons("Surprends-moi avec une recette originale !");
    }
  }

  // --- Démarrage
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
