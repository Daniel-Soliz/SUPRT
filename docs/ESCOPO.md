# SUPRT — escopo de produto e operação

**Versão 1.3 · 25 de setembro de 2026 · Município de São Paulo**  
**Status:** especificação proposta para decisão e desenvolvimento; não descreve funções já prontas.

## 1. Visão e promessa

SUPRT é uma plataforma móvel de socorro automotivo sob demanda: uma pessoa com problema no veículo descreve a necessidade, recebe um preço antes de confirmar, e um profissional ou empresa habilitada aceita o chamado. O cliente acompanha a chegada, aprova qualquer alteração de escopo e recebe comprovante. A promessa é **clareza do serviço, preço e tempo de chegada**. Não prometer “em poucos minutos” nem cobertura 24 horas em regiões sem prestadores ativos.

Três superfícies do mesmo produto: **app do cliente**, **app ou modo do prestador** e **painel web de operações**. Uma conta pessoal pode ser cliente e também trabalhar como prestador após aprovação; empresa tem conta do representante e colaboradores vinculados, com permissões próprias.

## 2. Mercado e diferencial verificável

| Oferta existente | O que já oferece | Oportunidade para o SUPRT |
| --- | --- | --- |
| Porto Seguro | Acionamento de assistência/guincho por app e canais próprios, com descrição e localização. | Atender também quem não quer depender de uma apólice ou cobertura específica. |
| Sem Parar Agora | Assistência avulsa para guincho, bateria, pneu, pane seca e chaveiro; diz atender 24h. | Competir pela triagem exata, compatibilidade de equipamentos, oferta transparente e experiência de acompanhamento; **não** alegar exclusividade em assistência avulsa. |
| GetNinjas | Publicação de pedido e contato/orçamentos de profissionais de várias categorias. | Despacho imediato orientado a emergência, valor conhecido e acompanhamento do atendimento em vez de aguardar negociação aberta. |
| 99 | Referência de interface: ofertas, valor e aceite do parceiro. | Aplicar o padrão de resposta rápida a serviços automotivos com material/equipamento e destino do guincho. |

**Tese de diferenciação a testar em campo:** o formulário evita o erro “chegou sem a ferramenta certa”; a plataforma mostra preço total e repasse antes do aceite; a escolha do prestador considera capacidade e ETA por rota; o cliente vê mudanças de preço somente após aprovação. Isso é uma proposta, não vantagem comprovada. Entrevistar clientes e prestadores e medir atendimento antes de investir em escala.

## 3. Público, geografia e catálogo

**Abrangência planejada:** todo o município de São Paulo, com uso nas diferentes zonas desde o início se houver ajudantes habilitados disponíveis. **Região confirmada do primeiro teste real: Brasilândia.** Os outros dois integrantes ajudarão na divulgação, mas seus bairros de atuação serão confirmados pelo fundador antes de registrar novas regiões piloto. Zona Leste e Vila Mariana são possibilidades mencionadas, não áreas confirmadas. Divulgar em outras zonas após verificar presença real de ajudantes e atendimento. Divulgação em uma zona não significa cobertura garantida nela: o app mostra disponibilidade efetiva conforme pessoas online, tipo de serviço e tempo de rota. Se ninguém puder atender, explicar isso imediatamente, ampliar a busca conforme regra e oferecer alternativa de suporte, sem prometer chegada impossível. A operação pode ser ativada por etapas para reduzir risco, mantendo o objetivo de cobertura municipal.

**Serviços simples prioritários:** (1) troca do pneu pelo estepe do cliente, inclusive usando macaco e chave de roda do cliente; (2) **partida auxiliar/carga de bateria no local** com cabos e veículo de apoio adequado ou auxiliar de partida compatível trazidos pelo ajudante; (3) **calibragem de pneu no local** somente com compressor e manômetro adequados e quando o pneu estiver íntegro; dano/furo exige reparo especializado ou estepe. **Categoria especializada:** guincho de automóvel de passeio, com equipamento, documentação e destino informados. **Etapa posterior condicionada:** reparo de pneu, venda/troca de bateria, pane seca, chaveiro automotivo, motos, utilitários, veículos elétricos e agendamento. Pane seca e chaveiro exigem regras próprias de segurança, materiais, verificação de posse e viabilidade; não entrar como “qualquer vizinho atende”. Cada serviço tem requisitos, limites e preço próprios. Não oferecer reparo em via perigosa quando o cenário exige remoção segura.

