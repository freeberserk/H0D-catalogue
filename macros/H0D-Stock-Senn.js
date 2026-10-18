// Macro script Foundry v14 : affiche le stock de Senn, sans achat ni Item créé.
const h0d = game.h0dCatalogue;
if (!h0d) return ui.notifications.warn("Le module H0D Catalogue est désactivé.");
await h0d.whenReady();
await h0d.openStock("longue-corde-senn-p03");
