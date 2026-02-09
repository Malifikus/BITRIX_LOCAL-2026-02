#!/bin/bash
cd ~/bitrix-simple
docker-compose down
docker-compose up -d
echo "✅ Битрикс запущен: http://localhost"