### Perguntas condicionais do pedido

| Tipo | Perguntas essenciais | Regra de compatibilidade |
| --- | --- | --- |
| Pneu | Qual roda? Apenas ar, reparo ou troca? Tem estepe? Sabe se o estepe está cheio/utilizável (sim/não/não sei)? Tem macaco? Tem chave de roda? Há parafuso antifurto e chave dele? Modelo/tamanho do veículo? Foto opcional? Local seguro? | Se não há estepe utilizável, não ofertar “troca pelo estepe”; indicar reparo móvel habilitado ou guincho. Se faltam ferramentas, oferecer apenas a ajudantes que declararam trazê-las. “Não sei” sobre a pressão não significa “cheio”: ajudante confirma condição antes de concluir. |
| Bateria/partida auxiliar | Motor não liga? Painel/luzes acendem? Faz ruído ao tentar ligar? Veículo é convencional, híbrido ou elétrico? Cliente tem cabos? Há acesso seguro ao compartimento? Marca/modelo/ano e foto opcional? | Ajudante declara previamente se leva cabos e veículo compatível ou auxiliar de partida, e qual tipo de veículo atende. Cliente pode fornecer cabos, mas o ajudante ainda precisa de fonte adequada e saber executar. Híbrido/elétrico ou dano aparente são encaminhados a prestador especializado. Partida auxiliar não é diagnóstico nem garantia de que o carro permanecerá funcionando; se falhar, oferecer diagnóstico/guincho com novo preço aprovado. Venda/troca de bateria exige estoque, preço da peça separado, compatibilidade e garantia. |
| Calibragem | Pneu apenas murcho ou visivelmente danificado? Qual roda? Sabe a pressão recomendada pelo fabricante? Há estepe? O veículo está em local seguro? | Somente ajudante com compressor/manômetro; se houver dano, não inflar como solução definitiva e indicar serviço adequado. |
| Guincho | Veículo liga/anda? Câmbio, tração, peso, altura, rodas travadas, avaria/acidente? Origem, destino, acesso em garagem/subsolo e pessoas no local? | Confirmar tipo/capacidade de guincho, distância, pedágios, acessos e condições de segurança. |
| Outros | Tipo de ocorrência, texto, fotos, localização e risco. | Triagem por operador; não roteamento automático de serviço desconhecido. |

Tela de situação urgente antes do formulário: se há feridos, risco de incêndio ou perigo imediato, exibir orientação para buscar o serviço público de emergência adequado e se proteger; o SUPRT não substitui atendimento médico ou autoridades.

## 4. Cadastro do cliente

1. Explorar catálogo e estimativa sem conta; solicitar exige identificação.
2. Entrar por telefone com código de verificação ou e-mail, com opção de recuperar acesso. Validar número, impedir abuso de códigos e registrar termos aceitos com versão/data.
3. Nome, telefone, e-mail opcional quando telefone for principal, e dados mínimos de faturamento quando exigidos pelo meio de pagamento; não exigir CPF sem finalidade definida.
4. Veículos opcionais: placa quando necessária ao atendimento, marca/modelo/ano, combustível/tipo, apelido. Permitir pedido para veículo de outra pessoa com autorização declarada.
5. Localização precisa apenas durante busca/atendimento; alternativa manual por endereço e ponto de referência. Confirmar pino em mapa. Pedir permissão no momento do uso.
6. Método de pagamento, contatos de confiança opcionais, recibos, suporte, solicitações de dados e exclusão de conta. Exibir claramente o que prestador verá.

