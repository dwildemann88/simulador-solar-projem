# Simulador Solar PROJEM

Simulador estático da PROJEM com integrações iSales, Make, Google Tag Manager e Meta Pixel.

## Objetivo desta versão

A branch `conversion-qualified-v2` reorganiza o simulador para priorizar intenção comercial qualificada, mensuração do funil e experiência mobile, sem transformar a página em um formulário longo.

Fluxo atual da proposta:

1. Faixa da conta de energia
2. Cidade
3. Tipo de imóvel
4. Prazo de compra
5. Processamento curto e verdadeiro
6. Prévia informacional
7. Nome + WhatsApp
8. Resultado preliminar
9. Continuação da análise pelo WhatsApp

## Correção técnica importante

A versão anterior calculava economia usando um percentual aleatório e ajustes por tipo de telhado / histórico de orçamento. Como o valor da conta sozinho não é suficiente para produzir uma estimativa tecnicamente defensável, essa lógica foi removida.

A prévia agora classifica o potencial para análise sem inventar percentual, nova conta ou investimento. O dimensionamento final deve considerar a fatura e as condições técnicas do imóvel.

## Tracking do funil

Eventos adicionados ao `dataLayer`:

- `solar_simulator_view`
- `solar_simulator_start`
- `solar_simulator_step_view`
- `solar_simulator_step_complete`
- `solar_simulator_contact_view`
- `solar_simulator_contact_complete`
- `solar_simulator_result_preview`
- `solar_simulator_whatsapp_click`
- `solar_simulator_complete`

Parâmetros de progressão não incluem nome ou telefone.

## Atribuição

Continuam sendo preservados em `localStorage` quando presentes:

- `gclid`
- `gbraid`
- `wbraid`
- `fbclid`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Cada sessão de simulação recebe também um `lead_id` próprio em `sessionStorage`.

## Make / webhook

O endpoint atual do Make foi preservado. Os campos existentes continuam no payload e foram adicionados, sem remoção dos anteriores:

- `lead_id`
- `timestamp`
- `tipo_imovel_perfil`
- `prazo_compra`
- `resultado_estimado`
- `qualificacao`
- `whatsapp_clicked`
- `experiment_variant`

Observação: o campo legado `tipo_imovel` historicamente recebia tipo de cobertura/telhado. A nova informação Residencial/Comercial/Rural foi criada como `tipo_imovel_perfil` para não alterar silenciosamente a semântica do contrato existente.

## iSales

O envio ao iSales permanece via POST em iframe oculto com os campos:

- `e`
- `fid`
- `nome`
- `telefone`
- `cidade`
- `valor_energia`
- `redirect=1`

O envio é protegido contra repetição dentro da mesma tentativa de lead.

## Mobile e interface

O CSS foi simplificado para priorizar celulares. Foram previstos ajustes específicos para 430, 390, 360 e 320 px, mantendo inputs com 16 px para evitar zoom automático no iPhone.

O carregamento artificial de 2,6 s foi reduzido para aproximadamente 1,25 s e usa apenas mensagens compatíveis com o processamento que realmente ocorre no navegador.

## Pontos que ainda exigem validação humana antes de produção

- validar visualmente 320 / 360 / 375 / 390 / 412 / 430 px em navegador real;
- validar o recebimento dos novos campos no cenário Make;
- confirmar as tags/variáveis do GTM para os novos eventos;
- testar envio real ao iSales;
- confirmar abertura e mensagem do WhatsApp;
- conferir se alguma automação downstream dependia dos valores antigos de `tipo_imovel` / `economia`.
