#!/bin/bash
# Deploy: compila em /root/aluguel_site e publica em /var/www/aluguel
set -e

SRC=/root/aluguel_site
DEST=/var/www/aluguel

echo "━━━ 1/5  Atualizando código ━━━"
cd "$SRC"
git pull
npm install
npm run build

echo "━━━ 2/5  Copiando servidor ━━━"
cp "$SRC/server.js"          "$DEST/server.js"
cp "$SRC/package.json"       "$DEST/package.json"
cp "$SRC/package-lock.json"  "$DEST/package-lock.json"

echo "━━━ 3/5  Copiando build do React ━━━"
rm -rf "$DEST/dist"
cp -r  "$SRC/dist" "$DEST/dist"

echo "━━━ 4/5  Copiando fotos originais ━━━"
# rsync sem --delete: copia/atualiza fotos do repositório
# mas NÃO apaga fotos enviadas pelo painel admin
mkdir -p "$DEST/public/fotos"
rsync -av "$SRC/public/fotos/" "$DEST/public/fotos/"

echo "━━━ 5/5  Instalando deps e reiniciando servidor ━━━"
cd "$DEST"
npm install --omit=dev
pm2 restart aluguel-api 2>/dev/null || pm2 start server.js --name aluguel-api
pm2 save

echo ""
echo "✅  Deploy concluído → https://aluguel.walkysolution.com"