## 5. Cadastro do prestador pessoa física

1. Cadastro com telefone/e-mail, nome civil, CPF, data de nascimento para verificação quando necessária, foto do rosto e comprovante de identidade conforme política de verificação; análise documental segura, sem expor esses dados ao cliente.
2. Declarar serviços oferecidos, área/raio, horários, experiência, equipamentos, veículo de atendimento, conta de recebimento e capacidade por categoria. Para guincho, dados e documentação do veículo/condutor, capacidade e exigências aplicáveis.
3. Verificação de identidade, adequação à atividade e de documentos; status **rascunho → enviado → em análise → aprovado/reprovado/suspenso**. Somente aprovado fica online. Revalidar documentos vencidos.
4. Configurar disponibilidade, pausa, deslocamento máximo, aceitar termos, política de cancelamento e repasse; treinamento curto de segurança e checklist por serviço.
5. A plataforma pode admitir PF para serviços elegíveis **após validação jurídica, fiscal e operacional**. Não presumir que PF sem CNPJ pode executar qualquer categoria ou que todas as formas de repasse e nota fiscal serão iguais.

## 6. Cadastro do prestador pessoa jurídica

1. CNPJ, razão social, nome fantasia, responsável legal, contrato/atos ou comprovantes de representação conforme risco, atividade econômica compatível, endereço e conta de recebimento da empresa.
2. Validar situação cadastral, enquadramento aplicável (inclusive MEI quando couber), documentos operacionais, veículos/equipamentos e coberturas exigidas pelo serviço. O governo lista “guincheiro independente” como ocupação permitida ao MEI, mas isso não dispensa a checagem das demais condições e regras da operação.
3. Representante aprova termos e cadastra colaboradores: condutores/técnicos identificados, documentos, serviços permitidos e veículo designado. Um funcionário só pode aceitar pedido para o qual está autorizado e com capacidade disponível.
4. Empresa pode ter várias equipes simultâneas e painel de despacho; recebimento e emissão de documento fiscal seguem a entidade contratante definida no modelo jurídico.
5. Suspensão por documento vencido, reclamações graves ou risco; recurso/revisão humana e registro de decisão.

**Mesma lógica de qualidade para PF e PJ:** identificação verificável, capacidade real, política de atendimento e avaliação. Não usar apenas “tem CNPJ” como selo de segurança.

## 7. Jornada do cliente, do prestador e do operador

### Cliente

1. Abre app → toca em um serviço grande e legível → responde somente às perguntas necessárias → confirma localização em um toque (ou ajusta no mapa). Fotos e descrição são opcionais para troca simples; veículo pode ser cadastrado depois. Para pneu, apresentar perguntas separadas: “Você tem estepe?”, “O estepe está cheio?”, “Você tem macaco?” e “Você tem chave de roda?”, cada uma com “Sim / Não / Não sei” quando fizer sentido.
2. Sistema verifica área, categoria, risco, prestadores online e capacidade. Se houver oferta, exibe composição do preço, ETA **estimado**, o que está incluído, exclusões, política de cancelamento e forma de pagamento.
3. Cliente autoriza/captura pagamento conforme desenho do provedor; confirma solicitação. Antes de confirmação, nenhuma cobrança definitiva.
4. Tela de busca com estado claro e opção de cancelar; após aceite, nome/foto/avaliação e identificação do prestador, ETA, rota aproximada, chat/chamada protegidos e compartilhamento do atendimento.
5. Prestador chega; cliente confirma identidade e início por código de verificação. Serviço executado com checklist e fotos quando cabível.
6. Mudança de escopo é proposta no app com novo total, justificativa e aceite explícito **antes** de executar. Sem aceite, executar só escopo original ou cancelar conforme regras.
7. Conclusão por ambas as partes, recibo, avaliação, suporte/disputa e eventual reembolso.

### Prestador

