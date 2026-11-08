# Économie H0D — tarifs validés le 8 novembre 2026

## Ressources et jetons
- Les ressources sont des matériaux récupérés et des unités de troc/achat/fabrication. Les composants obligatoires sont inclus dans le coût affiché : jamais de double comptage.
- Les Jetons de Reconnaissance sont distincts. Aucune conversion automatique des ressources en jetons.
- Les Caravanes Libres peuvent attribuer des jetons aux PJ qui leur rendent service : escorte, réparation, sauvetage, etc. Le MJ détermine l'octroi et le montant selon le contexte.
- **1 jeton ≈ 2 ressources** : simple repère pour calibrer les futurs prix, **pas un taux de change**. Les 21 offres en jetons de Senn gardent leurs tarifs validés, même si ceux-ci divergent.
- Un prix en jetons est propre au marchand et à son stock, pas un prix universel recopié sur l'objet.

## Échelle économique (validée)
| Ressources | Usage |
| --- | --- |
| 1–4 | Objets courants |
| 5–9 | Armes simples / protections légères |
| 10–16 | Équipement intermédiaire |
| 17–25 | Armures lourdes / équipements spécialisés |
| 26–40 | Équipement avancé et prestigieux |
| 41+ | Matériel exceptionnel ou lourd technologique |

Repères armures : légères +1 DEF 6–8, intermédiaires +2 DEF 12–16, lourdes +3 DEF 18–22, spécialisées/technologiques 22–35. Le prix dépend de la quantité, qualité des matériaux et de la complexité. Les armures lourdes réclament plus de plaques ; le principe s'applique également aux armes.

## 18 prix des armures principales (ressources)
| Identifiant | Prix |
| --- | ---: |
| `tenue-chasseur-dent` | 6 |
| `armure-recuperateur-dent` | 13 |
| `armure-gardien-dent` | 18 |
| `tenue-maitre-cercle` | 8 |
| `cuir-renforce-machine` | 12 |
| `tenue-soigneur-dent` | 8 |
| `armure-rapide-dent` | 7 |
| `tenue-caravanier` | 6 |
| `armure-garde-caravane` | 14 |
| `veste-recuperateur-itinerant` | 8 |
| `armure-maraudeur-rouge` | 13 |
| `armure-briseur-rouge` | 19 |
| `harnais-dompteur-rouge` | 16 |
| `protection-eclaireur-rouge` | 8 |
| `armure-soldat-solaire` | 18 |
| `armure-artilleur-solaire` | 28 |
| `armure-capitaine-solaire` | 30 |
| `tenue-technicien-solaire` | 22 |

**Les quantités exactes de PM/FS et les recettes d'armures ne sont pas encore validées.** Aucun plan artificiel n'est ajouté.

## Périmètre conservé
- 21 offres de Senn : mêmes jetons, quantités, stocks, demi-lot ×5 et disponibilités.
- Armes et munitions déjà tarifées : prix et recettes inchangés.
- Ressources et pièces de machines : valeur de troc ou fourchette distincte du prix de vente.
- Culte du Renouveau, plans ECHO, HelioSium, objets ELYSIUM : pas de prix marchand attribué.
- Propriétés CSB des 199 définitions et conditions de stock : inchangées.

L'audit `data/audits/rapprochement-builders-2026-11-08.json` est un instantané **v0.1.8** (81 prix en ressources non définis) et reste inchangé. Après validation de 18 prix, 63 définitions demeurent sans prix d'achat en ressources, incluant des cas non marchands.
