// Variables globales pour stocker les réponses
let userIngredients = "";
let userCravings = "";
let userPersons = 0;

// Exemple simplifié du flow
function proceedNextStep(questionType){
  if(questionType === 'ingredients'){
    addMessage(`👌 Parfait, j’ai noté vos ingrédients ! (${userIngredients})`);
    // On peut ensuite demander le nombre de personnes
    addInputField('persons');
  } else if(questionType === 'cravings'){
    addMessage(`👌 Parfait, j’ai noté votre envie ! (${userCravings})`);
    // Demander nombre de personnes
    addInputField('persons');
  } else if(questionType === 'persons'){
    addMessage(`👌 Super, pour ${userPersons} personne(s) !`);
    // Ici on peut appeler l'API ChatGPT pour générer la recette
  }
}

// Fonction pour créer un champ de saisie pour l'utilisateur
function addInputField(questionType) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'user-input-container';

  const label = document.createElement('div');
  label.className = 'input-label';
  label.innerText = questionType === 'ingredients' 
    ? t.askIngredients 
    : questionType === 'cravings' 
      ? t.askCravings 
      : "Pour combien de personnes ?";
  containerDiv.appendChild(label);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'user-input';
  input.placeholder = questionType === 'ingredients' 
    ? "Écrivez ici ce que vous avez sous la main..." 
    : questionType === 'cravings' 
      ? "Écrivez ici votre envie gourmande..." 
      : "Nombre d'invités";
  containerDiv.appendChild(input);

  const submitBtn = document.createElement('button');
  submitBtn.innerText = "👌 Envoyer";
  submitBtn.className = 'submit-input-btn';
  submitBtn.onclick = () => {
    const value = input.value.trim();
    if(!value){
      alert("Merci de saisir une réponse valide 😊");
      return;
    }
    if(questionType === 'persons'){
      const num = parseInt(value);
      if(isNaN(num) || num <= 0){
        alert("Merci d’indiquer un nombre valide d’invités 😋");
        return;
      }
      userPersons = num;
    } else {
      if(questionType === 'ingredients') userIngredients = value;
      if(questionType === 'cravings') userCravings = value;
    }

    addMessage(value,'user');
    containerDiv.remove();
    proceedNextStep(questionType);
  };
  containerDiv.appendChild(submitBtn);

  chat.appendChild(containerDiv);
  input.focus();
  chat.scrollTop = chat.scrollHeight;
}

// Styles
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
