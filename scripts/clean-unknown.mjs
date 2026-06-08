/**
 * Script de limpeza: remove todos os documentos de clicks e pageviews
 * onde region === null (registros "Desconhecido").
 *
 * Uso:
 *   node scripts/clean-unknown.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const serviceAccount = require(join(__dirname, "../thggnm-ldpg-firebase-adminsdk.json"));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function deleteUnknown(collectionName) {
  const ref = db.collection(collectionName);
  const snap = await ref.get();

  const toDelete = snap.docs.filter((doc) => {
    const data = doc.data();
    // Desconhecido = region é null, undefined, ou objeto sem city
    return !data.region || !data.region.city;
  });

  if (toDelete.length === 0) {
    console.log(`[${collectionName}] Nenhum registro "Desconhecido" encontrado.`);
    return 0;
  }

  console.log(`[${collectionName}] Encontrados ${toDelete.length} registros para deletar...`);

  const BATCH_SIZE = 500;
  let deleted = 0;

  for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = toDelete.slice(i, i + BATCH_SIZE);
    chunk.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += chunk.length;
    console.log(`[${collectionName}] Deletados ${deleted}/${toDelete.length}...`);
  }

  return deleted;
}

async function main() {
  console.log(`\n🧹 Limpando registros "Desconhecido" (region = null)...\n`);

  const [clicksDeleted, pvDeleted] = await Promise.all([
    deleteUnknown("clicks"),
    deleteUnknown("pageviews"),
  ]);

  console.log(`\n✅ Concluído!`);
  console.log(`   clicks    removidos: ${clicksDeleted}`);
  console.log(`   pageviews removidos: ${pvDeleted}`);
  console.log(`   Total:               ${clicksDeleted + pvDeleted}\n`);
}

main().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
