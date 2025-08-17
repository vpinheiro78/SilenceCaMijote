const fetch = require('node-fetch'); // si Node <18, sinon fetch est natif

async function testEmail() {
  const testEmail = 'ton_email_de_test@example.com'; // remplace par ton email
  try {
    const res = await fetch('https://silencecamijote.netlify.app/.netlify/functions/notifySubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });

    const data = await res.json();
    console.log('Réponse de la fonction:', data);
  } catch (err) {
    console.error('Erreur test notifySubscribe:', err);
  }
}

testEmail();
