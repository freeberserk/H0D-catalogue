#!/usr/bin/env node
// Test d'API avec faux environnement Foundry (sans lancement de Foundry lui-même).
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const callbacks = {};
const accepted = new Map();
const builder = {
  getDefinition:key=>accepted.get(key),
  registerDefinition:def=>{accepted.set(def.key,structuredClone(def));return def;}
};
// 33 références existantes, dont une clé conflictuelle hypothétique : ne pas l'écraser.
accepted.set("billes-de-fuite",{key:"billes-de-fuite",name:"DÉFINITION EXISTANTE À PRÉSERVER"});
const mod={};
const context={
  console:{log(){},info(){},warn(){},error:console.error},
  Hooks:{once:(event,fn)=>{callbacks[event]=fn;},callAll:()=>{}},
  game:{modules:new Map([["h0d-catalogue",mod]]),h0dEquipmentBuilder:builder},
  fetch:async url=>{
    const rel=url.replace(/^modules\/h0d-catalogue\//,"").split("?")[0];
    return {ok:true,json:async()=>JSON.parse(readFileSync(path.join(root,rel),"utf8"))};
  },
  foundry:{utils:{deepClone:structuredClone,escapeHTML:(s)=>s}},
  structuredClone
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(readFileSync(path.join(root,"scripts/h0d-catalogue.js"),"utf8"),context);
assert.ok(callbacks.ready,"Hook ready manquant");
callbacks.ready();
const api=context.game.h0dCatalogue;
await api.whenReady();
const s=api.getStatus();
assert.equal(s.references,79);
assert.equal(s.stocks,1);
assert.equal(s.protected,21);
assert.equal(s.bridge.added,57);
assert.equal(s.bridge.skipped,1);
assert.equal(s.bridge.protected,21);
assert.equal(builder.getDefinition("billes-de-fuite").name,"DÉFINITION EXISTANTE À PRÉSERVER");
assert.equal(api.getStockResolved("longue-corde-senn-p03").offres.length,21);
assert.equal(api.getRecipes().length,4);
// Robustesse: modifications client n'affectent pas l'état du catalogue.
const original=api.getDefinition("rations-2-jours");
original.name="MUTÉ";
assert.notEqual(api.getDefinition("rations-2-jours").name,"MUTÉ");
// Synchronisation idempotente.
const after=api.syncToEquipmentBuilder();
assert.equal(after.added,0);
assert.equal(after.skipped,58);
assert.equal(after.protected,21);
console.log("OK — API Foundry simulée, 79 définitions, 21 offres, 4 fabrications, synchronisation conservative, aucun doublon.");
