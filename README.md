# SUPRT

Aplicativo Expo/React Native em desenvolvimento, com Supabase exclusivo. Projeto separado do Studio Black 7.

## Rodar no aparelho

1. Instale Node.js 20.19+ e execute `npm install`.
2. Execute `npx expo install --fix` se o Expo indicar versões incompatíveis, e então `npm start`.
3. Abra no Expo Go para testes de interface/GPS em primeiro plano. Android e iOS instaláveis exigem builds Expo/EAS e testes em aparelhos.

A URL e a chave **pública** do projeto SUPRT estão em `src/supabase.ts`. Nunca coloque uma chave secreta no app. É possível substituir a configuração por `.env` baseado em `.env.example`.

## Estado implementado no banco SUPRT

- Conta com Supabase Auth; pedidos do cliente com GPS opcional e endereço de referência; histórico e status.
- Cadastro inicial de ajudantes PF/PJ com serviços e equipamentos declarados. A aprovação documental é **manual**, fora do app; cadastros pendentes não recebem pedidos.
- Ao criar um pedido elegível com GPS, o servidor calcula preço de **teste**, encontra até cinco ajudantes aprovados/disponíveis com localização recente a até 10 km e cria ofertas. Sem posição ou oferta elegível, marca `sem_prestador`.
- Perfil do ajudante pode ficar disponível após aprovação; localização expira para despacho após dez minutos. Tela recebe ofertas em tempo real com polling como reserva; aceite é transacional e exclusivo. Prestador atualiza a sequência de estados; cliente acompanha status e o nome de quem aceitou.
- Tabelas protegidas com RLS. Funções de despacho/aceite/estado conferem identidade no servidor. GPS de prestador só é devolvido ao cliente atribuído enquanto o atendimento está ativo.

Migrações de referência em `supabase/`: `schema.sql`, `add_customer_location.sql`, `dispatch_mvp.sql`, `provider_offer_details.sql`, `lock_provider_on_accept.sql`, `realtime_pilot.sql`. Elas já foram aplicadas ao projeto informado pelo fundador; **não as execute novamente** sobre o mesmo banco.

## Limites antes de operar de verdade

**Não usar com clientes pagantes ou para emergência real.** Ainda faltam verificação segura de CPF/CNPJ e documentos, aprovação operacional, notificações push quando o app está fechado, mapa e ETA por rota, cobrança, conciliação, repasse, comprovante, estorno, suporte e testes completos em dispositivos. O valor de R$ 69/R$ 89 (pneu com/sem ferramentas do cliente), R$ 79 (partida auxiliar) e R$ 59 (calibragem) é **apenas para testar a lógica**, sem cobrança. Guincho/serviços especiais não são despachados sem preço e capacidade definidos. A interface ilustrativa de mapa não representa a posição geográfica exata.

Para um teste fechado, a equipe responsável precisa analisar cada ajudante e marcar `approval_status='approved'` somente após a verificação necessária. A tela do ajudante não permite autoaprovação. A posição precisa ser atualizada quando a pessoa desejar continuar disponível. Antes de abrir testes externos, validar acessibilidade, capacidade dos prestadores, preço/repasse, política de cancelamento e cobertura de suporte.

Escopo detalhado: [`docs/ESCOPO.md`](docs/ESCOPO.md).
