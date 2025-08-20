// generateRedirects.js
import fs from 'fs';
import path from 'path';

// Récupère le token depuis la variable d'environnement
const token = process.env.PRERENDER_TOKEN;

if (!token) {
  console.error("⚠️ PRERENDER_TOKEN n'est pas défini !");
  process.exit(1);
}

// Contenu du fichier _redirects pour Prerender.io
const content = `/*  https://service.prerender.io/:splat  200!  User-Agent=googlebot|bingbot|yahoo|yandex|baiduspider  X-Prerender-Token=${token}`;

// Chemin de destination : dossier publié (ici 'public')
const redirectsPath = path.join('public', '_redirects');

// Écriture du fichier
fs.writeFileSync(redirectsPath, content, 'utf8');
console.log(`✅ _redirects généré avec succès dans ${redirectsPath}`);
