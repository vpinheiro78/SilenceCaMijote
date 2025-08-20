const fs = require('fs');

const token = process.env.PRERENDER_TOKEN;

const content = `/*  https://service.prerender.io/:splat  200!  User-Agent=googlebot|bingbot|yahoo|yandex|baiduspider  PRERENDER_TOKEN=${token}`;

fs.writeFileSync('_redirects', content);
console.log('_redirects généré avec succès !');