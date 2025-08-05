# 🐳 Proboots - Deploy com Docker

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🚀 Como Deployar

### 1. **Preparar os Arquivos**

Certifique-se de que todos os arquivos estão na VPS:
- `Dockerfile`
- `docker-compose.yml`
- `nginx.conf`
- `.dockerignore`
- Todo o código fonte do projeto

### 2. **Executar o Deploy**

```bash
# Construir e iniciar os containers
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 3. **Acessar a Aplicação**

A aplicação estará disponível em:
- **URL:** `http://SEU_IP_VPS:3000`
- **Porta:** 3000

## 🔧 Comandos Úteis

```bash
# Parar os containers
docker-compose down

# Reiniciar apenas a aplicação
docker-compose restart app

# Ver logs específicos
docker-compose logs app
docker-compose logs nginx

# Acessar container da aplicação
docker-compose exec app sh

# Acessar container do Nginx
docker-compose exec nginx sh
```

## 📁 Estrutura dos Arquivos

```
proboots/
├── Dockerfile              # Build da aplicação Next.js
├── docker-compose.yml      # Orquestração dos containers
├── nginx.conf             # Configuração do Nginx
├── .dockerignore          # Arquivos ignorados no build
└── src/
    └── db/                # Dados JSON (persistidos via volume)
```

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# Parar containers
docker-compose down

# Reconstruir e iniciar
docker-compose up -d --build
```

## 🛠️ Configurações

### **Nginx**
- Proxy reverso para Next.js
- Compressão Gzip ativada
- Headers de segurança
- Cache para arquivos estáticos

### **Aplicação**
- Porta interna: 3000
- Volume para persistir dados JSON
- Health checks configurados
- Restart automático

## 🔍 Troubleshooting

### **Verificar se está funcionando:**
```bash
# Testar aplicação
curl http://localhost:3000

# Verificar containers
docker ps

# Ver logs de erro
docker-compose logs --tail=50
```

### **Problemas comuns:**
1. **Porta 3000 ocupada:** Mude a porta no `docker-compose.yml`
2. **Erro de build:** Verifique se o `Dockerfile` está correto
3. **Dados não persistem:** Verifique o volume `./src/db:/app/src/db`

## 📊 Monitoramento

Os containers têm health checks configurados:
- **App:** Testa endpoint `/api/banners`
- **Nginx:** Testa se responde na porta 80

---

**🎉 Sua aplicação Proboots está pronta para produção!** 