# H0D Catalogue — Objets & Artefacts

**Version du module : 0.1.5** · **Objets et ressources : v0.1.0-draft ; armures des factions : v0.1.2 ; Forge ECHO / HelioSium : v0.1.3**  
**Cible : Foundry VTT 14 + Custom System Builder 6.0.2+**  
**Compatible de manière facultative avec H0D Equipment Builder v0.1.0.**

Dépôt officiel : `https://github.com/freeberserk/H0D-catalogue`.

## Rôle

Ce module est **la source centralisée des données H0D**, pas un second générateur d'équipement.

Il embarque :

- **159 références** : 64 objets/plans de modules, 26 ressources, 41 armures/plans et 28 armes des cinq factions ;
- **39 fabrications enregistrées** (20 standards, 19 réservées) dans ces références ;
- **21 offres de la Longue-Corde (Senn, Prologue P-03)** ;
- **56 références protégées** des stocks aléatoires standards (objets spéciaux de scénario, fabrication, ou réservés MJ) ;
- les valeurs sources conservées et, pour les armes ajoutées, des prix/recettes calibrés sur Commerce v2 et non présentés comme des chiffres originels du Compendium.

Les armes de faction sont intégrées en v0.1.5 ; les protections et armes HELIOS/ELYSIUM spécifiques restent à traiter. Les 18 armures des premières factions se trouvent dans `data/catalogue-armures-factions.json` ; les 7 protections du Culte dans `data/catalogue-armures-renouveau.json` ; et les 20 nouvelles références ECHO/HelioSium dans `data/catalogue-forge-echo-heliosium.json`. Les Élus de Zalem relèvent du Bestiaire, pas d'un item-armure. Les résistances Feu et Choc des Héritiers utilisent la table de traits H0D Armure v2.0.

Les 33 objets déjà contenus dans Equipment Builder v0.1.0 **ne sont pas copiés** dans ces 79 entrées.

## Installation

### A. Installation locale — utilisable immédiatement

1. Arrêter Foundry ou désactiver le monde pendant la copie.
2. Créer le répertoire `FoundryVTT/Data/modules/h0d-catalogue/`.
3. Décompresser **`h0d-catalogue.zip`** directement dedans : le fichier `module.json` doit être à la racine de ce dossier.
4. Relancer Foundry, activer **H0D Catalogue — Objets & Artefacts** dans le monde Custom System Builder.
5. Ouvrir la console (F12), saisir `game.h0dCatalogue.getStatus()` : le résultat doit indiquer `ready: true`, `references: 159`, `stocks: 1`.

Aucun Item, aucune macro et aucun dossier ne sont créés automatiquement lors de l'activation.

### B. Installation depuis GitHub

Depuis la release **v0.1.5**, installer dans Foundry avec ce manifeste :

`https://github.com/freeberserk/H0D-catalogue/releases/latest/download/module.json`

Les releases sont construites par GitHub Actions, à partir du code validé dans la branche `main`.

## Lien avec Equipment Builder

Le pont d'intégration est **facultatif et conservateur** :

- à l'initialisation, les **103 références non protégées** sont transmises à `game.h0dEquipmentBuilder` si le Builder est actif ;
- une définition possédant déjà la même clé dans le Builder n'est **jamais remplacée** ;
- les **56 références protégées** ne sont **pas** transmises par défaut, car le Builder v0.1 ne peut pas encore les exclure de ses tirages aléatoires ;
- aucune synchronisation ne crée ni ne modifie les Items du monde ou des fiches de PJ.

On peut lancer une synchronisation idempotente :

```js
await game.h0dCatalogue.whenReady();
game.h0dCatalogue.syncToEquipmentBuilder(); // 103 références standards synchronisées
// Quand le MJ autorise explicitement l'armure de fin de campagne :
game.h0dCatalogue.syncSelectedToEquipmentBuilder(['armure-blanche-heliosium']);
// Ne pas appeler includeRestricted:true en partie ordinaire ; cela inclut aussi des objets de scénario.
```

Le mode `includeRestricted:true` existe pour le développement, mais **ne doit pas être activé dans un monde de partie** tant que le Builder v0.1 n'exclut pas les références réservées de ses stocks aléatoires.

Le stock exact de Senn est disponible dans l'API, mais **n'est pas encore créé en tant que dossier d'Items**. Le futur Builder v0.2 pourra exploiter la description de ce stock ; aucune conversion automatique des jetons n'est prévue.

## API de lecture

