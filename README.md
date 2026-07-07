# Simulador PROJEM com integração iSales

Projeto ajustado para enviar os leads do simulador ao CRM iSales sem criar um formulário separado e sem alterar a experiência visual da LP.

## Alterações desta versão

1. O campo de e-mail foi removido da etapa final.
2. O campo de cidade foi alinhado ao padrão do iSales: `name="cidade"`.
3. Antes do envio ao CRM, a cidade é relida diretamente do campo da página e sincronizada com o `state`, evitando envio vazio.
4. O envio ao iSales permanece por `POST` em iframe oculto, com `redirect=1`, sem redirecionar o usuário.
5. O formulário oculto usado no POST é removido apenas após alguns segundos, reduzindo risco de cancelamento do envio pelo navegador.
6. O envio atual para Make/webhook foi preservado.

## Campos enviados ao iSales

- `e`: `HJK1303ISAL567`
- `fid`: `UFD165TR951`
- `nome`
- `telefone`
- `cidade`
- `valor_energia`
- `redirect`: `1`

## Arquivos principais alterados

- `index.html`
- `assets/js/app.js`
- `assets/js/geo.js`
- `assets/js/storage.js`
- `assets/js/webhook.js`
- `assets/js/whatsapp.js`
