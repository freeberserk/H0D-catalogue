# Journal des versions — H0D Catalogue

## v0.1.5 — Armes des cinq factions (21 octobre 2026)

- 28 fiches `item-arme` pour cinq factions ; Arc simple/Arc tribal unifié conceptuellement, sans modifier de force le Builder.
- 28 champs Foundry, coût, matériaux, DD de fabrication et munitions renseignés ; 28 recettes ajoutées aux 11 précédentes.
- Arbalète de poignet 1d4, FOR ×1,5 supprimée, FOR sur javelots/frondes mais pas arcs/arbalètes/lance-câble.
- Armes hybrides conservent leur mode physique à court d'énergie ; fouet à 6 m ; aucune panne des armes pillardes en usage normal.
- Effets de contrôle manuels, DD indicatifs ; surcharge volontaire **non chiffrée et non activée**.
- 159 références dont 28 armes, 39 recettes (24 standards), 56 protégées ; 13 armes standards + 15 armes réservées au MJ.
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
