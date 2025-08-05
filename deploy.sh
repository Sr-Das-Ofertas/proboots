#!/bin/bash

echo "🚀 Iniciando deploy otimizado do Proboots..."

# Parar containers existentes
echo "📦 Parando containers..."
docker compose down

# Limpar cache do Docker
echo "🧹 Limpando cache do Docker..."
docker system prune -f

# Rebuild sem cache
echo "🔨 Rebuildando containers..."
docker compose build --no-cache

# Iniciar containers
echo "▶️ Iniciando containers..."
docker compose up -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização..."
sleep 30

# Verificar status
echo "📊 Verificando status..."
docker compose ps

# Verificar logs
echo "📋 Últimos logs da aplicação:"
docker compose logs app --tail=20

echo "📋 Últimos logs do Nginx:"
docker compose logs nginx --tail=20

# Testar aplicação
echo "🧪 Testando aplicação..."
curl -f http://localhost:3000/api/health || echo "❌ Health check falhou"

echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://SEU_IP_VPS:3000" 