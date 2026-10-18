# Créer le dépôt GitHub et publier le module

Le pack ne crée pas de dépôt à ta place. Il contient tous les fichiers pour le faire.

## Étape 1 — Dépôt

- Sur GitHub, crée le dépôt `freeberserk/h0d-catalogue` (ne coche pas l'initialisation avec un README si tu comptes pousser directement le pack).
- Décompresse le **ZIP source**. Les fichiers `module.json`, `README.md`, `.github/` et `data/` doivent être à la **racine** du dépôt.

## Étape 2 — Premier push

Dans un terminal situé à la racine du dossier :

```bash
git init
git branch -M main
git add .
git commit -m "H0D Catalogue v0.1.0 — données et API Foundry"
git remote add origin https://github.com/freeberserk/h0d-catalogue.git
git push -u origin main
```

## Étape 3 — Créer la release

```bash
git tag v0.1.0
git push origin v0.1.0
```

Le workflow `.github/workflows/release.yml` exécutera les tests et publiera les fichiers `module.json` et `h0d-catalogue.zip` en pièces jointes de la release.

Dans Foundry, le manifeste à utiliser après publication :

```text
https://github.com/freeberserk/h0d-catalogue/releases/latest/download/module.json
```

## Test manuel après installation

1. Activer dans un monde Foundry v14 / CSB.
2. Vérifier dans la console : `game.h0dCatalogue.getStatus()`.
3. Ouvrir `game.h0dCatalogue.open()` et `game.h0dCatalogue.openStock()`.
4. Avec Equipment Builder actif, vérifier `getStatus().bridge` (aucun Item créé et aucune référence écrasée).
5. Vérifier l'état des Items déjà détenus par les PJ : ils ne doivent pas avoir changé.
