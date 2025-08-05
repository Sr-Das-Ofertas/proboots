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

# Rebuild após mudanças no código
docker-compose down
docker-compose up -d --build
```

## 🛠️ Troubleshooting

### **Problema: Healthcheck falhando**

Se o healthcheck estiver falhando, execute:

```bash
# Parar containers
docker-compose down

# Rebuild com curl instalado
docker-compose up -d --build

# Verificar health status
docker ps
```

### **Verificar se está funcionando:**
```bash
# Testar aplicação
curl http://localhost:3000

# Testar health check
curl http://localhost:3000/api/health

# Verificar containers
docker ps

# Ver logs de erro
docker-compose logs --tail=50
```

### **Problemas comuns:**
1. **Porta 3000 ocupada:** Mude a porta no `docker-compose.yml`
2. **Erro de build:** Verifique se o `Dockerfile` está correto
3. **Dados não persistem:** Verifique o volume `./src/db:/app/src/db`
4. **Healthcheck falhando:** O curl agora está instalado no Dockerfile

## 📁 Estrutura dos Arquivos

```
proboots/
├── Dockerfile              # Build da aplicação Next.js (com curl)
├── docker-compose.yml      # Orquestração dos containers
├── nginx.conf             # Configuração do Nginx
├── .dockerignore          # Arquivos ignorados no build
├── src/app/api/health/    # Endpoint de health check
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
- Health checks configurados com curl
- Restart automático
- Endpoint `/api/health` para monitoramento

## 📊 Monitoramento

Os containers têm health checks configurados:
- **App:** Testa endpoint `/api/health` (com curl instalado)
- **Nginx:** Testa se responde na porta 80
- **Start period:** 40s para dar tempo da aplicação inicializar

## 🔍 Health Check

O endpoint `/api/health` verifica:
- ✅ Status da aplicação
- ✅ Acesso aos arquivos de dados
- ✅ Timestamp da verificação
- ✅ Retorna JSON com status

---

**🎉 Sua aplicação Proboots está pronta para produção!** 