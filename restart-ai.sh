#!/bin/bash
cd /var/www/RestAPI-dev
npm run build
pm2 restart rest-api-ai --update-env
pm2 logs rest-api-ai --lines 30