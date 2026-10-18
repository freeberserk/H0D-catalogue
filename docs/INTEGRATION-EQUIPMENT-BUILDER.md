# H0D Catalogue ↔ Equipment Builder

## Comportement de la v0.1

À `ready`, H0D Catalogue lit les JSON locaux et appelle `game.h0dEquipmentBuilder.registerDefinition()` **uniquement** pour les références marquées `visible_au_stock_standard !== false`.

La fonction `getDefinition` du Builder sert d'anti-doublon : même clé déjà présente = ne pas modifier la définition existante. Aucun Item Foundry n'est créé ni modifié lors de la synchronisation.

Si Equipment Builder n'est pas actif, H0D Catalogue reste pleinement consultable via son API.

### Limite connue

`buildStock()` dans Equipment Builder v0.1 sélectionne les candidats par `originKey` et `kind`. Or `originKey` signifie **origine** et non **vendeur** : un objet d'artisanat commun peut être vendu à Senn ou à Brok. La v0.2 d'Equipment Builder devra utiliser `catalogue.disponibilite`, sans remplacer les origines.

Le Builder v0.1 ne gère pas le stock préconstruit `longue-corde-senn-p03`, les quantités de lot, les fourchettes de prix ou les prix en jetons. Ces informations **existent bien dans ce module** en tant que données et doivent être lues par le futur Builder.

### API à consommer dans le futur Builder

```js
const cat = game.h0dCatalogue;
await cat.whenReady();
const standard = cat.getDefinitions({includeRestricted: false});
const offreSenn = cat.getStockResolved('longue-corde-senn-p03');
const aFabriquer = cat.getRecipes();
```

`getStockResolved()` donne, pour chaque ligne, à la fois les champs de prix du scénario et la définition de l'objet dans le champ `objet` : le Builder n'a pas besoin de dupliquer les données.

### Algorithme recommandé v0.2

1. Construire les stocks ordinaires à partir de `getDefinitions({includeRestricted:false})`.
2. Déterminer les vendeurs autorisés via `definition.catalogue.disponibilite`.
3. Exclure explicitement les objets `non_marchand` et `mj_seul` pour les marchands normaux.
4. Pour un stock de scénario, charger `getStockResolved(key)` et respecter *strictement* les `quantite_disponible` (dont les `null` inconnus), `quantite_par_achat`, les prix exacts/fourchettes et `nom_pour_la_scene`.
5. Créer des Items seulement sur demande du MJ, sans convertir les jetons en ressources.
6. Continuer à appliquer les templates CSB en deux phases comme dans le Builder actuel.

**Ne pas** utiliser `syncToEquipmentBuilder({includeRestricted:true})` dans une partie normale tant que le Builder v0.1 ne sait pas filtrer ces objets.

## Compatibilité avec H0D Template Manager

- Les `props` existantes des 79 références sont limitées aux clés de `H0D_Objet v2.9` et `H0D_Ressource v2.5` déjà vérifiées.
- Les prix et disponibilités résident dans `catalogue`, hors `props`.
- La présente version n'impose aucune mise à jour des templates et ne migre aucun Item.
- Les protections de P-03 restent des **objets**, sans +DEF permanent inventé ni emplacements d'armure modifiés.
