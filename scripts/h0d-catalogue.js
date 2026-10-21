/**
 * H0D Catalogue v0.1.5
 * Foundry VTT v14 / Custom System Builder v6.0.2+
 *
 * Principes : module de données, aucune création d'Item au démarrage ;
 * catalogue sans conversion automatique des monnaies ;
 * export additif et non destructif des références non réservées vers Equipment Builder.
 */
const H0D_CATALOGUE_ID = "h0d-catalogue";
const H0D_CATALOGUE_VERSION = "0.1.5";
const H0D_BUILDER_ID = "h0d-equipment-builder";

const h0dState = {
  ready: false,
  error: null,
  index: null,
  definitions: new Map(),
  stocks: new Map(),
  warnings: [],
  bridge: {status: "non_execute", added: 0, skipped: 0, protected: 0, errors: []},
  readyPromise: null
};

function h0dClone(v) {
  if (v === undefined) return undefined;
  if (globalThis.foundry?.utils?.deepClone) return foundry.utils.deepClone(v);
  return JSON.parse(JSON.stringify(v));
}

function h0dEscape(s) {
  if (globalThis.foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(s ?? ""));
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

async function h0dFetchJSON(path) {
  // Assets sont embarqués localement dans le ZIP, sans dépendance à GitHub en partie.
  if (typeof path !== "string" || !/^data\/[a-z0-9/_.-]+\.json$/i.test(path) || path.includes("..")) {
    throw new Error(`Chemin de données non autorisé : ${path}`);
  }
  const response = await fetch(`modules/${H0D_CATALOGUE_ID}/${path}?v=${H0D_CATALOGUE_VERSION}`);
  if (!response.ok) throw new Error(`Impossible de charger ${path} (HTTP ${response.status}).`);
  return response.json();
}

function h0dValidateDefinition(def, path) {
  if (!def || typeof def !== "object" || !def.key || !def.name || !def.kind || !def.templateKey) {
    throw new Error(`${path} : entrée incomplète (key/name/kind/templateKey).`);
  }
  if (!["object", "resource", "weapon", "armor"].includes(def.kind)) {
    throw new Error(`${path}/${def.key} : kind inconnu : ${def.kind}`);
  }
  if (!def.props || typeof def.props !== "object" || Array.isArray(def.props)) {
    throw new Error(`${path}/${def.key} : props doit être un objet.`);
  }
  const expected = {object:"item-objet",resource:"item-ressource",weapon:"item-arme",armor:"item-armure"};
  if (def.templateKey !== expected[def.kind]) {
    throw new Error(`${path}/${def.key} : template ${def.templateKey} incompatible avec ${def.kind}`);
  }
  if (def.catalogue?.prix_ressources?.base !== undefined && def.catalogue.prix_ressources.base !== null &&
      (!Number.isFinite(def.catalogue.prix_ressources.base) || def.catalogue.prix_ressources.base < 0)) {
    throw new Error(`${path}/${def.key} : prix de ressources invalide.`);
  }
}

function h0dLoadCatalogue(doc, path) {
  if (doc?.format !== "H0D_EQUIPMENT_CATALOG" || doc?.formatVersion !== 1 || !Array.isArray(doc.definitions)) {
    throw new Error(`${path} : format H0D_EQUIPMENT_CATALOG v1 requis.`);
  }
  for (const def of doc.definitions) {
    h0dValidateDefinition(def, path);
    if (h0dState.definitions.has(def.key)) {
      throw new Error(`${path} : doublon de clé : ${def.key}`);
    }
    h0dState.definitions.set(def.key, h0dClone(def));
  }
  if (Array.isArray(doc.a_valider)) h0dState.warnings.push(...doc.a_valider);
}

function h0dLoadStock(stock, path) {
  if (stock?.format !== "H0D_EQUIPMENT_STOCK" || stock?.formatVersion !== 1 ||
      !stock.key || !Array.isArray(stock.offres)) {
    throw new Error(`${path} : format H0D_EQUIPMENT_STOCK v1 requis.`);
  }
  if (h0dState.stocks.has(stock.key)) throw new Error(`${path} : stock doublonné (${stock.key}).`);
  for (const offer of stock.offres) {
    if (!h0dState.definitions.has(offer.reference)) {
      throw new Error(`${path} : référence d'objet introuvable : ${offer.reference}`);
    }
    if (offer.prix_jetons === null || offer.prix_jetons === undefined) {
      h0dState.warnings.push(`${path} : prix non défini pour ${offer.reference}`);
    }
    // Quantité null = inconnue et jamais illimitée.
    if (offer.quantite_disponible !== null && offer.quantite_disponible !== undefined &&
        (!Number.isInteger(offer.quantite_disponible) || offer.quantite_disponible < 0)) {
      throw new Error(`${path} : quantité invalide pour ${offer.reference}`);
    }
  }
  h0dState.stocks.set(stock.key, h0dClone(stock));
}

function h0dGetDefinitions({kind=null, originKey=null, tag=null, query=null, includeRestricted=true}={}) {
  const q = String(query ?? "").trim().toLocaleLowerCase("fr");
  return Array.from(h0dState.definitions.values()).filter(d =>
    (!kind || d.kind === kind) &&
    (!originKey || d.originKey === originKey) &&
    (!tag || d.catalogue?.etiquettes?.includes(tag)) &&
    (includeRestricted || d.catalogue?.visible_au_stock_standard !== false) &&
    (!q || `${d.name} ${d.key} ${d.catalogue?.categorie ?? ""}`.toLocaleLowerCase("fr").includes(q))
  ).map(h0dClone);
}

function h0dGetStock(key) { return h0dClone(h0dState.stocks.get(key) || null); }

function h0dGetStockResolved(key) {
  const stock = h0dGetStock(key);
  if (!stock) return null;
  stock.offres = stock.offres.map(offer => ({
    ...offer,
    objet: h0dClone(h0dState.definitions.get(offer.reference))
  }));
  return stock;
}

function h0dGetRecipes({includeRestricted=true}={}) {
  return h0dGetDefinitions({tag:"fabrication_validee",includeRestricted}).map(def => ({
    key: def.key,
    name: def.name,
    fabrication: h0dClone(def.catalogue.fabrication),
    effet: def.catalogue.notes_source
  }));
}

function h0dStats() {
  const all = Array.from(h0dState.definitions.values());
  const kinds = {};
  for (const def of all) kinds[def.kind] = (kinds[def.kind] || 0) + 1;
  return {
    ready:h0dState.ready,
    error:h0dState.error,
    version:H0D_CATALOGUE_VERSION,
    references:all.length,
    types:kinds,
    stocks:h0dState.stocks.size,
    protected:all.filter(d=>d.catalogue?.visible_au_stock_standard===false).length,
    warnings:h0dState.warnings.length,
    bridge:h0dClone(h0dState.bridge)
  };
}

/**
 * Pont OPTIONNEL vers H0D Equipment Builder v0.1.0+
 * Ne remplace JAMAIS les définitions existantes ; ignore par défaut les entrées
 * confidentielles, d'artisanat ou réservées à un stock de scénario, car
 * le builder v0.1 ne sait pas encore les exclure de ses stocks aléatoires.
 */
function h0dSyncToBuilder({includeRestricted=false}={}) {
  const builder = globalThis.game?.h0dEquipmentBuilder;
  const result = {status:"ok", added:0, skipped:0, protected:0, errors:[]};
  if (!h0dState.ready) return { ...result, status:"catalogue_non_pret"};
  if (!builder?.registerDefinition || !builder?.getDefinition) {
    return { ...result, status:"builder_absent"};
  }
  for (const def of h0dState.definitions.values()) {
    // Un plan non finalisé ne doit JAMAIS arriver dans le Builder,
    // même si includeRestricted est demandé : ses valeurs DEF/Enc. sont null.
    if (def.catalogue?.pret_pour_builder === false ||
        (!includeRestricted && def.catalogue?.visible_au_stock_standard === false)) {
      result.protected++;
      continue;
    }
    try {
      if (builder.getDefinition(def.key)) {result.skipped++; continue;}
      builder.registerDefinition(h0dClone(def));
      result.added++;
    } catch (err) {
      result.errors.push(`${def.key} : ${err.message || err}`);
    }
  }
  if (result.errors.length) result.status = "partiel";
  h0dState.bridge = h0dClone(result);
  if (includeRestricted && result.added) {
    console.warn(`${H0D_CATALOGUE_ID} | Entrées réservées incluses : le builder v0.1 pourra les tirer dans ses stocks aléatoires. Éviter ce mode pour une partie normale.`);
  }
  return h0dClone(result);
}

/** Import manuel et ciblé pour le MJ : jamais de déblocage automatique des plans. */
function h0dSyncSelectedToBuilder(keys=[]) {
  const result={status:"ok",added:0,skipped:0,protected:0,errors:[]};
  const builder=globalThis.game?.h0dEquipmentBuilder;
  if (!h0dState.ready) return {...result,status:"catalogue_non_pret"};
  if (!builder?.registerDefinition || !builder?.getDefinition) return {...result,status:"builder_absent"};
  if (!Array.isArray(keys)) return {...result,status:"entree_invalide",errors:["Liste de clés requise."]};
  for (const key of new Set(keys)) {
    if (typeof key !== "string") {result.errors.push("Clé non textuelle.");continue;}
    const def=h0dState.definitions.get(key);
    if (!def) {result.errors.push(`Référence inconnue : ${key}`);continue;}
    if (def.catalogue?.pret_pour_builder===false) {
      result.protected++;
      result.errors.push(`Plan non finalisé, import refusé : ${key}`);
      continue;
    }
    try {
      if (builder.getDefinition(key)) {result.skipped++;continue;}
      builder.registerDefinition(h0dClone(def));
      result.added++;
    } catch(err) {result.errors.push(`${key} : ${err.message || err}`);}
  }
  if (result.errors.length) result.status="partiel";
  return result;
}

function h0dPriceLabel(def) {
  const p = def.catalogue?.prix_ressources;
  if (p?.texte) return p.texte;
  const v = def.catalogue?.valeur_troc;
  if (v?.texte) return `Troc ${v.texte}`;
  return "Non défini";
}

async function h0dOpen() {
  if (!h0dState.ready) throw new Error("Catalogue non initialisé.");
  const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
  if (!DialogV2) throw new Error("Cette interface requiert Foundry VTT v14.");
  const defs = h0dGetDefinitions().sort((a,b)=>a.name.localeCompare(b.name,"fr"));
  const stats = h0dStats();
  const rows = defs.map(def => `<tr>
    <td>${h0dEscape(def.name)}</td>
    <td>${h0dEscape(def.kind)}</td>
    <td>${h0dEscape(def.catalogue?.rarete || "—")}</td>
    <td>${h0dEscape(h0dPriceLabel(def))}</td>
    <td>${def.catalogue?.pret_pour_builder===false ? "Plan à finaliser" : def.catalogue?.visible_au_stock_standard === false ? "Réservé MJ" : "Général"}</td>
  </tr>`).join("");
  const content = `<div class="h0d-catalogue-dialog">
    <p><strong>${stats.references} références</strong> · ${stats.stocks} stock de scénario ·
    ${stats.protected} références protégées. La consultation ne crée aucun Item.</p>
    <p class="h0d-catalogue-muted">Rechercher dans cette fenêtre : Ctrl+F, ou utiliser l'API <code>getDefinitions({query:"..."})</code>.</p>
    <div class="h0d-catalogue-scroll"><table class="h0d-catalogue-table"><thead><tr>
    <th>Nom</th><th>Type</th><th>Rareté</th><th>Valeur indicative</th><th>Stock</th>
    </tr></thead><tbody>${rows}</tbody></table></div>
  </div>`;
  return DialogV2.wait({window:{title:"H0D — Catalogue d'objets et artefacts", resizable:true},
    content, buttons:[{action:"close",label:"Fermer",default:true}]});
}

async function h0dOpenStock(key="longue-corde-senn-p03") {
  if (!h0dState.ready) throw new Error("Catalogue non initialisé.");
  const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
  if (!DialogV2) throw new Error("Cette interface requiert Foundry VTT v14.");
  const stock = h0dGetStockResolved(key);
  if (!stock) throw new Error(`Stock de scénario inconnu : ${key}`);
  function tokenLabel(v) {
    return typeof v === "number" ? `${v}` :
      (v?.min !== undefined && v?.max !== undefined ? `${v.min}–${v.max}` : "Non défini");
  }
  const rows = stock.offres.map(o => `<tr><td>${h0dEscape(o.nom_pour_la_scene || o.objet?.name)}</td>
    <td>${h0dEscape(tokenLabel(o.prix_jetons))}</td>
    <td>${o.quantite_disponible === null ? "Non précisée" : h0dEscape(o.quantite_disponible)}</td>
    <td>${h0dEscape(o.quantite_par_achat ?? 1)}</td></tr>`).join("");
  const content = `<div class="h0d-catalogue-dialog">
    <p>${h0dEscape(stock.name)} — ${stock.offres.length} offres.<br>
    <strong>Jetons de Reconnaissance :</strong> aucun taux de conversion automatique en ressources.</p>
    <div class="h0d-catalogue-scroll"><table class="h0d-catalogue-table"><thead><tr>
    <th>Objet</th><th>Jetons</th><th>Stock</th><th>Qté / achat</th>
    </tr></thead><tbody>${rows}</tbody></table></div>
    <p class="h0d-catalogue-muted">Consultation uniquement : la création de stock fixe sera prise en charge dans Equipment Builder v0.2.0.</p>
  </div>`;
  return DialogV2.wait({window:{title:stock.name,resizable:true},
    content,buttons:[{action:"close",label:"Fermer",default:true}]});
}

const h0dCatalogueAPI = Object.freeze({
  version:H0D_CATALOGUE_VERSION,
  whenReady: () => h0dState.readyPromise,
  getStatus: h0dStats,
  getDefinition: key => h0dClone(h0dState.definitions.get(key) || null),
  getDefinitions: h0dGetDefinitions,
  getReferenceCatalog: () => h0dGetDefinitions(),
  getStock: h0dGetStock,
  getStocks: () => Array.from(h0dState.stocks.values()).map(h0dClone),
  getStockResolved: h0dGetStockResolved,
  getRecipes: h0dGetRecipes,
  getWarnings: () => h0dClone(h0dState.warnings),
  syncToEquipmentBuilder: h0dSyncToBuilder,
  syncSelectedToEquipmentBuilder: h0dSyncSelectedToBuilder,
  open: h0dOpen,
  openStock: h0dOpenStock
});

async function h0dInitialize() {
  if (h0dState.ready) return h0dStats();
  try {
    const index = await h0dFetchJSON("data/index.json");
    if (index?.format !== "H0D_CATALOGUE_INDEX" || index?.formatVersion !== 1 ||
        !Array.isArray(index.catalogues) || !Array.isArray(index.stocks)) {
      throw new Error("Format de data/index.json incompatible (index v1 attendu).");
    }
    h0dState.index = h0dClone(index);
    for (const path of index.catalogues) h0dLoadCatalogue(await h0dFetchJSON(path),path);
    for (const path of index.stocks) h0dLoadStock(await h0dFetchJSON(path),path);
    h0dState.ready = true;
    // Await pendant ready garantit que les hooks ready synchrones du builder se sont exécutés.
    const sync = h0dSyncToBuilder();
    if (globalThis.Hooks?.callAll) Hooks.callAll("h0dCatalogueReady",h0dCatalogueAPI);
    console.info(`${H0D_CATALOGUE_ID} | v${H0D_CATALOGUE_VERSION} prêt : `+
      `${h0dState.definitions.size} références, ${h0dState.stocks.size} stocks ; `+
      `builder : ${sync.status} (${sync.added} ajoutées, ${sync.protected} protégées).`);
    return h0dStats();
  } catch(err) {
    h0dState.error = String(err?.message || err);
    console.error(`${H0D_CATALOGUE_ID} | Erreur de chargement :`,err);
    if (globalThis.ui?.notifications) ui.notifications.error(`H0D Catalogue : ${h0dState.error}`);
    throw err;
  }
}

Hooks.once("ready", () => {
  if (!globalThis.game) return;
  game.h0dCatalogue = h0dCatalogueAPI;
  const module = game.modules?.get(H0D_CATALOGUE_ID);
  if (module) module.api = h0dCatalogueAPI;
  h0dState.readyPromise = h0dInitialize();
  // Empêche une promesse rejetée non gérée si aucun autre module n'attend l'API.
  h0dState.readyPromise.catch(() => {});
});
