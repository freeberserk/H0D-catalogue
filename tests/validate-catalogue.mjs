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
const armures = defs.filter(d=>d.kind === "armor");
assert.equal(armures.length,41);
assert.equal(defs.length,124);
const echo = defs.filter(x=>x.originKey==="forge-echo");
assert.equal(echo.length,19);
const plansEcho=echo.filter(x=>x.kind==="armor");
assert.equal(plansEcho.length,15);
assert.ok(plansEcho.every(x=>x.catalogue.pret_pour_builder===false && x.catalogue.visible_au_stock_standard===false));
assert.ok(plansEcho.every(x=>x.props.H0D_Armure_Bonus_Defense===null && x.props.H0D_Armure_Encombrement===null));
assert.deepEqual([...new Set(plansEcho.map(x=>x.catalogue.palier_amelioration))],[1,2,3]);
for (const fam of ["traqueur","bastion","isolateur","recuperateur-avance","veilleur"])
  assert.equal(plansEcho.filter(x=>x.catalogue.etiquettes.includes(fam)).length,3);
const modulesEcho=echo.filter(x=>x.kind==="object");
assert.equal(modulesEcho.length,4);
assert.ok(modulesEcho.every(x=>x.catalogue.deblocage.trois_noyaux_requis===true));
assert.ok(modulesEcho.every(x=>x.catalogue.deblocage.noyaux.join(",")==="Griffe,Œil,Soleil Brisé"));
assert.ok(modulesEcho.every(x=>x.catalogue.pret_pour_builder===false));
const blancs=defs.filter(x=>x.originKey==="heliosium");
assert.equal(blancs.length,1);
const blanc=blancs[0];
assert.equal(blanc.key,"armure-blanche-heliosium");
assert.equal(blanc.props.H0D_Armure_Bonus_Defense,2);
assert.equal(blanc.props.H0D_Armure_Encombrement,0);
assert.equal(blanc.catalogue.regeneration.points_vie_par_round,"1d4");
assert.equal(blanc.catalogue.regeneration.rounds_par_activation,3);
assert.equal(blanc.catalogue.regeneration.activations_par_combat,1);
assert.equal(blanc.catalogue.instabilite.points_par_pv_regeneres,4);
assert.equal(blanc.catalogue.instabilite.seuils[2].dd,15);
assert.equal(blanc.catalogue.instabilite.seuils[3].dd,18);
assert.equal(blanc.catalogue.deblocage.pas_avant_acte_v,true);
assert.equal(blanc.catalogue.pret_pour_builder,true);
assert.equal(blanc.catalogue.visible_au_stock_standard,false);
const culte = armures.filter(x=>x.originKey==="culte-renouveau");
assert.equal(culte.length,7);
assert.equal(defs.length,124);
const byKey = Object.fromEntries(culte.map(d=>[d.key,d]));
for (const a of culte) {
  assert.equal(a.templateKey,"item-armure");
  assert.equal(a.catalogue.prix_ressources,null);
  assert.equal(a.catalogue.disponibilite.brok,"indisponible");
  assert.equal(a.catalogue.resistances_validees.feu,0);
}
const greffeLegere = byKey["blindage-greffe-leger-renouveau"];
const greffeLourde = byKey["blindage-greffe-lourd-renouveau"];
for (const b of [greffeLegere,greffeLourde]) {
  assert.equal(b.props.H0D_Armure_Encombrement,2);
  assert.equal(b.catalogue.type_protection,"greffe_permanente");
  assert.equal(b.catalogue.utilisable_comme_item_pj,false);
  assert.equal(b.catalogue.generable_stock_aleatoire,false);
}
assert.equal(greffeLegere.props.H0D_Armure_Bonus_Defense,1);
assert.equal(greffeLegere.catalogue.malus_vitesse_metres,-1.5);
assert.equal(greffeLourde.props.H0D_Armure_Bonus_Defense,2);
assert.equal(greffeLourde.catalogue.malus_vitesse_metres,-3);
const exo=byKey["exo-armure-transfiguration-renouveau"];
assert.equal(exo.props.H0D_Armure_Bonus_Defense,3);
assert.equal(exo.props.H0D_Armure_Encombrement,0);
assert.equal(exo.props.H0D_Armure_Malus,"0");
assert.equal(exo.catalogue.malus_vitesse_metres,0);
assert.equal(byKey["harnais-converti-renouveau"].props.H0D_Armure_Bonus_Defense,2);
assert.equal(byKey["harnais-converti-renouveau"].props.H0D_Armure_Encombrement,2);
assert.equal(byKey["armure-zelote-renouveau"].props.H0D_Armure_Malus,"-2 aux tests physiques concernés");
assert.ok(!armures.some(d=>d.key.includes("elu-zalem")));
for (const a of armures) {
  assert.equal(a.props.H0D_Armure_Type,"armure");
  assert.ok(["corps","tete","torse","bras","jambes","autre"].includes(a.props.H0D_Armure_Zone));
  if (a.catalogue?.pret_pour_builder===false) {
    assert.equal(a.props.H0D_Armure_Bonus_Defense,null,`Plan non chiffré DEF ${a.key}`);
    assert.equal(a.props.H0D_Armure_Encombrement,null,`Plan non chiffré Enc. ${a.key}`);
    assert.equal(a.catalogue.visible_au_stock_standard,false);
  } else {
    assert.ok(Number.isInteger(a.props.H0D_Armure_Bonus_Defense));
    assert.ok(Number.isInteger(a.props.H0D_Armure_Encombrement));
  }
  assert.ok(Object.values(a.props.H0D_Armure_Traits_Table).every(row=>
    typeof row.H0D_Armure_Trait_Type==="string" && Number.isFinite(row.H0D_Armure_Trait_Valeur)));
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
console.log(`OK — ${defs.length} références (${defs.filter(x=>x.kind==="object").length} objets ; ${defs.filter(x=>x.kind==="resource").length} ressources ; ${armures.length} armures), ${crafted.length} fabrications, ${offers} offres, ${privateDefs.length} références protégées, ${armures.length} armures.`);
