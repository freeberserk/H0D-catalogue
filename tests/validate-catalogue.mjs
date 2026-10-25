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
assert.equal(defs.length,199);
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

const caravanes=defs.filter(d=>d.catalogue?.etiquettes?.includes("objet_caravane_valide"));
const ids=["bouclier-bache-renforce","crochet-de-decrochage","crochet-de-sauvetage-caravanier","caisse-leurre","attaches-de-largage-rapide","amortisseur-de-harnais-nomade","coffret-a-double-fond"];
assert.equal(caravanes.length,7);
assert.deepEqual(caravanes.map(x=>x.key).sort(),ids.slice().sort());
const objFields=[
"H0D_Objet_Type","H0D_Objet_Sous_Type","H0D_Objet_Quantite","H0D_Stockage",
"H0D_Objet_Actif","H0D_Objet_Identifie","H0D_Objet_Charge_Unitaire","H0D_Objet_Valeur",
"H0D_Objet_Utilisations","H0D_Objet_Utilisations_Max","H0D_Objet_Recharge","H0D_Objet_Etat",
"H0D_Objet_Origine","H0D_Objet_Compatibilite","H0D_Objet_Effet","H0D_Objet_Description",
"H0D_Objet_Traits_Table","H0D_Objet_Munition_Active","H0D_Objet_Munition_Famille","H0D_Objet_Munition_Element",
"H0D_Objet_Munition_Recuperable","H0D_Objet_Munition_Bonus_Attaque","H0D_Objet_Munition_Bonus_Degats",
"H0D_Objet_Munition_Type_Degats","H0D_Objet_Munition_Anti_Blindage","H0D_Objet_Munition_Effet_Court"
];
for(const d of caravanes){
 assert.equal(d.kind,"object");
 assert.equal(d.templateKey,"item-objet");
 assert.equal(d.originKey,"caravanes-libres");
 assert.deepEqual(Object.keys(d.props).sort(),objFields.slice().sort());
 assert.ok(d.props.H0D_Objet_Effet && d.props.H0D_Objet_Description);
 assert.ok(Number.isFinite(Number(d.props.H0D_Objet_Charge_Unitaire)));
 assert.ok(Number.isFinite(Number(d.props.H0D_Objet_Valeur)));
 assert.equal(d.catalogue.statut,"validee_mj");
 assert.equal(d.catalogue.pret_pour_builder,true);
 assert.equal(d.catalogue.visible_au_stock_standard,true);
 assert.equal(d.catalogue.generable_stock_aleatoire,true);
 assert.equal(d.catalogue.fabrication.statut,"validee_mj");
 assert.ok(d.catalogue.etiquettes.includes("fabrication_validee"));
 assert.ok(!d.catalogue.etiquettes.includes("proposition_mj"));
}
const hook=caravanes.find(d=>d.key==="crochet-de-sauvetage-caravanier");
assert.ok(hook.props.H0D_Objet_Effet.includes("DD 18"));
assert.ok(hook.props.H0D_Objet_Effet.includes("Athlétisme DD 12"));
assert.ok(hook.props.H0D_Objet_Effet.includes("9 m"));
assert.equal(hook.catalogue.fabrication.dd,12);