1. Fica online somente com cadastro aprovado, localização disponível e capacidade livre; marca serviços e disponibilidade.
2. Recebe cartão com tipo/escopo, veículo, área aproximada antes do aceite, distância/ETA, valor bruto, taxas, líquido previsto, materiais necessários e tempo para responder.
3. Aceite atômico: o servidor atribui a apenas um prestador. Na sequência, endereço exato, rota e contato protegido. Deve confirmar saída, chegada e início.
4. Pode registrar impossibilidade justificada, propor alteração, fotografar comprovação, concluir, ver ganhos e abrir contestação. Histórico de cancelamentos e expiração alimenta supervisão, sem punir automaticamente casos de risco.

### Operações

Painel com mapa de demanda e prestadores disponíveis, fila sem aceite, reatribuição assistida, contato com as partes, documentos, preços e regras de cobertura, pagamentos/reembolsos, denúncias, auditoria e incidentes. Operador vê dados mínimos necessários e toda ação fica registrada. Suporte humano e telefone de contingência durante o piloto.

## 8. Estados e regras de despacho

**Pedido:** `rascunho → cotado → aguardando_pagamento/autorização → procurando → aceito → a_caminho → chegou → em_serviço → concluído`. Saídas alternativas: `sem_cobertura`, `sem_prestador`, `pagamento_falhou`, `expirado`, `cancelado_cliente`, `cancelado_prestador`, `revisão_operador`, `disputa` e `reembolso`. Cada transição tem ator autorizado, horário e motivo; nunca confiar apenas no status enviado pelo celular.

**Despacho proposto:** 1) filtrar ajudantes/prestadores cadastrados e aprovados para aquela categoria, que ativaram “Disponível”, aceitaram receber notificações, estão sem serviço simultâneo e têm localização recente; 2) buscar candidatos inicialmente em até **10 km em linha reta** do ponto confirmado via consulta geoespacial; 3) checar rota, trânsito e tempo dos finalistas; 4) ordenar por ETA e capacidade, não só por distância: alguém a 500 m do outro lado de uma via pode levar mais tempo; 5) enviar notificação/oferta em pequenos lotes e permitir que **o primeiro aceite válido reservado no servidor** fique com o atendimento; se ninguém aceitar, ampliar a busca com novo ETA e preço aprovados pelo cliente. Nunca notificar todo usuário que apenas instalou o app, nem mostrar a posição exata de todos ao público. O cliente escolhe se também quer ser ajudante, conclui cadastro simples e verificação, e só então pode ficar disponível.

Usar **bloqueio transacional no servidor** para que dois aceites simultâneos não dupliquem o pedido; chave de idempotência em pedido, pagamento e notificações. Sem resposta, reofertar. Se prestador perder sinal, confirmar estado ao reconectar e não permitir aceitar oferta expirada. Após cancelamento/rejeição, recomputar preço/ETA antes de reatribuir se houver mudança material, informando cliente.

## 9. Geolocalização, mapa e ETA

- Cliente fixa ponto manualmente ou pelo GPS. Guardar precisão, timestamp e endereço de referência; perguntar “em qual lado da via?” em avenida/rodovia. Caso GPS falhe, permitir texto e telefonema ao suporte.
- Prestador transmite posição apenas online/num atendimento conforme permissões, com frequência adaptativa. **Enquanto a caminho**, obter permissão de localização em segundo plano somente se essencial e aprovada pela plataforma; permitir pausa e parar compartilhamento ao encerrar. Localização velha remove o prestador da busca.
- Distância em linha reta serve para pré-filtrar; **ETA deve vir de rota viária e trânsito**. Atualizar periodicamente, mostrar faixa (“aprox. 12–18 min”) quando incerteza alta, e marcar última atualização. Não prometer SLA exato antes de dados históricos.
- Cliente só recebe localização detalhada do prestador designado durante o atendimento; prestador recebe endereço completo após aceite. Links compartilhados expiram. Histórico preciso de trajetos tem retenção curta definida por necessidade.
- Rodovias, túneis, garagens e áreas sem sinal exigem regras próprias, confirmação humana e eventual recusa por segurança.

