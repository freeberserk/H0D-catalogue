# Audit préalable au rapprochement des équipements — 8 novembre 2026

**Décision MJ : option B — audit des champs en premier, rapprochement ensuite.**

**État : audit terminé, intégrations nouvelles bloquées.** Aucun nouvel équipement n'est ajouté aux 199 définitions H0D Catalogue par ce travail. Ce document établit des *candidatures* à instruire, pas des équivalences déjà acceptées.

## Sources contrôlées et méthode

- H0D Catalogue v0.1.7 : sept fichiers JSON de définitions, schéma et points à valider ; commit source `ada923f2a2bd72fa13d2fb69cd68240d94ff8bd5`.
- H0D Equipment Builder v0.2.0 : `STARTER_CATALOG` dans `scripts/h0d-equipment-builder.js` ; commit `30da4b0fee57e85837ae76fa36b8b6a18c4483e3`.
- H0D Faction Builder v0.6.5 : six fichiers JSON de factions, seulement les champs `equipement[]` ; commit `fd18d5285173476d3adfd41cb573b9e3e95ad1fd`.
- Instantané structuré : `data/audits/rapprochement-builders-2026-11-08.json`, **exclu de `data/index.json`**. Le fichier d'audit n'est pas un catalogue d'Items ni un stock.

**Distinguer :** *schéma JSON valide*, *statistiques de jeu complètes*, *économie et approvisionnement renseignés*, *équivalence d'identité prouvée*. Ces quatre conditions ne se déduisent pas l'une de l'autre. Les `0` techniques et `null` sont conservés tels quels ; ne pas les traiter comme une gratuité, une résistance nulle ou une identité établie.

## État du Catalogue actuellement publié

| Contrôle | Résultat | Lecture |
|---|---:|---|
| Références | **199** | 28 armes, 41 armures, 104 objets, 26 ressources |
| Champs structurels requis par le schéma | **199/199** | Le schéma actuel exige `key/name/kind/templateKey/props/catalogue`, **pas** la validation de tous les champs métier |
| Prix ressources non chiffré | **81** | 41 armures, 21 objets, 19 ressources ; valeurs non connues, pas automatiquement fautives |
| Rareté non renseignée | **63** | Peut être volontaire, à contrôler si commerce/stock concerné |
| Références protégées du stock standard | **80** | Prototypes, recettes, scénario, réservés et assimilés |
| Définitions déclarées non prêtes pour Builder | **19** | 15 armures ECHO et 4 modules ECHO, protégés |
| Armures avec DEF/Encombrement `null` | **15** | Précisément les armures ECHO non finalisées ; **ne pas convertir à 0** |
| Armes avec dégâts mal formés ou portée 0 en tir/jet | **0/28** | Les 28 armes canoniques ont des champs de combat cohérents selon ce contrôle |
| Objets sans type ou sans effet ET description | **0/104** | Informations de base présentes |
| Ressources avec qualité non renseignée | **2** | `cellule-solaire`, `fluide-elementaire` ; pas d'hypothèse de qualité |
| Références visibles en stock standard avec prix ressources inconnu | **40** | 15 ressources + 25 armures ; **visible en stock ne veut pas dire prix chiffré** |

Les 19 plans ECHO sont un **inachèvement documenté et protégé**, non une erreur de saisie. Les 81 prix inconnus ne doivent pas être comblés par des valeurs arbitraires.

## Lot A — 33 références historiques Equipment Builder

**Aucune des 33 n'est déclarée prête pour promotion canonique après cet audit.**
Les 33 possèdent leurs blocs `props` CSB, mais aucun champ `catalogue` avec politiques de disponibilité/rareté/prix, ni provenance paginée exploitable pour la décision de rapprochement.

- **13 armes** : coût vide ; **5** armes `distance` ont portée `0` : `arbalete-legere`, `arc-tribal`, `fronde`, `pistolet-ancien-faible`, `arc-court`.
- **7 protections** : DEF `0` à confirmer pièce par pièce. Pour une robe ordinaire ce peut être intentionnel ; pour `bouclier-leger` il faut confronter la règle maison validée du +1 Défense.
- **13 objets** : valeur à `0` ; il ne s'agit pas d'un prix de vente validé.
- **0** identifiant strictement identique à une des 199 définitions. Une similarité de nom ou de rôle ne constitue **pas** une équivalence.