// Munitions v0.1.6 : 40 nouvelles + 1 fiche historique actualisee, 12 profils x 3 formats.
const munitions=defs.filter(x=>x.catalogue?.etiquettes?.includes("munition_v016"));
assert.equal(munitions.length,41);
assert.equal(load("data/catalogue-munitions.json").definitions.length,40);
assert.equal(munitions.filter(x=>x.catalogue.elementaire).length,36);
assert.equal(munitions.filter(x=>x.catalogue.visible_au_stock_standard===false).length,24);
const profiles=new Map();
for(const d of munitions){
 assert.equal(d.kind,"object");assert.equal(d.templateKey,"item-objet");
 assert.deepEqual(Object.keys(d.props).sort(),objFields.slice().sort());
 assert.equal(d.props.H0D_Objet_Type,"Munition");
 assert.equal(d.props.H0D_Objet_Munition_Active,false);
 assert.equal(d.catalogue.statut,"validee_mj");
 assert.equal(d.catalogue.pret_pour_builder,true);
 assert.equal(d.catalogue.fabrication.statut,"validee_mj");
 assert.ok(d.catalogue.etiquettes.includes("fabrication_validee"));
 assert.equal(+d.props.H0D_Objet_Quantite,d.catalogue.conditionnement.quantite_par_lot);
 assert.equal(d.catalogue.fabrication.rendement,d.catalogue.conditionnement.quantite_par_lot);
 assert.equal(d.catalogue.prix_ressources.base,d.catalogue.conditionnement.prix_par_lot);
 assert.equal(d.catalogue.visible_au_stock_standard,d.catalogue.generable_stock_aleatoire);
 assert.equal(d.props.H0D_Objet_Munition_Recuperable,d.catalogue.munitions.recuperable);
 assert.ok(["Fleche","Carreau","Projectile"].includes(d.props.H0D_Objet_Munition_Famille));
 if(d.catalogue.elementaire){
  const p=d.catalogue.elementaire,s=p.palier;
  assert.ok([1,2,3].includes(s));
  assert.equal(p.degats_bonus,s+"d6");
  assert.equal(p.duree_rounds,s===1?0:s);
  assert.equal(p.dd_etat,s===1?null:s===2?15:18);
  assert.equal(+d.props.H0D_Objet_Quantite,({1:5,2:3,3:2})[s]);
  assert.equal(d.catalogue.prix_ressources.base,({1:10,2:18,3:24})[s]);
  assert.equal(d.catalogue.fabrication.dd,({1:12,2:15,3:18})[s]);
  assert.equal(d.props.H0D_Objet_Munition_Bonus_Degats,"0");
  assert.equal(d.props.H0D_Objet_Munition_Recuperable,false);
  assert.equal(d.catalogue.visible_au_stock_standard,s===1);
  if(!profiles.has(p.profil))profiles.set(p.profil,new Set());
  profiles.get(p.profil).add(d.props.H0D_Objet_Munition_Famille);
 }
}
assert.equal(profiles.size,12);
for(const set of profiles.values())assert.deepEqual([...set].sort(),["Carreau","Fleche","Projectile"].sort());
const ammoKey=Object.fromEntries(munitions.map(x=>[x.key,x]));
assert.equal(ammoKey["fleches-renforcees"].props.H0D_Objet_Quantite,"10");
assert.equal(ammoKey["fleches-renforcees"].props.H0D_Objet_Munition_Bonus_Attaque,"1");
assert.equal(ammoKey["fleches-renforcees"].props.H0D_Objet_Munition_Recuperable,true);
assert.equal(ammoKey["fleches-renforcees"].catalogue.prix_ressources.base,8);
assert.equal(ammoKey["billes-renforcees-anti-blindage"].props.H0D_Objet_Munition_Anti_Blindage,"2");
assert.equal(ammoKey["billes-renforcees-anti-blindage"].catalogue.munitions.bonus_detachement_piece,1);
assert.equal(ammoKey["fleches-de-chasse"].props.H0D_Objet_Quantite,"20");
assert.equal(ammoKey["billes-de-fronde"].props.H0D_Objet_Quantite,"20");
assert.equal(ammoKey["carreaux-courts"].props.H0D_Objet_Quantite,"10");
assert.ok(ammoKey["carreaux-elementaires-feu-palier-3"]);
const sennAmmo=load("data/stocks/longue-corde-p03.json").offres.find(x=>x.reference==="fleches-renforcees");
assert.equal(sennAmmo.quantite_par_achat,5);
assert.equal(sennAmmo.prix_jetons,2);
assert.equal(sennAmmo.nom_pour_la_scene,"Flèches renforcées ×5");