## 10. Preço, cobrança e repasse

**Preço sugerido por categoria:** taxa base + deslocamento relevante + mão de obra + adicionais explícitos de horário/complexidade + quilometragem do guincho + pedágios/peças (quando aplicáveis) − desconto. Definir tetos, preço mínimo, raio e componentes antes do piloto com prestadores reais. Mostrar **total ao cliente** e **valor líquido estimado ao prestador** antes dos respectivos aceites. Sem preço inventado em tela.

**Preços de teste escolhidos pelo fundador, sujeitos a validação operacional e não apresentados como média de mercado:** troca simples pelo estepe, com todas as ferramentas do cliente e ajudante em rota curta, **R$ 69 ao cliente**; se o ajudante precisa levar macaco/chave, **R$ 89**. Em ambos os casos, o valor final depende de distância por rota, horário e custos acordados; até 10 km é raio de notificação, não promessa de cobrar a mesma quantia em todo esse raio. O relato de R$ 40 se refere a uma borracharia fixa; uma oferta pública de atendimento móvel em São Paulo anuncia troca pelo estepe a partir de R$ 120. Assim, R$ 69/89 é um **teste comercial abaixo daquela referência**, sujeito à aceitação de ajudantes e sustentabilidade da plataforma, não uma média. Exemplo transparente: se a comissão piloto fosse 15%, em R$ 69 o repasse bruto seria R$ 58,65 e a plataforma teria R$ 10,35 antes de custo de pagamento, impostos, suporte e reembolso. Comissão e mínimos serão definidos após entrevistar prestadores. Se não houver quem aceite pelo preço, informar preço/alternativa ao cliente em vez de anunciar valor inviável.

Guincho precisa definir destino antes de cotar; limite de km, espera, pedágio, guarda e mudança de destino entram em contrato. Peça física exige estoque/preço/garantia e aceite separado. Reserva de pagamento, captura, estorno, fraude, chargeback, conciliação, repasse e emissão de comprovantes ficam em backend; app nunca armazena segredo de pagamento. Escolher provedor com suporte real ao modelo de marketplace PF/PJ e validar obrigações fiscais. O Mercado Pago documenta split 1:1 no Brasil; viabilidade exata para o formato do SUPRT depende de análise da integração e contrato. Pagamento em dinheiro só se houver processo seguro de cobrança da taxa e reconciliação; recomendação para piloto: pagamento digital.

**Cancelamento:** regras por etapa (antes do aceite, após deslocamento, chegada, início), motivo, tolerância por erro do prestador e reembolso; publicar valores antes de confirmar. **Disputas:** preservar logs, proposta aceita e provas, prazos claros e revisão humana. Não modificar valor original silenciosamente.

## 11. Segurança, privacidade e suporte

Dados de localização de celular são dados pessoais; documento, placa, foto e endereço podem identificar pessoas. Definir controlador/operadores, finalidade e base legal por dado com assessoria jurídica; política de privacidade legível, minimização, retenção, pedidos de acesso/exclusão e resposta a incidentes. Criptografia em trânsito e repouso, armazenamento privado dos documentos, URLs temporárias, logs de acesso, MFA no painel, segregação por papéis, RLS por dono/empresa e funções servidoras para transições sensíveis. Nenhuma chave secreta no aplicativo.

Verificações de prestador antes de liberar; checagem de identidade na chegada; chat/chamada protegidos, bloqueio/denúncia, detecção de abuso, suporte acessível e compartilhamento de atendimento. Checklist de segurança inclui triângulo/localização segura quando cabível; nunca pedir ao usuário para ficar exposto no trânsito. Requisitos de habilitação, seguro, tributação, CDC, regras de guincho e responsabilidades contratuais devem passar por advogado e corretor antes da operação comercial.

## 12. Arquitetura proposta

