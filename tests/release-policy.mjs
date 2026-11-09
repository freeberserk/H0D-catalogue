import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const wf=readFileSync(new URL("../.github/workflows/release.yml",import.meta.url),"utf8");
const required=["module.json","scripts/**","styles/**","data/**","macros/**","schemas/**","docs/**","README.md","CHANGELOG.md"];
for(const path of required)assert.ok(wf.includes("'"+path+"'"),"Modification distribuée ignorée : "+path);
for(const path of ["module.json","scripts","styles","data","macros","schemas","README.md","CHANGELOG.md","docs"])
  assert.ok(wf.includes("zip -r h0d-catalogue.zip") && wf.includes(path),"archive incomplète : "+path);
assert.match(wf,/gh release view "v\$VERSION"/,"Ne pas réutiliser le même numéro");
assert.match(wf,/PATCH=\$\(\(PATCH\+1\)\)/,"Incrément patch requis");
assert.match(wf,/m\.version=process\.argv\[1\]/,"Le manifeste doit annoncer le nouveau numéro");
assert.match(wf,/git push origin HEAD:main/,"Le manifeste mis à jour doit être poussé sur main");
assert.match(wf,/target=\$\(git rev-parse HEAD\)/,"La release doit pointer sur le commit de version");
assert.match(wf,/gh release create "\$TAG"/,"Créer une nouvelle release");
assert.doesNotMatch(wf,/gh release upload.*--clobber/,"Ne pas écraser une release de même numéro");
assert.match(wf,/cancel-in-progress: false/,"Ne pas abandonner une publication");
console.log("Catalogue : tous les fichiers distribués déclenchent une release versionnée et non écrasée.");

assert.match(wf,/i\.version=process\.argv\[1\]/,"La version de l'index doit suivre celle du module");
assert.match(wf,/git add module\.json data\/index\.json/,"Versionner les deux fichiers");
