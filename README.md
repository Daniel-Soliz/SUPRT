# SUPRT

Primeira versão do aplicativo de suporte automotivo, feita com Expo/React Native e preparada para Supabase. Projeto independente do Studio Black 7.

## Rodar

1. Instale Node.js e execute `npm install`.
2. O aplicativo já aponta para o projeto Supabase exclusivo do SUPRT usando URL e chave pública. Se necessário, copie `.env.example` para `.env` para substituir esses valores localmente. Nunca use uma secret/service_role key no app.
3. A migração em `supabase/schema.sql` já foi aplicada ao projeto SUPRT.
4. Execute `npm start` e abra o app no Expo Go ou em um build de desenvolvimento.

## Estado atual

As telas de início, pedido, login, histórico e apresentação da área de prestadores estão implementadas. O registro e a leitura de pedidos usam Supabase quando configurado. O aplicativo não oferece ainda geolocalização automática, preço calculado, pagamentos, despacho para prestadores, aceite, notificações, verificação de documentos ou rastreamento. Não use os pedidos de teste para solicitar atendimento real. A área do prestador é informativa até que regras de elegibilidade e aceite sejam implementadas.