- **Apps:** Expo/React Native para cliente e prestador; módulos separados ou um app com modos controlados pelo servidor. Painel web para operação. Versões Android/iOS instaláveis; site público informativo separado, se necessário.
- **Supabase:** Auth, PostgreSQL, RLS, Storage privado para documentos/fotos, Realtime para estados autorizados. PostGIS para raio e proximidade. Funções/serviço backend para orçamento, despacho, aceites transacionais, pagamentos, webhooks e auditoria. Fila de tarefas com entrega/retentativa para notificações e expiração de oferta.
- **Mapas/rotas:** provedor de mapas, geocodificação e ETA por tráfego; chaves restritas, cotas e monitoramento de custo.
- **Notificações:** push + atualização em tempo real; SMS/telefone como contingência crítica. Push não substitui transação no banco.
- **Tabelas de domínio:** users/profiles, vehicles, provider_profiles, organizations, team_members, credentials, provider_capabilities, equipment, service_catalog, pricing_rules, location_presence, service_requests, request_answers, quotes, dispatch_offers, assignments, request_events, location_updates (retenção), scope_changes, payments, payouts, refunds, ratings, support_tickets, audit_events. Separar dados de verificação em área de acesso restrito.
- **Observabilidade:** erros e desempenho, tentativas de despacho, posição desatualizada, falha de pagamento, entrega de push, mudanças de status e incidentes. Backup e procedimento de recuperação.

**Importante:** o banco atual contém somente `service_requests` com RLS e o app atual contém telas iniciais/login/pedido. Não confundir este desenho de arquitetura com funcionalidades implementadas.

## 13. Telas, visual e linguagem

**Direção visual:** confiança e urgência sem alarmismo. Azul petróleo `#12253B` para superfícies/texto, azul ação `#1769E0` para botões e progresso, branco `#FFFFFF`, fundo `#F7F9FC`, texto secundário `#657488`, sucesso `#168A67`, atenção `#E3A008`, perigo `#C93C44`. Contraste e estados acessíveis devem ser testados antes de fechar tokens; não depender apenas de cor. A base atual já usa os quatro primeiros tons e pode evoluir nessa direção.

| Cliente | Prestador | Operação |
| --- | --- | --- |
| Abertura e serviços | Cadastro PF/PJ e documentos | Mapa e fila |
| Triagem por serviço | Revisão/pendências | Aprovação de cadastro |
| Mapa e confirmar ponto | Online/offline e serviços | Regras de preço/cobertura |
| Preço detalhado e pagamento | Oferta com bruto/líquido e ETA | Reatribuição e incidentes |
| Busca, atribuído e rota/ETA | Navegação, chegada e checklist | Pagamentos/reembolsos |
| Aprovar mudança, conclusão | Alteração, conclusão e ganhos | Suporte, auditoria e métricas |
| Histórico, recibo, avaliação e ajuda | Histórico, avaliação e ajuda | Gestão de acesso |

Microtexto deve ser direto: “Onde seu carro está?”, “Você tem estepe?”, “O profissional leva macaco e chave de roda”, “Valor total antes de pedir”, “Estimativa de chegada atualizada às 14h22”. Botão principal fixo e preenchimento progressivo. Inclusão: fonte escalável, alvos de toque, leitor de tela, contraste, baixa conectividade e formulário utilizável com uma mão.

## 14. Fases e critérios de lançamento

**Fase 0 — validação (antes de construir tudo):** entrevistar clientes que sofreram pane e 10–20 potenciais ajudantes/prestadores na Brasilândia; consultar os outros integrantes para definir os próximos bairros, sem presumir que sejam Zona Leste ou Vila Mariana; mapear preço real, disponibilidade, documentos, horário, tempo de deslocamento e interesse em repasse. Definir quem assume pagamento/nota e responsabilidade.