L'API est exposée au `ready` sur `game.h0dCatalogue` et `game.modules.get('h0d-catalogue').api` :

```js
await game.h0dCatalogue.whenReady();

game.h0dCatalogue.getStatus();
game.h0dCatalogue.getDefinition('radar-de-scrapper-intact');
game.h0dCatalogue.getDefinitions({kind: 'resource'});
game.h0dCatalogue.getDefinitions({query: 'lentille'});
game.h0dCatalogue.getDefinitions({includeRestricted: false});
game.h0dCatalogue.getReferenceCatalog();     // définitions compatibles Equipment Builder

game.h0dCatalogue.getStocks();
game.h0dCatalogue.getStock('longue-corde-senn-p03');
game.h0dCatalogue.getStockResolved('longue-corde-senn-p03');
game.h0dCatalogue.getRecipes();                       // 39 recettes au total, comme en v0.1.4
game.h0dCatalogue.getRecipes({includeRestricted:false}); // 20 recettes standards uniquement
game.h0dCatalogue.getDefinitions({originKey: 'forge-echo'}); // 15 plans d'armures + 4 plans de modules
game.h0dCatalogue.getDefinition('armure-blanche-heliosium');
// Import explicite et ciblé dans le Builder (réservé au MJ):
game.h0dCatalogue.syncSelectedToEquipmentBuilder(['armure-blanche-heliosium']);
game.h0dCatalogue.getWarnings();

game.h0dCatalogue.open();                // navigateur de référence en lecture seule
game.h0dCatalogue.openStock();           // tableau des 21 offres de Senn
```

Pour accéder plus facilement aux deux interfaces, tu peux copier le code des fichiers `macros/` dans des macros de type **Script** dans Foundry.

Les données sont **clonées** avant leur retour : un autre module ne peut pas modifier silencieusement le catalogue canonique en manipulant les réponses de l'API.

Un hook `h0dCatalogueReady` expose l'API dès que les données sont chargées, pour une intégration future côté Builder.

## Structure

```text
h0d-catalogue/
├── module.json
├── README.md
├── CHANGELOG.md
├── data/
│   ├── index.json
│   ├── catalogue-objets-artefacts.json  (79 références)
│   ├── catalogue-armures-factions.json  (18 armures)
│   ├── catalogue-armures-renouveau.json  (7 protections)
│   ├── catalogue-forge-echo-heliosium.json (15 plans ECHO, 4 modules, 1 armure HelioSium)
│   ├── catalogue-objets-caravanes.json (7 objets caravaniers validés)
│   ├── catalogue-armes-factions.json (28 armes des 5 factions)
│   └── stocks/
│       └── longue-corde-p03.json       (21 offres)
├── scripts/h0d-catalogue.js
├── styles/h0d-catalogue.css
├── macros/                          (macros facultatives)
├── schemas/                         (descriptions JSON Schema)
├── docs/                            (intégration, validation)
├── tests/                           (Node.js sans dépendances)
└── .github/workflows/release.yml    (publication des ZIPs)
```

Ajouter une nouvelle référence : l'insérer dans `data/catalogue-objets-artefacts.json` avec une clé unique. Ajouter un autre catalogue : déclarer son chemin dans `data/index.json`. Ajouter un stock : placer un JSON dans `data/stocks/` et le déclarer dans l'index.

## Contrôles

À partir de Node.js 20+ :

```bash
node tests/validate-catalogue.mjs
node tests/runtime-smoke.mjs
```

Le premier contrôle l'intégrité des références et les 21 offres. Le second teste le chargement, l'API, la protection des Items réservés, la non-écrasement des clés déjà présentes et l'idempotence du pont Builder, avec une **simulation** de l'environnement Foundry (pas un test de Foundry en conditions réelles).

## Invariants du projet

- L'origine technique / tribale d'un objet n'est **pas** équivalente au vendeur qui peut le proposer.
- Une même pièce fonctionnellement équivalente peut servir à plusieurs recettes d'un même équipement, après validation MJ.
- `prix_ressources:null` et `valeur_troc:null` signifient **prix inconnu**, jamais « gratuit ».
- `quantite_disponible:null` signifie **quantité non précisée**, jamais « illimitée ».
- Les Jetons de Reconnaissance de P-03 ne sont **pas convertis** automatiquement en ressources.
- Les quatre fabrications sont validées, **sans automatisation des bonus de combat** ni modification du template des armes.
- Les valeurs et effets non fixés restent signalés comme tels ; voir `docs/POINTS-A-VALIDER.md`.

