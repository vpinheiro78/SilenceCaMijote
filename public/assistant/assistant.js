// assistant.js
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const inputContainer = document.getElementById("input-container");

  let userIngredients = "";
  let userEnvie = "";
  let userPersons = 1;
  let userRecipeText = ""; // texte complet pour téléchargement

  function addMessage(text, sender = "bot") {
    const div = document.createElement("div");
    div.className = `message ${sender}`;

    if (Array.isArray(text)) {
      text.forEach(t => div.appendChild(t));
    } else {
      div.innerText = text;
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
        addMessage("Je te concocte une recette rien que pour toi ... 🍳");
        sendToBackend(callbackMessage);
      } else {
        addMessage("⚠️ Merci d’indiquer un nombre valide.");
        askPersons(callbackMessage);
      }
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
        div = document.createElement('h1');
        div.innerText = line.replace(/^# /, '');
      } else if (/^## /.test(line)) {
        div = document.createElement('h2');
        div.innerText = line.replace(/^## /, '');
      } else if (/^- /.test(line)) {
        div = document.createElement('span');
        div.className = 'ingredient-card';
        div.innerText = line.replace(/^- /, '');
      } else if (/^\d+\. /.test(line)) {
        div = document.createElement('div');
        div.className = 'etape-card';
        const match = line.match(/^(\d+)\.\s+(.*)/);
        div.innerHTML = `<span class="etape-num">${match[1]}</span> <p>${match[2]}</p>`;
      } else {
        div = document.createElement('p');
        div.innerText = line;
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
    addMessage("Top ! Je suis ravi 😄. Tu peux télécharger ou partager ta recette.");

    const div = document.createElement("div");
    div.className = "choices";
    chat.appendChild(div);

    // Télécharger
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "choice-btn";
    downloadBtn.innerText = "⬇️ Télécharger ma recette";
    downloadBtn.onclick = async () => {
      const tempDiv = document.createElement("div");
      tempDiv.style.padding = "20px";
      tempDiv.style.background = "#fff8f0";
      tempDiv.style.borderRadius = "15px";
      tempDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      tempDiv.innerHTML = `<img src="logo.png" alt="Logo" style="width:80px;margin-bottom:10px;">` +
                          userRecipeText.replace(/^# (.*)$/gm, '$1')
                                        .replace(/^## (.*)$/gm, '$1')
                                        .replace(/^- (.*)$/gm, '$1')
                                        .replace(/^\d+\. (.*)$/gm, '<div class="etape-card"><p>$1</p></div>');

      if(!window.html2canvas){
        const script=document.createElement('script');
        script.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload=()=>capture(tempDiv);
        document.body.appendChild(script);
      } else {
        capture(tempDiv);
      }
    };
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

    function capture(element){
      html2canvas(element).then(canvas=>{
        const img=canvas.toDataURL('image/png');
        const a=document.createElement('a');
        a.href=img;
        a.download='ma_recette.png';
        a.click();
      });
    }
  }

  function repeatRecipe() {
    addMessage("Je te prépare une nouvelle suggestion ... 🍳");
    if (userIngredients) sendToBackend(userIngredients);
    else if (userEnvie) sendToBackend(userEnvie);
  }

  function modifyInputs() {
    addChoices([
      { label: "Modifier les ingrédients", action: () => {
          addInputField("Quels ingrédients veux-tu changer ?", val => {
            userIngredients = val;
            addMessage("Je te concocte une nouvelle recette ... 🍳");
            sendToBackend(userIngredients);
          });
      }},
      { label: "Modifier l'envie / type de recette", action: () => {
          addInputField("Quelles envies veux-tu modifier ?", val => {
            userEnvie = val;
            addMessage("Je te concocte une nouvelle recette ... 🍳");
            sendToBackend(userEnvie);
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
      addInputField("Quelle recette te fait envie ? (ex: plat réconfortant, exotique...)", val => {
        userEnvie = val;
        askPersons(userEnvie);
      });
    } else if (choice === "surprise") {
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
