# coupons-system-web

Micro-frontend desenvolvido como parte do teste técnico para a empresa **Taller**.

Seu único propósito é visualizar a [API de cupons](https://github.com/iranbatista/coupons-system) rodando em produção — não é um produto final.

- **Front em produção:** https://coupons-system-web.vercel.app/
- **API em produção:** https://coupons-system-production.up.railway.app

## Sobre

Este projeto consome a API do repositório [iranbatista/coupons-system](https://github.com/iranbatista/coupons-system), que implementa um sistema de cupons de desconto. A interface permite interagir com os endpoints da API (autenticação, listagem e aplicação de cupons) de forma visual.

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://coupons-system-production.up.railway.app
```

## Rodando localmente

```bash
npm install
npm run dev
```

## Stack

- React + TypeScript
- Vite
- Axios
- Tailwind CSS