**Fase 1 — piloto funcional:** identidade/contas, fluxo de pneu e partida auxiliar de poucos toques, perguntas sobre estepe cheio/macaco/chave de roda e sintomas de bateria/equipamento, localização, descoberta em raio inicial de 10 km no município de São Paulo, preço claro por região/distância/categoria, cadastro/aprovação de PF/PJ, disponibilidade voluntária, despacho e aceite atômico, push, ETA, pagamento digital, checklist, cancelamento, suporte operacional e logs. Partida auxiliar só é habilitada para ajudantes equipados e orientados; calibragem entra ao habilitar prestadores com compressor. Garantir densidade de oferta nas zonas divulgadas antes de divulgar promessa de rapidez. Adicionar guincho apenas com compatibilidade, destino e preço por km completamente resolvidos; pode entrar em 1B.

**Fase 2 — robustez:** guincho completo, rotas dinâmicas, alteração de escopo e cobrança complementar, rastreamento mais frequente, antifraude, disputa/estorno, reatribuição automática e painel de métricas.

**Fase 3 — expansão:** mais cidades/categorias, equipe PJ, parcerias de frota/seguradoras, agendamento e otimização de distribuição. Crescimento por densidade de oferta, não apenas downloads.

**Critérios mínimos para operar comercialmente:** prestadores verificados disponíveis na zona, cobertura e preço publicados, pagamento e estorno testados, aceite sem duplicação, localização/ETA razoáveis, suporte humano, fluxo sem prestador, documentação/contratos revisados, incidentes simulados e testes reais controlados em Android/iOS. Cenários de teste: sem estepe; bateria não resolve; dois prestadores aceitam juntos; GPS impreciso; sinal cai; cobrança falha; prestador cancela após sair; cliente muda destino; peça indisponível; pagamento contestado; cliente em rodovia.

## 15. Métricas e decisões de negócio pendentes

Medir: pedidos iniciados e confirmados, cobertura, tempo até primeiro aceite, taxa de aceite, ETA previsto versus real, cancelamento por etapa, conclusão, reembolso, satisfação, receita líquida por pedido e ganho/hora do prestador. Não fixar SLA antes do piloto; definir metas após linha de base.

**Decisões que precisam de validação do fundador e especialistas:** bairros de atuação dos dois colegas e responsáveis por cada próxima zona (Brasilândia já confirmada como primeiro teste); se o raio aumenta além de 10 km e quando; categorias na abertura; tabela de preços e comissão; política de cancelamento; responsabilidades por danos e seguro; elegibilidade PF e documentação por serviço; provedor de pagamento e mapa; atendimento humano e horário real; nomenclatura “SUPRT” e marca; política fiscal/jurídica e proteção de dados. Estas escolhas não impedem prototipagem e testes internos, mas impedem prometer operação comercial completa.

## Fontes consultadas

- [Porto Seguro — como solicitar guincho](https://www.portoseguro.com.br/faqs/como-solicitar-um-guincho)
- [Sem Parar Agora — assistência avulsa](https://www.semparar.com.br/sem-parar-agora)
- [GetNinjas — sobre a plataforma](https://cms-assets.getninjas.com.br/sobre-nos)
- [99 — categorias e oferta](https://99app.com/passageiro/categorias-passageiro/)
- [Google Maps Routes — matriz de rotas](https://developers.google.com/maps/documentation/routes/compute_route_matrix)
- [Supabase — PostGIS](https://supabase.com/docs/guides/database/extensions/postgis)
- [Supabase — autorização Realtime](https://supabase.com/docs/guides/realtime/authorization)
- [Mercado Pago — split 1:1 para marketplace](https://www.mercadopago.com.br/developers/pt/docs/split-payments/split-1-1/overview)
- [Governo federal — ocupação guincheiro MEI](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/atividades-permitidas/g)
- [ANPD — titular de dados e geolocalização](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados)

- [Resgatou — exemplo público de preço móvel em São Paulo](https://resgatou.com.br/borracharia)

- [RAC — cuidados e limites de partida auxiliar](https://www.rac.co.uk/drive/advice/car-maintenance/how-to-jump-start-a-car/)
