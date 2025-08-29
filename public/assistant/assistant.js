let userRecipeText = "";
let liveInterval;

function addMessage(text, sender = "assistant") {
  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// --- Effet "Hugo cuisine en live" ---
function showLiveCooking() {
  const chat = document.getElementById("chat");
  const live = document.createElement("div");
  live.className = "message assistant live-cooking";
  live.innerHTML = `
    <span>👨‍🍳 Hugo est en cuisine...</span>
    <span class="dots"><span>.</span><span>.</span><span>.</span></span>
  `;
  live.id = "liveCooking";
  chat.appendChild(live);
  chat.scrollTop = chat.scrollHeight;
}

// Supprimer l'effet "cuisine en live"
function removeLiveCooking() {
  const live = document.getElementById("liveCooking");
  if (live) live.remove();
}

// Simulation de génération d’une recette
async function generateRecipe(prompt) {
  showLiveCooking();

  // Simulation délai API
  await new Promise(resolve => setTimeout(resolve, 2500));

  removeLiveCooking();

  // Recette fictive
  userRecipeText = `# Poulet aux légumes 🌿🍗

## Ingrédients
- 2 blancs de poulet
- 1 courgette
- 1 poivron rouge
- 1 tomate
- Huile d’olive, sel, poivre

## Préparation
1. Coupez le poulet en dés et les légumes en morceaux.
2. Faites revenir le poulet avec un filet d’huile.
3. Ajoutez les légumes, assaisonnez et laissez mijoter 15 min.
4. Servez chaud avec du riz ou des pommes de terre sautées.`;

  addMessage(userRecipeText, "assistant");
  satisfied();
}

// --- Fin de recette : actions (télécharger, partager) ---
function satisfied() {
  addMessage("Top ! Je suis ravi 😄. Tu peux télécharger ou partager ta recette.");

  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "choices";
  chat.appendChild(div);

  // Télécharger
  const downloadBtn = document.createElement("button");
  downloadBtn.className = "choice-btn";
  downloadBtn.innerText = "⬇️ Télécharger ma recette";
  downloadBtn.onclick = () => {
    const tempDiv = document.createElement("div");
    tempDiv.style.padding = "20px";
    tempDiv.style.background = "#fff8f0";
    tempDiv.style.borderRadius = "15px";
    tempDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempDiv.style.width = "600px";
    tempDiv.style.position = "absolute"; 
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    // titre
    const titre = document.createElement("h1");
    titre.innerText = userRecipeText.split("\n")[0].replace(/^#\s*/, '');
    titre.style.fontSize = "28px";
    titre.style.fontWeight = "bold";
    titre.style.marginBottom = "10px";
    tempDiv.appendChild(titre);

    // ingrédients + préparation
    const lines = userRecipeText.split("\n").map(l => l.trim()).filter(Boolean);
    let inIngredients = false, inPreparation = false;

    lines.forEach(line => {
      if (/ingrédients/i.test(line)) { inIngredients = true; inPreparation = false; return; }
      if (/préparation/i.test(line)) { inPreparation = true; inIngredients = false; return; }

      if (inIngredients && line.startsWith('- ')) {
        const card = document.createElement('span');
        card.style.display = 'inline-block';
        card.style.background = '#ffe6d1';
        card.style.padding = '8px 12px';
        card.style.margin = '5px';
        card.style.borderRadius = '10px';
        card.style.fontWeight = 'bold';
        card.innerText = line.replace(/^- /, '');
        tempDiv.appendChild(card);
      } 
      else if (inPreparation && /^\d+/.test(line)) {
        const divEtape = document.createElement('div');
        divEtape.style.background = '#fff3e0';
        divEtape.style.borderRadius = '12px';
        divEtape.style.marginBottom = '15px';
        divEtape.style.padding = '15px';
        divEtape.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        divEtape.innerText = line;
        tempDiv.appendChild(divEtape);
      }
    });

    // capture avec html2canvas
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
  };
  div.appendChild(downloadBtn);

  // Partager WhatsApp
  const whatsappBtn = document.createElement("button");
  whatsappBtn.className = "choice-btn";
  whatsappBtn.innerText = "💬 Partager sur WhatsApp";
  whatsappBtn.onclick = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(userRecipeText)}`;
    window.open(url, "_blank");
  };
  div.appendChild(whatsappBtn);
}

// Simulation : bouton test
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", () => {
    generateRecipe("Poulet aux légumes");
  });
});
