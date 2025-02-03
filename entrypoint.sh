#!/bin/sh

if ! [ -d ./node_modules ]
then
npm i
fi

if ! [ -d ./dist ]
then
npm run build
fi

npx prisma migrate deploy

pm2-runtime start ecosystem.config.cjs
