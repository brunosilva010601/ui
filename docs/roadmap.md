# Roadmap

## Pacote

- Criar o repositório no GitHub e definir como os apps instalam o pacote.
- Escolher o nome definitivo do pacote, hoje `ui`.
- Renomear a pasta `gallery`, provavelmente para `docs`.
- O espaço livre no topo das gavetas que sobem de baixo no celular está fora da escala (`src/modal.tsx`).
- A modal e a detecção de toque acessam a janela assim que o arquivo carrega, o que quebra a renderização no servidor que o Loremy usa.
- Ideia: configurar o tema do app num bloco no CSS (`@plugin`), com só as chaves que o projeto pode mudar, como a cor principal.
- Nome acessível: os `aria-label` foram removidos de todo o pacote, então botões só de ícone, setas, fechar e carregando não têm nome para leitor de tela. A proposta em discussão é o `Button` ter `label` obrigatório (lido pelo leitor de tela, mostrado como texto quando não há filho), `icon` para ícone com texto e `square` para só ícone, e os demais componentes seguirem a mesma ideia.

## Adoção pelo Mylo

O que muda em relação aos componentes atuais dele:

- `ConfirmDialog` espera a ação terminar quando `onConfirm` devolve uma promessa, em vez de observar o Inertia.
- `Brand` recebe nome e logo por props.
- `Toaster` recebe claro ou escuro, e a mensagem vinda do servidor fica no app.
- `DropdownItem` não tem mais a opção de virar botão do Inertia.
- Mês e dias da semana vêm do idioma do `UiProvider`, não dos textos do Mylo.
- Links soltos que dependiam do tamanho pequeno padrão precisam de `size`.
- Botões, chips, linhas de menu e avisos mudaram de tamanho para seguir a escala.
- A escolha de tema nas preferências passa a ser o `AppearancePicker`. O mesmo vale para o Loremy.
- `ChipGroup` vira `ButtonGroup` (variantes `outline` e `ghost`), com as mesmas `options`, `value`, `onChange` e `multiple`. Itens personalizados usam `ButtonGroupItem`.
- `Chip` sai. Etiqueta estática vira `Badge` (tons `neutral`, `primary`, `success`, `warning`, `danger`), e chip clicável vira `Button`. Vale para o Loremy também.

## Adoção pelo Loremy

- Os links de crédito com `variant="inline"` passam a usar `variant="link"`.
- O `RemoveButton` saiu do pacote. Cada uso vira um `Button` ghost, quadrado, com `bleed` e o ícone de lixeira.
- As cores de avaliação continuam no CSS do próprio Loremy.
