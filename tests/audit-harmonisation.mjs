#!/usr/bin/env node
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>JSON.parse(readFileSync(new URL("../"+path,import.meta.url),"utf8"));
const index=read("data/index.json");
const audit=read("data/audits/rapprochement-builders-2026-11-08.json");
const definitions=index.catalogues.flatMap(path=>read(path).definitions);
// Le rapport figé du 8 novembre porte sur les 199 équipements d\'origine, pas sur les nouveaux jetons.
const equipmentDefinitions=definitions.filter(x=>x.key!=="jeton-reconnaissance");
assert.equal(definitions.length,200);

assert.ok(!index.catalogues.some(path=>path.startsWith("data/audits/")),
 "Le rapport d'audit ne doit jamais devenir une table de génération.");
assert.equal(audit.importPolicy,"NO_IMPORT_UNTIL_VALIDATED");
assert.equal(audit.importedCount,0);
assert.equal(equipmentDefinitions.length,audit.catalogue.definitions);
assert.equal(equipmentDefinitions.length,199,"Aucun import effectué avant l'arbitrage.");
assert.equal(equipmentDefinitions.filter(x=>x.catalogue?.pret_pour_builder===false).length,audit.catalogue.unfinished);
assert.equal(equipmentDefinitions.filter(x=>x.catalogue?.visible_au_stock_standard===false).length,audit.catalogue.protectedFromStandardStock);
// Audit v0.1.8 conservé comme état historique ; 18 prix ajoutés en v0.1.9.
assert.equal(equipmentDefinitions.filter(x=>["dent-ambre","caravanes-libres","pillards-rouges","heritiers-soleil"].includes(x.originKey)&&x.kind==="armor"&&x.catalogue?.prix_ressources?.base!=null).length,18);
assert.equal(equipmentDefinitions.filter(x=>x.catalogue?.prix_ressources?.base==null).length,audit.catalogue.missingResourcePrice-18);
assert.equal(equipmentDefinitions.filter(x=>x.catalogue?.rarete==null||x.catalogue?.rarete==="").length,audit.catalogue.missingRarity);
assert.equal(equipmentDefinitions.filter(x=>x.catalogue?.visible_au_stock_standard===true&&x.catalogue?.prix_ressources?.base==null).length,audit.catalogue.standardStockUnknownPrice.length-18);
for(const kind of ["weapon","armor","object","resource"]){
 assert.equal(equipmentDefinitions.filter(x=>x.kind===kind).length,audit.catalogue.byKind[kind]);
 assert.equal(equipmentDefinitions.filter(x=>x.kind===kind&&x.catalogue?.prix_ressources?.base==null).length,audit.catalogue.unknownPriceByKind[kind]-(kind==="armor"?18:0));
}
assert.equal(audit.equipmentBuilder.total,33);
assert.equal(audit.equipmentBuilder.records.length,33);
assert.equal(audit.equipmentBuilder.ready,0);
const legacy=new Set();
for(const r of audit.equipmentBuilder.records){
 assert.ok(r.id&&r.name&&r.kind&&r.templateKey&&r.source);
 assert.ok(!legacy.has(r.id),"Doublon dans l'audit : "+r.id);legacy.add(r.id);
 assert.equal(r.importReady,false,"Import non validé : "+r.id);
 assert.equal(r.decision,"audit_en_attente");
 assert.ok(r.fieldReview.includes("catalogue-metadata-missing"));
 assert.ok(!definitions.some(d=>d.key===r.id),"Référence historique promue sans audit : "+r.id);
}
assert.equal(audit.equipmentBuilder.records.filter(x=>x.kind==="weapon").length,13);
assert.equal(audit.equipmentBuilder.records.filter(x=>x.kind==="object").length,13);
assert.equal(audit.equipmentBuilder.records.filter(x=>x.kind==="armor").length,7);
assert.equal(audit.equipmentBuilder.records.filter(x=>x.fieldReview.includes("distance-range-zero-unverified")).length,5);
assert.equal(audit.equipmentBuilder.records.filter(x=>x.fieldReview.includes("zero-defense-needs-interpretation")).length,7);
assert.equal(audit.factions.length,6);
assert.equal(audit.factions.reduce((n,f)=>n+f.profiles,0),69);
assert.equal(audit.factions.reduce((n,f)=>n+f.mentions,0),392);
assert.equal(audit.factions.reduce((n,f)=>n+f.exactNameMatches,0),9);
assert.ok(audit.provenance.every(s=>/^[a-f0-9]{40}$/.test(s.sourceCommit)),"Sources liées à des commits immuables.");
console.log("OK — Audit historique 199/33/392 conservé ; 18 prix armures v0.1.9, zéro import nouveau.");