const weapons=defs.filter(d=>d.kind==="weapon");
assert.equal(weapons.length,28);
const expected={ "dent-ambre":11,"caravanes-libres":3,"pillards-rouges":8,"culte-renouveau":2,"heritiers-soleil":4 };
for(const [origin,count] of Object.entries(expected)) assert.equal(weapons.filter(w=>w.originKey===origin).length,count);
assert.ok(!keys.has("arc-simple"),"L'arc simple est l'Arc tribal du Builder.");
const wByKey=Object.fromEntries(weapons.map(w=>[w.key,w]));
const wFields=["H0D_Arme_Categorie","H0D_Arme_Carac_Attaque","H0D_Arme_Carac_Degats","H0D_Arme_Bonus_Attaque",
"H0D_Arme_Degats","H0D_Arme_Bonus_Degats","H0D_Arme_Type_Degats","H0D_Arme_Portee","H0D_Arme_Mains",
"H0D_Arme_Critique_Seuil","H0D_Arme_Critique_Multiplicateur","H0D_Arme_Equipee","H0D_Stockage","H0D_Arme_Active",
"H0D_Arme_Encombrement","H0D_Arme_Zone","H0D_Arme_Mode_Munition","H0D_Arme_Type_Munition","H0D_Arme_Consommation_Munition",
"H0D_Arme_Recharge","H0D_Arme_Munitions","H0D_Arme_Munitions_Max","H0D_Arme_Element","H0D_Arme_Origine",
"H0D_Arme_Cout","H0D_Arme_Traits_Table","H0D_Arme_Effet_Special","H0D_Arme_Notes"];
for(const w of weapons){
 assert.equal(w.templateKey,"item-arme");
 assert.deepEqual(Object.keys(w.props).sort(),wFields.slice().sort());
 assert.equal(w.catalogue.statut,"integree_v015");
 assert.equal(w.catalogue.pret_pour_builder,true);
 assert.equal(w.catalogue.visible_au_stock_standard,w.catalogue.generable_stock_aleatoire);
 assert.equal(w.catalogue.fabrication.statut,"integree_v015");
 assert.ok(w.catalogue.etiquettes.includes("fabrication_validee"));
 assert.equal(Number(w.props.H0D_Arme_Cout),w.catalogue.prix_ressources.base);
 assert.ok(Object.values(w.props.H0D_Arme_Traits_Table).every(t=>Number.isFinite(t.H0D_Arme_Trait_Valeur)));
}
assert.equal(weapons.filter(w=>w.catalogue.visible_au_stock_standard===false).length,15);
assert.equal(wByKey["arbalete-de-poignet"].props.H0D_Arme_Degats,"1d4");
for(const k of ["arc-a-bobine","arc-solaire","arbalete-de-poignet","lance-cable"])
 assert.equal(wByKey[k].props.H0D_Arme_Carac_Degats,"aucune");
for(const k of ["fronde-de-chasse","fronde-mecanique","javelot-de-chasse"])
 assert.equal(wByKey[k].props.H0D_Arme_Carac_Degats,"FOR");
assert.equal(wByKey["fouet-electrique-pillards"].props.H0D_Arme_Portee,"3");
assert.equal(Object.values(wByKey["fouet-electrique-pillards"].props.H0D_Arme_Traits_Table)[0].H0D_Arme_Trait_Valeur,3);
assert.equal(wByKey["fouet-electrique-pillards"].catalogue.alimentation.degats_physiques_sans_energie_valides,"1d4");
for(const k of ["arc-a-bobine","arc-solaire"])
 assert.equal(wByKey[k].catalogue.alimentation.degats_physiques_sans_energie_valides,"1d6");
for(const w of weapons.filter(w=>w.catalogue.risque_batterie_pillarde))
 assert.ok(!w.catalogue.risque_batterie_pillarde.table_d6,"Une table de surcharge non validée est encore active.");
const culte = armures.filter(x=>x.originKey==="culte-renouveau");
assert.equal(culte.length,7);
assert.equal(defs.length,199);
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
assert.equal(crafted.length,80);
assert.equal(privateDefs.length,80);
console.log(`OK — ${defs.length} références (${defs.filter(x=>x.kind==="object").length} objets ; ${defs.filter(x=>x.kind==="resource").length} ressources ; ${armures.length} armures), ${crafted.length} fabrications, ${offers} offres, ${privateDefs.length} références protégées, ${armures.length} armures.`);
