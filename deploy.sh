#!/bin/bash
# Deploy FdN (frontend) + backup automatico no git
# Uso: ./deploy.sh "mensagem opcional do commit"
set -e

SRC="/opt/furia-frontend"
DEST="/opt/furiadanoite/frontend"
MSG="${1:-deploy: $(date '+%Y-%m-%d %H:%M')}"

echo "==> Build"
cd "$SRC"
npm run build

echo "==> Copiando build pra $DEST"
rsync -a --delete "$SRC/dist/" "$DEST/"

echo "==> Reload nginx"
nginx -s reload

echo "==> Backup no GitHub (furia-da-noite)"
cd "$SRC"
git add -A
if ! git diff --cached --quiet; then
  git commit -m "$MSG"
  git push origin main
  echo "==> Commitado e enviado: $MSG"
else
  echo "==> Nada novo pra commitar (build igual ao ultimo push)."
fi

echo "==> Deploy completo."
