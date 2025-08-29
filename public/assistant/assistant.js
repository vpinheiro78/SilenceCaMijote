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

  function showPreparationAnimation(callbackMessage) {
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
      if (width < 100) {
        width += 0.3; // progression douce
        bar.style.width = width + "%";
      } else {
        clearInterval(interval);
        setTimeout(() => {
          anim.remove();
          sendToBackend(callbackMessage);
        }, 300);
      }
    }, 50);
  }

  function startPreparation(callbackMessage) {
    showPreparationAnimation(callbackMessage);
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
      } 
      else if (/^## /.test(line)) { 
        div = document.createElement("div");
        div.innerHTML = `<b>${line.replace(/^## /, '')}</b>`;
        div.style.fontSize = "20px";
        div.style.marginTop = "15px";
        div.style.marginBottom = "5px";
      } 
      else if (/^### /.test(line)) { 
        div = document.createElement("div");
        div.innerHTML = `<b>${line.replace(/^### /, '')}</b>`;
        div.style.fontSize = "18px";
        div.style.marginTop = "10px";
        div.style.marginBottom = "3px";
      } 
      else if (/^- /.test(line)) { 
        div = document.createElement('div');
        div.innerText = line.replace(/^- /, '');
        div.style.marginBottom = "3px";
      } 
      else if (/^\d+/.test(line)) { 
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

  function offerFeedback() {
    addChoices([
      { label: "👍 Top ! Merci, je vais essayer", action: satisfied },
      { label: "🔄 As-tu autre chose à me proposer ?", action: repeatRecipe },
      { label: "✏️ Changer mes ingrédients ou envies", action: modifyInputs }
    ]);
  }

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
    const tempDiv = document.createElement("div");
    tempDiv.style.padding = "20px";
    tempDiv.style.background = "#fff8f0";
    tempDiv.style.borderRadius = "15px";
    tempDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempDiv.style.width = "600px";
    tempDiv.style.position = "absolute"; 
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const logo = document.createElement("img");
    logo.src = "assistant/logo.png";
    logo.style.width = "80px";
    logo.style.display = "block";
    logo.style.marginBottom = "10px";
    tempDiv.appendChild(logo);

    const titre = document.createElement("h1");
    titre.innerText = userRecipeText.split("\n")[0].replace(/^#\s*/, '');
    titre.style.fontSize = "28px";
    titre.style.fontWeight = "bold";
    titre.style.marginBottom = "10px";
    tempDiv.appendChild(titre);

    const lines = userRecipeText.split("\n").map(l => l.trim()).filter(Boolean);
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