## Dépôts voisins

- Equipment Builder : https://github.com/freeberserk/h0d-equipment-builder
- Template Manager : https://github.com/freeberserk/H0D-template-manager

## Licence

Aucune licence open source n'est attribuée automatiquement. Choisir une licence avant d'ouvrir éventuellement le code à des contributions externes.


## Armures des factions — v0.1.1

- Dent d'Ambre : 7, dont armure de récupérateur DEF +2 / Enc. 1.
- Caravanes Libres : 3, dont veste de récupérateur itinérant.
- Pillards Rouges : 4 assemblages fragmentaires ; genouillères et tassettes intégrées sans bonus de DEF cumulable.
- Héritiers du Soleil : 4 armures complètes, dont tenue de technicien Feu 3 / Choc 3.
- Les 3 emplacements d'amélioration du template H0D Armure v2.0 restent vides à la création.
- Aucun prix inconnu n'a été remplacé par zéro. HELIOS et ELYSIUM restent hors périmètre.

Avant le déploiement en partie, vérifier dans un monde test la lecture des traits de résistance par Custom System Builder.


## Culte du Renouveau — v0.1.2

Sept références `item-armure` figurent dans `data/catalogue-armures-renouveau.json` :
trois équipements V1 (Robe-armure d'initié, Armure de zélote, Tenue d'Oracle)
et quatre protections V2 (Harnais de converti augmenté, Blindage greffé léger,
Blindage greffé lourd, Exo-armure de Transfiguration).

| Référence | DEF | Encombrement | Malus | Vitesse |
|---|---:|---:|---|---|
| Robe-armure d'initié | +1 | 1 | 0 | pas de pénalité distincte |
| Armure de zélote | +2 | 2 | −2 tests | 7,5 m indicatifs dans l'ancien compendium |
| Tenue d'Oracle | +1 | 1 | 0 | pas de pénalité distincte |
| Harnais de converti augmenté | +2 | 2 | −1 tests | 0 |
| Blindage greffé léger | +1 | 2 | non défini pour tests | −1,5 m |
| Blindage greffé lourd | +2 | 2 | non défini pour tests | −3 m |
| Exo-armure de Transfiguration | +3 | **0 effectif** | **0** | **0** |

**Attention :** les blindages greffés sont permanents et **ne sont pas des armures amovibles**.
Leur enregistrement comme `item-armure` sert à la consultation des références PNJ
dans le Builder. Les attributs `utilisable_comme_item_pj: false` et
`generable_stock_aleatoire: false` sont pour l'instant informatifs :
**le Builder v0.1.1 ne les applique pas automatiquement aux tirages de stocks**.
N'utilisez pas ces blindages comme butin portable.

L'Equipment Builder n'a pas de champ natif de vitesse. Les malus des greffes
sont inscrits dans `H0D_Armure_Malus`, dans la description et dans
`catalogue.malus_vitesse_metres`, **sans automatisation de la vitesse dans Foundry**.

L'exo-armure neutralise la charge effective, les malus et le ralentissement
liés aux greffes du porteur. Elle n'octroie **ni bonus de Force ni capacité de portage supplémentaire**
sans règle validée. Les variantes fusionnées demandent un démontage spécialisé.
Les **Élus de Zalem** (humains augmentés, cyborgs, corps synthétiques)
relèvent de fiches PNJ dédiées et sont absents du catalogue d'armures.


## Forge ECHO et HelioSium — v0.1.3

**20 nouvelles références** sont intégrées au Catalogue, dans `data/catalogue-forge-echo-heliosium.json`.
Ce sont **15 plans d'armures spéciales ECHO** (5 familles × 3 paliers), **4 plans de modules énergétiques**
et **1 véritable armure blanche HelioSium**.

### Forge ECHO, phase 1 : avant les trois noyaux

Cinq familles : Traqueur (furtivité), Bastion (défense lourde), Isolateur (isolation élémentaire passive),
Récupérateur avancé (maintenance/démontage), Veilleur (observation/Focus).
Chaque famille dispose des paliers de qualité **+1 / +2 / +3**.

**ATTENTION : plans validés, caractéristiques non finalisées.** Le palier +N est enregistré
comme `catalogue.palier_amelioration` et **pas comme DEF totale**.
Leurs `H0D_Armure_Bonus_Defense` et `H0D_Armure_Encombrement` valent `null`,
car il manque encore la DEF totale, l'encombrement, le malus, les valeurs des aptitudes
et les recettes/coûts. Pour éviter de créer de fausses armures jouables,
ces 15 références ont `catalogue.pret_pour_builder:false` :
elles sont consultables dans le Catalogue, mais **ne sont jamais importées
dans Equipment Builder**, même en mode `includeRestricted:true`.

