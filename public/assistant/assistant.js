// Fonction pour créer un champ de saisie pour l'utilisateur
function addInputField(questionType) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'user-input-container';

  // Texte explicatif/question
  const label = document.createElement('div');
  label.className = 'input-label';
  label.innerText = questionType === 'ingredients' 
    ? t.askIngredients 
    : questionType === 'cravings' 
      ? t.askCravings 
      : t.askPersons;
  containerDiv.appendChild(label);

  // Input texte
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'user-input';
  input.placeholder = questionType === 'ingredients' 
    ? "Écrivez ici ce que vous avez sous la main..." 
    : questionType === 'cravings' 
      ? "Écrivez ici votre envie gourmande..." 
      : "Nombre d'invités";
  containerDiv.appendChild(input);

  // Bouton validation
  const submitBtn = document.createElement('button');
  submitBtn.innerText = "👌 Envoyer";
  submitBtn.className = 'submit-input-btn';
  submitBtn.onclick = () => {
    const value = input.value.trim();
    if(!value){
      alert("Merci de saisir une réponse valide 😊");
      return;
    }

    // Vérifier si c'est le nombre de personnes
    if(questionType === 'persons'){
      const num = parseInt(value);
      if(isNaN(num) || num <= 0){
        alert("Merci d’indiquer un nombre valide d’invités 😋");
        return;
      }
      userPersons = num; // variable globale
    } else {
      // Sauvegarder le texte libre
      if(questionType === 'ingredients') userIngredients = value;
      if(questionType === 'cravings') userCravings = value;
    }

    addMessage(value, 'user');
    containerDiv.remove();

    // Appeler la prochaine étape du chat selon le flow
    proceedNextStep(questionType);
  };
  containerDiv.appendChild(submitBtn);

  chat.appendChild(containerDiv);
  input.focus();
  chat.scrollTop = chat.scrollHeight;
}

// CSS à ajouter (ou dans votre style global)
const style = document.createElement('style');
style.innerHTML = `
.user-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0;
}
.input-label {
  font-size: 0.95em;
  color: #555;
}
.user-input {
  padding: 12px 15px;
  border-radius: 25px;
  border: 1px solid #e67e22;
  font-size: 1em;
  width: 100%;
  max-width: 500px;
  outline: none;
}
.user-input::placeholder {
  color: #d35400;
  font-style: italic;
}
.submit-input-btn {
  align-self: flex-end;
  padding: 8px 14px;
  border: none;
  border-radius: 20px;
  background-color: #e67e22;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}
.submit-input-btn:hover {
  background-color: #d35400;
}
`;
document.head.appendChild(style);