| Identifiant historique | Libellé | Type | Points spécifiques en plus du manque commun de métadonnées | Promotion |
|---|---|---|---|---|
| `arbalete-legere` | Arbalète légère | Arme | coût absent ; portée 0 à vérifier | En attente |
| `cape-voyage` | Cape de voyage | Objet | valeur 0 à clarifier ; cape similaire non équivalente | En attente |
| `couteau-utilitaire` | Couteau utilitaire | Objet | valeur 0 à clarifier | En attente |
| `sacoche-pieces` | Sacoche de pièces | Objet | valeur 0 à clarifier | En attente |
| `arc-tribal` | Arc tribal | Arme | coût absent ; portée 0 à vérifier ; portée 12 m déjà signalée | En attente |
| `lance-courte` | Lance courte | Arme | coût absent | En attente |
| `armure-legere-cuir-machine` | Armure légère de cuir/machine | Protection | DEF 0 à vérifier | En attente |
| `couteau-chasse` | Couteau de chasse | Objet | valeur 0 à clarifier | En attente |
| `dague-rituelle` | Dague rituelle | Arme | coût absent | En attente |
| `fronde` | Fronde | Arme | coût absent ; portée 0 à vérifier | En attente |
| `robe-usee` | Robe usée | Protection | DEF 0 à vérifier | En attente |
| `pendentif-ruine` | Pendentif de ruine | Objet | valeur 0 à clarifier | En attente |
| `lame-blanche` | Lame blanche | Arme | coût absent | En attente |
| `pistolet-ancien-faible` | Pistolet ancien faible | Arme | coût absent ; portée 0 à vérifier | En attente |
| `manteau-clair` | Manteau clair | Protection | DEF 0 à vérifier | En attente |
| `relais-courte-portee` | Relais court-portée | Objet | valeur 0 à clarifier | En attente |
| `lame-blanche-legere` | Lame blanche légère | Arme | coût absent | En attente |
| `masque-incomplet` | Masque incomplet | Protection | DEF 0 à vérifier | En attente |
| `focus-brouille` | Fragment de Focus brouillé | Objet | valeur 0 à clarifier | En attente |
| `bras-outil-integre` | Bras-outil intégré | Arme | coût absent | En attente |
| `lampe` | Lampe | Objet | valeur 0 à clarifier | En attente |
| `module-diagnostic` | Module de diagnostic | Objet | valeur 0 à clarifier | En attente |
| `gantelet-entrave` | Gantelet d'entrave | Arme | coût absent | En attente |
| `armure-organique-legere` | Armure organique légère | Protection | DEF 0 à vérifier | En attente |
| `relais-vert-blanc` | Relais vert-blanc | Objet | valeur 0 à clarifier | En attente |
| `lame-courte-solaire` | Lame courte solaire | Arme | coût absent | En attente |
| `bouclier-leger` | Bouclier léger | Protection | DEF 0 à vérifier ; comparer règle bouclier +1 | En attente |
| `amulette-solaire` | Amulette solaire | Objet | valeur 0 à clarifier | En attente |
| `torche-ou-huile` | Torche / huile | Objet | valeur 0 à clarifier ; deux objets possibles | En attente |
| `arc-court` | Arc court | Arme | coût absent ; portée 0 à vérifier | En attente |
| `hache-ferraille` | Hache de ferraille | Arme | coût absent | En attente |
| `armure-bricolee` | Armure bricolée | Protection | DEF 0 à vérifier | En attente |
| `trophee-machine` | Trophée machine | Objet | valeur 0 à clarifier | En attente |

### Décisions de rapprochement à confirmer