### Forge ECHO, phase 2 : après les noyaux

L'ajout des **trois noyaux — Griffe, Œil, Soleil Brisé** ouvre l'accès
à quatre plans de modules énergétiques : bouclier, résistance élémentaire active,
plaques mouvantes et assistance IA. Les modules sont compatibles en principe
avec les armures ECHO appropriées, **mais leurs emplacements, coûts et paramètres
de jeu restent à déterminer**. Aucun module n'est encore importable dans le Builder,
et aucune règle ne déverrouille automatiquement la forge dans Foundry.

La réactivation de cette production avancée est liée à l'étape des trois noyaux
de l'Acte II et aux technologies HELIOS, sans renommer ni fusionner arbitrairement
la Forge ECHO et le laboratoire HELIOS du scénario.

### Armure blanche HelioSium : Acte V uniquement

Il s'agit bien d'une **armure d'HelioSium**, et **pas** d'une armure d'adepte ELYSIUM avant l'Acte V.

- **DEF +2, Enc. effectif 0, malus 0, ralentissement 0** par assistance IA.
- **Régénération : 1d4 PV par round, trois rounds, une activation par combat**.
  Aucun réveil automatique d'un porteur déjà à 0 PV ; ne compter que les PV réellement restaurés.
- **Instabilité : +1 point par tranche complète de 4 PV effectivement régénérés**, en cumulant
  entre les activations et les combats ; repos ordinaire insuffisant pour l'effacer.
- Instabilité 0–1 : rien de visible ; 2–3 : doute ; 4–5 :
  **Volonté DD 15** sur une attaque de cible jugée hostile ; 6+ :
  **Volonté DD 18** avec risque de confusion allié/ennemi.
  Un échec déforme l'identification des cibles, mais ne force **pas**
  automatiquement une attaque sur un allié.

**Ces effets ne sont pas automatisés par le Builder et nécessitent une gestion manuelle en jeu.**
L'armure est enregistrée comme fiche `item-armure` complète mais réservée au MJ
et absente des stocks aléatoires. Pour la rendre disponible au Builder, uniquement
lorsque le MJ le décide à l'Acte V :

```js
await game.h0dCatalogue.whenReady();
game.h0dCatalogue.syncSelectedToEquipmentBuilder(["armure-blanche-heliosium"]);
```

L'import est additif : une définition de même clé déjà présente n'est pas écrasée.
Ce nouvel import ciblé permet de garder les autres objets de scénario protégés.
La proposition de **phase 2 du boss HelioSium par fusion avec des Machines Blanches**
reste une piste narrative extérieure à ce catalogue, non développée ici.

### Sécurité de publication

- 159 références totales, **56 protégées** par défaut.
- **103** définitions standards exposées au Builder sans modifier les 97 précédentes.
- Les 19 plans à finaliser ne peuvent jamais être synchronisés vers Equipment Builder
  tant que `pret_pour_builder:false` reste en vigueur.
- 21 offres de Senn, 11 fabrications précédentes + 28 recettes d’armes et 1 stock de scénario inchangés.
- Prix et coûts manquants conservés à `null`, jamais à zéro.


## Objets bricolés des Caravanes Libres — v0.1.4

Sept objets `item-objet` validés par le MJ sont ajoutés dans
`data/catalogue-objets-caravanes.json` :
**bouclier-bâche renforcé**, **crochet de décrochage**,
**crochet de sauvetage caravanier**, **caisse-leurre**,
**attaches de largage rapide**, **amortisseur de harnais nomade**
et **coffret à double fond**.

Chaque définition conserve ses **26 champs Foundry** : charge, valeur de commerce
générale, quantité, état, origine, utilisations, recharge, compatibilité,
description et effet. Les caractéristiques ont été proposées puis approuvées
par le MJ ; elles ne sont pas prétendues issues telles quelles du PDF.

Les **sept recettes** à base de plaques de machine et de faisceaux de fibres
s'ajoutent aux quatre fabrications précédentes. La méthode `getRecipes()`
renvoie ainsi **11 fabrications validées**, sans automatiser leur réalisation.

