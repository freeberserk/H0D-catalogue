## v0.1.15 — Correction du démarrage et de l'API publique
- Régression v0.1.14 : la version du module était demandée dès l'évaluation du script, avant le hook `ready`. Sur Foundry VTT 14, `game.modules` peut ne pas être encore disponible : exception avant l'enregistrement du hook et API `game.h0dCatalogue` jamais créée, même si le module est affiché comme actif.
- Le champ `api.version` est maintenant calculé **à la lecture**, après l'initialisation de Foundry, sans perdre le contrôle strict de cohérence entre `module.json` et `data/index.json`.
- Le test de démarrage simule explicitement `game.modules` absent lors du chargement initial puis disponible au hook `ready`, et vérifie que `game.h0dCatalogue` et `game.modules.get("h0d-catalogue").api` sont bien publiés et que le stock de Senn reste chargé.
- Aucune modification des équipements, définitions, prix, conditionnements, stocks existants ou règles de commerce.

## v0.1.12 — Charges des ressources
- 17 ressources communes dotées des charges unitaires validées (munitions inchangées).
- Pièces rares uniques : charges spécifiques non chiffrées, statut explicite de validation en attente.
- La publication synchronise maintenant les versions du manifeste et de l'index Catalogue.

## Charges des matériaux — 9 novembre 2026
- 17 ressources communes dotées de la charge unitaire validée, sans modification de leurs prix.
- 9 pièces spéciales signalées comme nécessitant une charge dédiée à valider.
- Aucune charge pour les munitions ; pas de modification des inventaires existants.
- Tests de non-régression sur les charges et les munitions.

## v0.1.11 — Jetons de Reconnaissance
- Définition canonique `jeton-reconnaissance` ajoutée, hors stocks marchands et génération aléatoire.
- Catalogue 200 définitions, avec 63 références d'équipement toujours sans prix (jeton exclu de ce décompte).
- Stock exact de Senn inchangé. Aucun paiement ni transfert de jetons automatisé par ce module seul.

## Publication automatique — correction du déclencheur et des versions

- Le workflow de release couvre désormais tous les dossiers et fichiers effectivement distribués, et plus seulement `module.json`.
- Chaque changement distribué crée une nouvelle release versionnée ; un patch est automatiquement incrémenté lorsque le numéro précédent est déjà publié.
- Le manifeste est commité avec le numéro de version final avant empaquetage ; aucune release existante n'est écrasée.
- Ajoute un test de régression sur la couverture des chemins et les protections de version.

## v0.1.9 — Tarifs et jetons des Caravanes Libres (8 novembre 2026)
- 18 prix d'armures fixés en ressources, coût total incluant les matériaux ; aucune recette non validée ajoutée.
- Offres en jetons de Senn visibles dans la fenêtre générale du Catalogue ; 21 tarifs et quantités préservés.
- Ressources non convertibles automatiquement en jetons ; des Caravanes Libres peuvent les offrir en récompense de services rendus.
- 1 jeton ≈ 2 ressources est un repère de prix, pas un change. 63 prix en ressources demeurent non définis.
- Audit v0.1.8 conservé comme instantané, tests adaptés aux 18 nouveaux tarifs.

## v0.1.8 — Audit de complétude avant rapprochement
- Audit détaillé des 199 définitions canoniques, des 33 références historiques et des 392 mentions d'équipement de factions.
- Vérification distincte des champs CSB, de l'identité, de la source documentaire, des prix, de la rareté et des disponibilités.
- 33 candidats conservés en attente, **0 import nouveau** et **0 chiffre inventé**.
- Dossiers JSON horodatés et rapport de décisions, exclus du registre runtime.
- Test CI de non-promotion des données incomplètes.

## v0.1.7 — Identité canonique et sélection de stock
- Résolution stricte par identifiant, nom exact ou alias documenté, avec contrôle du type et signalement des ambiguïtés.
- API de liste des marchandises autorisées en stock standard.
- Source de référence commune aux Builders, sans modifier automatiquement les 199 définitions existantes ni les fiches Foundry.

# Journal des versions — H0D Catalogue

## v0.1.6 — Munitions (25 octobre 2026)

- 40 nouvelles fiches objet (3 munitions classiques, 1 bille renforcée anti-blindage, 36 élémentaires) et correction de `fleches-renforcees` historique.
- 12 profils (Feu, Gel, Choc, Acide × 3 paliers), déclinés en flèches/car­reaux/billes pour leurs familles Foundry ; destruction systématique des élémentaires.
- Renforcées réutilisables si retrouvées : flèche accélérée +1 attaque, bille anti-blindage 2 DEF d’armure/plaques et +1 détachement de pièce.
- Lots classiques 20 (carreaux 10) ; renforcées 10 ; élémentaires 5/3/2, +1d6/+2d6/+3d6, état 0/2/3 rounds, DD 15/18 ; artisanat DD 12/15/18.
- 199 références, 80 recettes (37 standards), 80 protégées, 21 offres Senn inchangées dont demi-lot historique x5.
- Calcul des +Xd6 élémentaires, prix unitaires fractionnaires, effets d’états et compatibilité bille/javelot restent des limites manuelles Foundry.

## v0.1.5 — Armes des cinq factions (21 octobre 2026)

