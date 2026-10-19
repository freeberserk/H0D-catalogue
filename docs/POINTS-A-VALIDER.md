# Points explicitement laissés à valider

Ces décisions ne doivent PAS être tranchées par le module, car les sources ne les fixent pas ou des versions plus récentes des templates existent.

1. Coûts en ressources des douze objets exclusifs de Senn : **inconnus**.
2. Valeur variable d'une pièce rare : conserver une fourchette, ne pas en tirer un prix fixe.
3. Épaulières de route : -1 dégâts **une seule fois avant la fin du Prologue**, sans bonus permanent de DEF ; valorisation possible 2 PM.
4. Genouillères : +1 narratif dans un contexte pertinent, ou 1 PM + 1 FS ; prix **1 à 2 jetons** selon la négociation, sans arbitrage automatique.
5. Cape de poussière renforcée / Cape de voyage du Builder : rapprochement possible, mais aucun bonus chiffré commun validé.
6. Lentille fissurée / lentille rayée : l'équivalence de stock reste à confirmer.
7. Rations épicées P-03 / rations 2 jours : la durée exacte des rations épicées n'est pas précisée.
8. Flèches renforcées : leur bonus de combat précis n'est pas défini dans le Compendium PDF fourni.
9. Prix des armes/armures et divergences PDF ↔ fichiers de référence du Template Manager : rapprochement à faire avant un import.
10. Module de visée commercial / Viseur du Chasseur validé : ne pas fusionner sans décision MJ.
11. Modification technique des armes CSB et application automatique des quatre fabrications : hors périmètre.
12. Quantités de Senn non spécifiées : `null` signifie **inconnu**, pas stock illimité.

## Sources directes

- `Zero_Dawn_Commerce_v2(1).pdf` p.1 à 4.
- `Fiche_MJ_Prologue_3_Preparatifs_du_Sud(1).pdf` p.5.
- `Compendium_Foundry_Armes_Armures_Zero_Dawn-1.pdf` p.3.
- Décisions de campagne : Pointe du Prédateur, Veilleur du Scrapper, Viseur du Chasseur, Capsules incendiaires.

Voir aussi la liste `a_valider` conservée dans `data/catalogue-objets-artefacts.json`.


## Armures — v0.1.1

- La résistance Choc +2 du harnais de dompteur était provisoire ; elle n'est pas activée.
- La Veste de récupérateur itinérant conserve un malus indicatif de 0, en attente de bilan.
- Vitesse, DEX maximum et prérequis de Force des tableaux historiques sont uniquement mentionnés dans les descriptions.
- Pillards Rouges : casques, tassettes et genouillères dans les assemblages de base, sans cumul défensif. Pièces exceptionnelles à effets particuliers reportées.
- HELIOS, ELYSIUM et Culte du Renouveau V1/V2 réservés à une validation ultérieure.
- Les 18 prix restent inconnus, pas gratuits.


## Culte du Renouveau V1/V2 (v0.1.2)

- Les 7 armures/protections sont enregistrées dans le Catalogue. Les Élus de Zalem relèvent du Bestiaire et n'ont **aucune référence item-armure**.
- Greffés : Enc. 2 pour les blindages léger et lourd ; vitesse respectivement −1,5 m et −3 m ; cette vitesse n'est pas automatisée par le Builder actuel.
- L'exo-armure des Inquisiteurs annule la charge effective, les malus et le ralentissement des greffes. Ni Force ni capacité de transport accrue ne sont accordées.
- Les fiches de blindages greffés sont utilisables comme références dans le Builder mais **ne sont pas des objets portable standard**. `generable_stock_aleatoire` est informatif, sans filtre automatique au sein du Builder v0.1.1.
- Un ralentissement additionnel pour le Zélote n'est pas automatisé ; l'ancien compendium documente 7,5 m comme vitesse indicative.
- Recettes, coûts et disponibilité dans le commerce : non définis (jamais gratuits).


## Forge ECHO / HelioSium (v0.1.3)

- Pour les quinze plans d'armures ECHO : fixer DEF totale, encombrement, malus, spécialité chiffrée, composants et coût/recette à chaque palier +1/+2/+3.
- Le sens exact du +1/+2/+3 est un palier de perfectionnement ; pas un bonus total de DEF connu à appliquer dans le template.
- Pour les quatre plans de modules énergétiques : définir bouclier (capacité, recharge), résistance élémentaire (niveau, élément), plaques mouvantes (interception), assistance IA (bonus, contraintes), ainsi que nombre d'emplacements et cumul.
- Phase 2 de la Forge ECHO : les trois noyaux Griffe, Œil, Soleil Brisé conditionnent l'accès, mais Foundry ne les suit pas automatiquement ; activation de l'offre par le MJ.
- L'armure blanche HelioSium relève de l'Acte V ; régénération et confusion sont enregistrées comme règles descriptives, pas des automatismes CSB/Builder.
- Une procédure future est nécessaire pour rendre les plans ECHO importables lorsque leurs valeurs ont été validées, sans permettre l'apparition de prototypes incomplets dans les stocks.
- La phase 2 du boss HelioSium par fusion de Machines Blanches est une idée validée comme piste, pas une création d'équipement.


## Objets caravaniers (validation v0.1.4)

- Les sept objets et leurs sept recettes sont validés par le MJ ; aucun coût,
  DD ou effet de cette série n'attend encore son accord.
- Les effets tactiques restent manuels dans le Builder et dans Foundry :
  couvert, décrochage, grappin de sauvetage, leurre, largage, amortissement et fouille.
- Si les règles de poursuite sont développées, les DD du crochet de sauvetage
  pourront être revus au cas par cas, sans remettre en cause l'approbation de ses valeurs actuelles.
- Aucun des sept objets n'a été inséré dans les 21 offres du stock fixe Senn P-03.