1. **Arc tribal.** La fiche historique indique portée `0`. Les notes de validation du Catalogue mentionnent une correction à **12 m**. Il faut réconcilier les sources avant de déclarer sa version canonique et renseigner le coût.
2. **Bouclier léger.** La fiche historique porte une Défense `0` ; la règle de campagne validée prévoit **+1 Défense** pour le bouclier léger. Contrôler les autres champs du template, l'occupation de la main et sa catégorie avant intégration.
3. **Cape de voyage / cape de poussière renforcée.** Le Catalogue signale explicitement l'absence d'équivalence validée. Ne pas fusionner ces deux références par leur seul rôle de protection contre le désert.
4. **Torche / huile.** Le libellé historique indique un choix entre objets ; ce n'est pas la définition certaine d'un seul objet. À dédoubler ou contextualiser seulement après validation.
5. **Couteau de chasse (objet) / couteau de dépeçage (arme).** Le type et l'usage diffèrent ; la ressemblance n'autorise aucune fusion.

## Lot B — mentions d'équipement des six factions

| Document de faction | Profils | Mentions | Libellés uniques dans le document | Occurrences au nom exact du Catalogue |
|---|---:|---:|---:|---:|
| dent-ambre-pnj | 10 | 62 | 53 | 6 |
| caravanes-libres | 14 | 89 | 89 | 0 |
| pillards-rouges | 10 | 55 | 55 | 1 |
| culte-renouveau | 15 | 84 | 81 | 0 |
| heritiers-soleil | 9 | 54 | 54 | 2 |
| heliosium-endgame | 11 | 48 | 47 | 0 |
| **Total** | **69** | **392** | **379 (somme par faction)** | **9** |

Il existe **370 noms distincts à l'échelle des six documents** (certains reviennent dans plusieurs factions). Les neuf correspondances de nom ne prouvent **pas** l'égalité des propriétés CSB ; les équipements `equipement[]` sont des libellés, non des fiches techniques garanties complètes.

**Conséquence :** aucune de ces neuf correspondances ne devient un alias ni une fusion automatique. Les propriétés et les versions localisées dans les scripts des Builders devront être contrôlées avant intégration.

## Contrôle requis avant TOUT nouvel import

Un dossier doit fournir, ou signaler explicitement comme inconnu avec statut restreint :

1. **Identité :** une clé stable unique, le vrai type `weapon/armor/object/resource`, un nom et une origine ; démontrer l'équivalence avec une référence existante avant de fusionner.
2. **Provenance :** source exacte et, si documentaire, page ou décision MJ ; distinguer valeurs source, adaptation CSB et équilibrage maison.
3. **Jeu :** `props` du bon template. Armes : catégorie, dés de dégâts, modificateurs, type, portée valable si distance, mains/munitions ; armures : bonus DEF, encombrement et malus ; objets/ressources : type, utilisation, quantité et effets si pertinents.
4. **Économie :** prix (et *unité de prix*) si attesté, sinon `null`. Une valeur `0` n'est jamais créée pour masquer un prix inconnu. Coût de fabrication, durée, DD et composants uniquement si documentés/validés.
5. **Accès :** rareté, vendeurs et disponibilité, scénario/acte, `pret_pour_builder`, `visible_au_stock_standard`, `generable_stock_aleatoire`. Tant qu'un champ indispensable n'est pas arbitré, **référence proposée hors stock**, sans promotion canonique.
6. **Contrôle des régressions :** tests CSB, aucun overwrite d'Actor/Item de PJ ; vérifier que Loot et Equipment Builder consomment la même clé sans changer une variante PNJ.

### Ordre proposé

**A — 33 historiques** → **B1 — Dent d'Ambre** → **B2 — Caravanes Libres** → **B3 — Pillards Rouges** → **B4 — Renouveau** → **B5 — Héritiers du Soleil** → **B6 — HelioSium**.

L'ordre peut suivre les besoins de séances ; il ne signifie pas que toutes les références seront adaptées au commerce. Les prototypes, équipements uniques ou matériels incorporés peuvent rester consultables et interdits de stock même après validation.

**Règle de publication :** `data/index.json` ne doit jamais importer `data/audits/*.json` ni des définitions non validées. La validation humaine précède l'ajout aux fichiers de catalogue.