- 28 fiches `item-arme` pour cinq factions ; Arc simple/Arc tribal unifié conceptuellement, sans modifier de force le Builder.
- 28 champs Foundry, coût, matériaux, DD de fabrication et munitions renseignés ; 28 recettes ajoutées aux 11 précédentes.
- Arbalète de poignet 1d4, FOR ×1,5 supprimée, FOR sur javelots/frondes mais pas arcs/arbalètes/lance-câble.
- Armes hybrides conservent leur mode physique à court d'énergie ; fouet à 6 m ; aucune panne des armes pillardes en usage normal.
- Effets de contrôle manuels, DD indicatifs ; surcharge volontaire **non chiffrée et non activée**.
- 159 références dont 28 armes, 39 recettes (20 standards), 56 protégées ; 13 armes standards + 15 armes réservées au MJ.
- Les 21 offres Senn et les 19 plans ECHO sont préservés.

## v0.1.4 — Sept objets bricolés des Caravanes Libres (19 octobre 2026)

- 7 objets `item-objet` validés : bouclier-bâche, crochet de décrochage, crochet de sauvetage, caisse-leurre, attaches de largage, amortisseur de harnais, coffret à double fond.
- 26 champs Foundry remplis par objet ; charges, valeurs, DD et effets validés par le MJ.
- 7 recettes à base de PM et FS ajoutées aux 4 précédentes (11 fabrications validées) ; effets appliqués manuellement.
- 131 références totales : 64 objets/plans de modules, 26 ressources, 41 armures/plans.
- Pont vers Equipment Builder conservateur, 90 références standards (contre 83), 41 protégées inchangées.
- Les 21 offres de Senn restent intactes ; la phase 1/2 ECHO et HelioSium ne changent pas.

## v0.1.3 — Forge ECHO, modules énergétiques, HelioSium (19 octobre 2026)

- 20 nouvelles références : 15 plans de protections spéciales ECHO (cinq familles × paliers +1/+2/+3), 4 plans de modules énergétiques, 1 armure blanche HelioSium.
- Deux phases ECHO : armures spéciales sans noyaux ; modules énergétiques accessibles conceptuellement après la Griffe, l'Œil et le Soleil Brisé.
- Les 19 plans non chiffrés sont protégés et **non importables dans Equipment Builder** ; les bonus DEF totaux et l'encombrement ne sont pas inventés.
- Armure blanche HelioSium : DEF +2, Enc. 0, malus 0, régénération 1d4 PV / round pendant 3 rounds (1 fois/combat), instabilité cumulative 1/4 PV soignés et confusion de reconnaissance des cibles (Volonté DD 15 / 18).
- Un import ciblé `syncSelectedToEquipmentBuilder(["armure-blanche-heliosium"])` permet au MJ d'enregistrer la seule armure blanche sans exposer tous les objets réservés.
- 124 références (57 objets/modules, 26 ressources, 41 armures/plans), 41 références protégées ; 21 offres et 4 fabrications préservées.
- Aucun déblocage de noyau ni effet de régénération/instabilité automatiquement appliqué par Foundry.
- La phase 2 du boss HelioSium (fusion avec Machines Blanches) reste à concevoir séparément.

## v0.1.2 — Armures du Culte du Renouveau (19 octobre 2026)

- 7 protections `item-armure` : 3 références V1 (Initié, Zélote, Oracle), 4 références V2 (Harnais converti, Blindages greffés léger/lourd, Exo-armure de Transfiguration).
- Greffés : blindages intégrés Enc. 2, respectivement DEF +1 et +2, pénalités de vitesse -1,5 m et -3 m non automatisées.
- Inquisiteurs : exo-armure DEF +3, Enc. effectif 0, malus 0, vitesse non pénalisée grâce à l'assistance motorisée.
- Élus de Zalem exclus : ce sont des profils de créatures/PNJ, pas des armures à enfiler.
- 104 références au total (53 objets, 26 ressources, 25 armures) ; 4 fabrications et 21 offres de Senn inchangées.
- Caveat : le Builder v0.1.1 ne filtre pas les protections greffées lors de stocks aléatoires ; ne pas les attribuer comme loot portable.
- Aucune résistance ou bonus mécanique supplémentaire inventés.

## v0.1.1 — Armures des factions validées (18 octobre 2026)

- 18 nouvelles armures : Dent d'Ambre (7), Caravanes Libres (3), Pillards Rouges (4), Héritiers du Soleil (4).
- Récupérateur : DEF +2, encombrement 1 (Template Manager).
- Pillards Rouges : assemblages incomplets, protections de jambes décoratives non cumulables.
- Héritiers du Soleil : ensembles complets ; Feu 1/2/1 sur les armures militaires et Feu 3 / Choc 3 sur le technicien.
- 79 références existantes, quatre fabrications, 21 offres de Senn conservées.
- Aucun ajout d'armures HELIOS / ELYSIUM / Culte ni de statistiques non validées.
- Ajout du workflow de publication Foundry depuis la branche principale.

# Journal des versions — H0D Catalogue

## v0.1.0 — pack initial (18 octobre 2026)

- Premier catalogue : 79 références (53 objets, 26 ressources), 4 fabrications validées.
- Stock nommé `longue-corde-senn-p03` : 21 offres et prix de scène en Jetons de Reconnaissance.
- Chargement local par `data/index.json` et API `game.h0dCatalogue`.
- Pont facultatif non destructif vers H0D Equipment Builder v0.1.0 : 58 entrées générales, 21 entrées protégées.
- Consultation du catalogue et du stock de Senn en lecture seule.
- Schémas JSON, contrôles Node.js et workflow GitHub Releases.
- Aucun module de commerce/achat/fabrication automatisé dans cette version.
