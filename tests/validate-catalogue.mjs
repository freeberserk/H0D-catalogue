#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = rel => JSON.parse(readFileSync(path.join(root, rel), "utf8"));
const index = load("data/index.json");
const manifest = load("module.json");
assert.equal(manifest.id,"h0d-catalogue");
assert.equal(manifest.version,index.version);
assert.equal(index.format,"H0D_CATALOGUE_INDEX");
assert.equal(index.formatVersion,1);
assert.ok(index.catalogues.length >= 1);
const defs = [];
for (const p of index.catalogues) {
  const file = load(p);
  assert.equal(file.format,"H0D_EQUIPMENT_CATALOG");
  assert.equal(file.formatVersion,1);
  assert.ok(Array.isArray(file.definitions));
  defs.push(...file.definitions);
}
const keys = new Set();
const kinds = {object:"item-objet",resource:"item-ressource",weapon:"item-arme",armor:"item-armure"};
for (const d of defs) {
  assert.match(d.key,/^[a-z0-9][a-z0-9-]*$/);
  assert.ok(!keys.has(d.key),`Doublon de référence ${d.key}`);
  keys.add(d.key);
  assert.ok(d.name && d.kind && d.templateKey && d.props && d.catalogue);
  assert.equal(d.templateKey,kinds[d.kind],`Template incorrect pour ${d.key}`);
  assert.ok(d.tier >= 1);
  const c = d.catalogue;
  if (c.prix_ressources !== null && c.prix_ressources !== undefined) {
    if (c.prix_ressources.base !== null && c.prix_ressources.base !== undefined)
      assert.ok(Number.isFinite(c.prix_ressources.base) && c.prix_ressources.base >= 0,`Prix invalide ${d.key}`);
  }
  if (c.fabrication) {
    for (const key of Object.keys(c.fabrication.composants ?? {})) {
      assert.ok(key !== d.key,`Fabrication circulaire ${key}`);
    }
    for (const option of c.fabrication.composants_alternatifs || []) {
      assert.ok(option.quantite>0,`Quantité alternative invalide ${d.key}`);
    }
  }
}
for (const d of defs) {
  const craft = d.catalogue.fabrication;
  if (!craft) continue;
  for (const key of Object.keys(craft.composants || {})) assert.ok(keys.has(key),`Composant manquant ${d.key} -> ${key}`);
  for (const group of craft.composants_alternatifs || []) for (const ref of group.references)
    assert.ok(keys.has(ref),`Alternative absente ${d.key} -> ${ref}`);
  for (const linked of d.catalogue.proche_de || []) assert.ok(keys.has(linked.key),`Doublon référencé absent : ${linked.key}`);
}
let offers = 0;
for (const p of index.stocks) {
  const stock = load(p);
  assert.equal(stock.format,"H0D_EQUIPMENT_STOCK");
  assert.equal(stock.formatVersion,1);
  assert.ok(stock.key && Array.isArray(stock.offres));
  for (const offer of stock.offres) {
    assert.ok(keys.has(offer.reference),`Offre sans référence : ${offer.reference}`);
    assert.ok(typeof offer.prix_jetons === "number" ||
      (Number.isInteger(offer.prix_jetons?.min) && Number.isInteger(offer.prix_jetons?.max) && offer.prix_jetons.min<=offer.prix_jetons.max));
    assert.ok(offer.quantite_disponible === null ||
      (Number.isInteger(offer.quantite_disponible) && offer.quantite_disponible>=0));
    assert.ok(offer.quantite_par_achat>=1);
  }
  offers += stock.offres.length;
}
for (const f of ["scripts/h0d-catalogue.js","styles/h0d-catalogue.css","README.md","schemas/catalogue.schema.json","schemas/stock.schema.json"])
  assert.ok(existsSync(path.join(root,f)),`Fichier manquant : ${f}`);
const crafted = defs.filter(d=>d.catalogue?.etiquettes?.includes("fabrication_validee"));
const privateDefs = defs.filter(d=>d.catalogue?.visible_au_stock_standard===false);
console.log(`OK — ${defs.length} références (${defs.filter(x=>x.kind==="object").length} objets ; ${defs.filter(x=>x.kind==="resource").length} ressources), ${crafted.length} fabrications, ${offers} offres, ${privateDefs.length} références protégées.`);