Les effets enregistrés sont : bouclier-bâche (+2 DEF de couvert uniquement contre
tirs selon orientation, deux mains, demi-vitesse) ; crochet de décrochage
(Réparation DD 12/15 en urgence) ; caisse-leurre (Perception DD 15 en fouille
rapide, une utilisation par largage) ; attaches (largage préparé par action de
mouvement, réarmement 10 min) ; amortisseur (+2 à un jet de Conduite ou
Réparation pour préserver chariot/attelage d'une secousse) ; coffret
(Perception DD 15 rapide, DD 10 approfondie).

**Crochet de sauvetage caravanier :** lancer à 6 m maximum, corde de 9 m,
Dextérité DD 12 (chariot lent) / 15 (rapide) / 18 (pleine vitesse), puis
Athlétisme DD 12 ou 15 pour se hisser sur une action de mouvement suivante.
Réussir à s'accrocher n'est pas monter à bord ; traction et obstacles gardent
leurs conséquences.

Les effets restent **appliqués manuellement** par le MJ dans Foundry ; aucun
script ne simule automatiquement les DD, le couvert ou les déplacements.

Ces sept définitions sont disponibles dans **Equipment Builder** via la
synchronisation additive, sans écraser les définitions préexistantes.
Le stock précis de Senn au Prologue P-03 conserve **ses 21 offres** ;
aucune nouvelle offre n'a été ajoutée à ce stock.
Les 19 plans ECHO non chiffrés restent interdits d'import.


## Armes des cinq factions — v0.1.5

**28 armes** dans `data/catalogue-armes-factions.json` (11 Dent d'Ambre,
3 Caravanes Libres, 8 Pillards Rouges, 2 Renouveau, 4 Héritiers du Soleil),
avec leurs **28 propriétés item-arme**, coût et recette. L'**Arc simple**
du Compendium est la même arme que l'**Arc tribal** déjà présent dans
Equipment Builder : il n'est **pas dupliqué**. La correction effective de
l'Arc tribal dans Builder (portée 12 m, munition flèche, etc.) n'est pas
incluse dans cette version, puisque le pont est conservateur.

Arbitrages intégrés : FOR normale (jamais ×1,5 aux armes deux mains),
arbalète de poignet **1d4**, FOR dégâts sur javelots/frondes mais pas sur
arcs/arbalètes/lance-câble. Fouet électrique **6 m maximum** (3+3),
mode électrique **1d6 Choc**, mode physique sans charge **1d4 contondant**.
Arc à bobine et arc solaire sans énergie **1d6 perforant**, lance solaire
**1d8 perforant**, gantelet broyeur **1d6 contondant**.
Les armes entièrement énergétiques ne tirent pas sans énergie.

Les Pillards ne risquent **aucune panne en utilisation normale** ;
la surpuissance volontaire n'est **pas activée**, faute de règles
chiffrées approuvées. Traction, entrave légère et renversement utilisent
des DD indicatifs, révisables, et des effets appliqués **manuellement**.
Chaîne-crochet 9 m est une proposition distincte du fouet confirmé à 6 m.

### Protection et recettes

- 13 armes standards (Dent d'Ambre et Caravanes, hors Arc à bobine)
  accessibles à Equipment Builder par défaut.
- 15 armes réservées : 8 Pillards, 2 Culte, 4 Héritiers et Arc à bobine.
  Consultables par `getDefinitions({kind:"weapon",includeRestricted:true})`,
  importables uniquement sur décision du MJ, par exemple :

```js
await game.h0dCatalogue.whenReady();
game.h0dCatalogue.syncSelectedToEquipmentBuilder(["fouet-electrique-pillards"]);
```

  **Attention :** même l'import ciblé rend potentiellement l'arme
  disponible aux tirages aléatoires du Builder v0.1, qui ne filtre pas
  encore ce statut. Ne pas importer tout le matériel réservé d'un coup.
- 28 nouvelles recettes : **39 recettes au total**, y compris celles du matériel réservé, renvoyées par `getRecipes()` ; **20 recettes standards** seulement avec `getRecipes({includeRestricted:false})`.
- Un seul compteur de munitions natif par arme : les arcs utilisant
  flèche + cellule nécessitent un **deuxième suivi manuel**. Les
  modes physiques/énergétiques ne changent pas automatiquement les
  dégâts du formulaire.
- Plusieurs conditionnements de munitions du plan (flèches solaires,
  billes, carreaux courts, câble-harpon, batterie lourde) n'ont pas
  encore d'Items autonomes ; seuls leurs usages sont documentés.
- Les 21 offres fixes de Senn sont **inchangées**, comme les 19 plans
  non chiffrés de la Forge ECHO.
