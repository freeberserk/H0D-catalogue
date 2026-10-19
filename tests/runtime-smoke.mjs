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
assert.equal(s.references,124);
assert.equal(s.stocks,1);
assert.equal(s.protected,41);
assert.equal(s.bridge.added,82);
assert.equal(s.bridge.skipped,1);
assert.equal(s.bridge.protected,41);
assert.equal(builder.getDefinition("billes-de-fuite").name,"DÉFINITION EXISTANTE À PRÉSERVER");
assert.equal(api.getStockResolved("longue-corde-senn-p03").offres.length,21);
assert.equal(api.getRecipes().length,4);
// Armures validées et résistances spécialisées.
const armors=api.getDefinitions({kind:"armor"});
assert.equal(armors.length,41);
const tech=api.getDefinition("tenue-technicien-solaire");
assert.equal(tech.props.H0D_Armure_Bonus_Defense,1);
assert.equal(tech.props.H0D_Armure_Encombrement,1);
assert.deepEqual(Object.values(tech.props.H0D_Armure_Traits_Table).map(x=>[x.H0D_Armure_Trait_Type,x.H0D_Armure_Trait_Valeur]),[["ignifuge",3],["anti_choc",3]]);
const recup=api.getDefinition("armure-recuperateur-dent");
assert.equal(recup.props.H0D_Armure_Bonus_Defense,2);
assert.equal(recup.props.H0D_Armure_Encombrement,1);
assert.equal(api.getDefinition("harnais-dompteur-rouge").catalogue.resistances_validees.choc,0);

// Armures du Culte v0.1.2 : pas de profil d'Élu ni de cumul de DEF.
const cult=api.getDefinitions({kind:"armor",originKey:"culte-renouveau"});
assert.equal(cult.length,7);
assert.ok(cult.every(x=>builder.getDefinition(x.key)));
const greffeL=api.getDefinition("blindage-greffe-leger-renouveau");
const greffeH=api.getDefinition("blindage-greffe-lourd-renouveau");
assert.equal(greffeL.props.H0D_Armure_Encombrement,2);
assert.equal(greffeH.props.H0D_Armure_Encombrement,2);
assert.equal(greffeL.catalogue.malus_vitesse_metres,-1.5);
assert.equal(greffeH.catalogue.malus_vitesse_metres,-3);
assert.equal(greffeH.catalogue.utilisable_comme_item_pj,false);
const exo=api.getDefinition("exo-armure-transfiguration-renouveau");
assert.equal(exo.props.H0D_Armure_Bonus_Defense,3);
assert.equal(exo.props.H0D_Armure_Encombrement,0);
assert.equal(exo.props.H0D_Armure_Malus,"0");
assert.equal(exo.catalogue.malus_vitesse_metres,0);
assert.equal(api.getDefinition("robe-armure-initie-renouveau").props.H0D_Armure_Bonus_Defense,1);
assert.ok(!cult.some(x=>/elu-zalem/i.test(x.key)));
assert.equal(api.getRecipes().length,4);

// Plans ECHO : consultables mais interdits au Builder, y compris en mode includeRestricted.
const plans=api.getDefinitions({originKey:"forge-echo"});
assert.equal(plans.length,19);
assert.equal(plans.filter(x=>x.kind==="armor").length,15);
assert.equal(plans.filter(x=>x.kind==="object").length,4);
assert.ok(!builder.getDefinition("echo-armure-traqueur-plus-1"));
assert.ok(!builder.getDefinition("echo-module-bouclier"));
const includeReserved=api.syncToEquipmentBuilder({includeRestricted:true});
assert.equal(includeReserved.protected,19);
assert.ok(!builder.getDefinition("echo-armure-traqueur-plus-1"));
assert.ok(!builder.getDefinition("echo-module-bouclier"));
// Le MJ peut cibler uniquement l'armure blanche de fin de campagne.
const select=api.syncSelectedToEquipmentBuilder(["armure-blanche-heliosium"]);
assert.equal(select.added,0); // Déjà ajoutée par includeRestricted dans ce test.
assert.equal(select.skipped,1);
const denied=api.syncSelectedToEquipmentBuilder(["echo-armure-traqueur-plus-1"]);
assert.equal(denied.protected,1);
assert.equal(denied.added,0);
assert.ok(denied.errors.length);
// Restaurer le cas d'usage du bridge pour ses compteurs post-synchronisation.
const noOp=api.syncToEquipmentBuilder();
assert.equal(noOp.added,0);
assert.equal(noOp.skipped,83);
assert.equal(noOp.protected,41);

// Robustesse: modifications client n'affectent pas l'état du catalogue.
const original=api.getDefinition("rations-2-jours");
original.name="MUTÉ";
assert.notEqual(api.getDefinition("rations-2-jours").name,"MUTÉ");
// Synchronisation idempotente.
const after=api.syncToEquipmentBuilder();
assert.equal(after.added,0);
assert.equal(after.skipped,83);
assert.equal(after.protected,41);
console.log("OK — API Foundry simulée, 124 définitions, 41 armures, 21 offres, 4 fabrications, plans non chiffrés protégés, import ciblé sûr, aucun doublon.");
