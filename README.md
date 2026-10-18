# H0D Catalogue — Objets & Artefacts

**Version du module : 0.1.0** · **État des données : v0.1.0-draft**  
**Cible : Foundry VTT 14 + Custom System Builder 6.0.2+**  
**Compatible de manière facultative avec H0D Equipment Builder v0.1.0.**

Dépôt prévu : `https://github.com/freeberserk/h0d-catalogue` (le créer puis publier une release ; il n'est **pas** créé par ce ZIP).

## Rôle

Ce module est **la source centralisée des données H0D**, pas un second générateur d'équipement.

Il embarque :

- **79 références** du catalogue `Objets & Artefacts` (53 objets et 26 ressources) ;
- **4 fabrications validées** dans ces références ;
- **21 offres de la Longue-Corde (Senn, Prologue P-03)** ;
- **21 références protégées** des stocks aléatoires standards (objets spéciaux de scénario, fabrication, ou réservés MJ) ;
- les coûts, raretés, descriptions et disponibilités tels que fournis par les sources, **sans inventer les données manquantes**.

Les armes et armures du Compendium PDF sont **hors périmètre de cette première version**, car des versions plus récentes de leurs caractéristiques existent dans H0D Template Manager. Elles pourront être intégrées après rapprochement, sans écraser les Items actuels.

Les 33 objets déjà contenus dans Equipment Builder v0.1.0 **ne sont pas copiés** dans ces 79 entrées.

## Installation

### A. Installation locale — utilisable immédiatement

1. Arrêter Foundry ou désactiver le monde pendant la copie.
2. Créer le répertoire `FoundryVTT/Data/modules/h0d-catalogue/`.
3. Décompresser **`h0d-catalogue.zip`** directement dedans : le fichier `module.json` doit être à la racine de ce dossier.
4. Relancer Foundry, activer **H0D Catalogue — Objets & Artefacts** dans le monde Custom System Builder.
5. Ouvrir la console (F12), saisir `game.h0dCatalogue.getStatus()` : le résultat doit indiquer `ready: true`, `references: 79`, `stocks: 1`.

Aucun Item, aucune macro et aucun dossier ne sont créés automatiquement lors de l'activation.

### B. Depuis GitHub — après publication du dépôt

1. Créer le dépôt GitHub **`freeberserk/h0d-catalogue`** et y copier le contenu du **ZIP source** à la racine.
2. Pousser un tag `v0.1.0` (la GitHub Action jointe crée alors la release avec un ZIP et le manifeste).
3. Dans Foundry, installer via le manifeste :  
   `https://github.com/freeberserk/h0d-catalogue/releases/latest/download/module.json`

**Attention : l'URL ne fonctionnera qu'après création du dépôt et publication d'une release.**

## Lien avec Equipment Builder

Le pont d'intégration est **facultatif et conservateur** :

- à l'initialisation, les **58 références communes** sont transmises à `game.h0dEquipmentBuilder` si le Builder est actif ;
- une définition possédant déjà la même clé dans le Builder n'est **jamais remplacée** ;
- les **21 références protégées** ne sont **pas** transmises par défaut, car le Builder v0.1 ne peut pas encore les exclure de ses tirages aléatoires ;
- aucune synchronisation ne crée ni ne modifie les Items du monde ou des fiches de PJ.

On peut lancer une synchronisation idempotente :

```js
await game.h0dCatalogue.whenReady();
game.h0dCatalogue.syncToEquipmentBuilder();
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
game.h0dCatalogue.getRecipes();
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
