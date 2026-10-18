// Macro script Foundry v14 : lecture seule du référentiel H0D.
const h0d = game.h0dCatalogue;
if (!h0d) return ui.notifications.warn("Le module H0D Catalogue est désactivé.");
await h0d.whenReady();
await h0d.open();
