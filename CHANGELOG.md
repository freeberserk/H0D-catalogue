# Journal des versions — H0D Catalogue

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
