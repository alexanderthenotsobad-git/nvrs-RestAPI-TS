#!/bin/bash
npm run build
pm2 restart rest-api-ai --update-env
