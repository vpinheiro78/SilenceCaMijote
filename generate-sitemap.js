import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// ⚡ Variables d'environnement (Netlify / local via .env)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const baseUrl = "https://silencecamijote.fr";

async function generateSitemap() {
  // Récupérer toutes les recettes
  const { data: recettes, error } = await supabase
    .from("recettes")
    .select("id, created_at");

  if (error) {
    console.error("❌ Erreur Supabase :", error);
    process.exit(1);
  }

  const today = new Date().toISOString().split("T")[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Page d'accueil
  sitemap += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;

  // Pages recettes
  recettes.forEach((recette) => {
    const lastmod = recette.created_at
      ? recette.created_at.split("T")[0]
      : today;

    sitemap += `  <url>
    <loc>${baseUrl}/recette/recette.html?id=${recette.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  sitemap += `</urlset>`;

  fs.writeFileSync("sitemap.xml", sitemap);
  console.log("✅ sitemap.xml généré avec succès !");
}

generateSitemap();
