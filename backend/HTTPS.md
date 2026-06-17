# HTTPS - Guia de Configuração

## Resumo

O servidor agora suporta **HTTPS** (SSL/TLS) para conexões seguras. O projeto vem com certificados auto-assinados pré-gerados para desenvolvimento local.

## 📁 Arquivos de Certificado

```
backend/
  ├── cert.pem       # Certificado SSL (gerado automaticamente)
  └── key.pem        # Chave privada (gerado automaticamente)
```

## 🚀 Como Usar

### Desenvolvimento Local (Padrão)

O servidor detecta automaticamente os certificados `cert.pem` e `key.pem` no diretório `backend/`:

```bash
cd backend
npm install
node server.js
```

**Saída esperada:**
```
🔒 Servidor rodando em https://localhost:3000
```

### Usando Certificados Customizados

Se tiver seus próprios certificados, configure as variáveis de ambiente:

#### Via `.env`:
```env
HTTPS_CERT=/caminho/para/seu/cert.pem
HTTPS_KEY=/caminho/para/seu/key.pem
```

#### Via linha de comando:
```bash
HTTPS_CERT=/path/to/cert.pem HTTPS_KEY=/path/to/key.pem node server.js
```

### Fallback para HTTP

Se os certificados não forem encontrados ou ocorrer erro ao carregá-los:
```
⚠️  Certificados HTTPS não encontrados, rodando em HTTP
Servidor rodando em http://localhost:3000
```

## 🔐 Informações do Certificado Atual

**Tipo:** Auto-assinado (self-signed)  
**Validade:** 365 dias  
**Domínios:** localhost  
**Localização:** `/home/inovia/Desktop/TheTowerProject/backend/`

```
Gerado com:
CN=localhost
O=TheTower
L=Natal
ST=RN
C=BR
```

## ⚠️ Avisos de Segurança

### Em Desenvolvimento
- Certificados auto-assinados causam **avisos de segurança** em navegadores
- Isso é **normal e esperado** em desenvolvimento
- No navegador, clique em "Avançado" → "Prosseguir mesmo assim"

### Em Produção
- **Não use** certificados auto-assinados
- Obtenha certificados válidos de uma **Autoridade Certificadora (CA)** como:
  - Let's Encrypt (gratuito)
  - DigiCert
  - GlobalSign
  - Outro provedor de confiança

## 📋 Regenerar Certificados

Se precisar regenerar os certificados:

```bash
cd backend
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/C=BR/ST=RN/L=Natal/O=TheTower/CN=localhost"
```

Ou com informações customizadas:

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/C=BR/ST=RN/L=Natal/O=MeuNome/CN=meu-dominio.com"
```

## 🧪 Testando com cURL

```bash
# Ignorar aviso de certificado auto-assinado
curl -k https://localhost:3000/

# Com detalhes do certificado
curl -k -v https://localhost:3000/
```

## 🔗 Atualizações no Projeto

### Arquivos Modificados
- `backend/server.js` - Adicionado suporte a HTTPS
- `.gitignore` - Adicionadas exclusões de certificados `.pem`
- `backend/.env.example` - Adicionadas variáveis HTTPS_CERT e HTTPS_KEY

### Ports
- **HTTP:** `3000` (se fallback ativado)
- **HTTPS:** `3000` (padrão)

## 🐛 Troubleshooting

### "Certificados HTTPS não encontrados"
**Causa:** Arquivos `cert.pem` ou `key.pem` foram deletados  
**Solução:** Regenere os certificados usando o comando acima

### "Erro ao carregar certificados HTTPS"
**Causa:** Permissões de arquivo incorretas  
**Solução:** 
```bash
chmod 644 backend/cert.pem
chmod 600 backend/key.pem
```

### "Address already in use :::3000"
**Causa:** Outro processo usando a porta 3000  
**Solução:**
```bash
lsof -ti:3000 | xargs kill -9
```

## 📚 Referências

- [Node.js HTTPS Documentation](https://nodejs.org/api/https.html)
- [Let's Encrypt (Para Produção)](https://letsencrypt.org/)
- [OpenSSL Commands](https://www.ssl.com/article/most-common-openssl-commands/)
