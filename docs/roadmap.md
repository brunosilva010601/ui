# Roadmap

## Refatoração aprovada

Objetivo: os apps usam o pacote e não criam tamanho de fonte nem nada próprio de aparência, com diferenças só por classe de caso, como `w-full`. Ordem de execução:

1. Trocar no pacote todas as classes para a escala nova (`gap-md` para `gap-12px`, `text-sm` para `text-14px`, números soltos) e absorver 20 px de texto em 18 e 36 px em 30.
2. Criar no pacote a moldura da página (cabeçalho, página com rodapé fixo, área segura, medida do rodapé para o `notify`), a superfície de cartão, `disabled` e `busy` no `ListItem`, `Cover` exportado, telas de autenticação e erro, item de navegação, botão flutuante e larguras no `Container`.
3. Completar o que já existe: `Detail` lado a lado com ação, par título e linha secundária, `EmptyState` compacto, props iguais em todos os campos, `NumberInput` sem moldura e com valor grande, borda e fundo na paleta, botão marcado na cor do significado.
4. Limpar: exportações em lista explícita, sem as sem uso e as classes internas; um mapa de tons, com `danger` no `notify`; moldura compartilhada entre abas e grupo; `Section` e `Modal` divididas; sem `emoji` no `Select`; sombras com nome; variáveis todas em `tokens.css`; formatador no pacote.
5. Completar a galeria com `Columns`, `MainColumn`, `SideColumn`, `Container`, `ControlStrut`, `Sortable`, `Popover`, `useModalValue`, `ModalCloseButton`, `touchClass` e `FieldError`, e com as escalas novas.
6. Migrar os apps um a um, primeiro o Salalas e depois o Mylo, que então declara a própria cor e larga `--gutter` e `size-icon-md`. O Salalas perde a altura de linha própria e passa a usar `ui-label`, `ui-prompt` e `ui-display` do pacote.
7. Remover os nomes antigos e o multiplicador `--spacing` na versão em que o Loremy adotar, com um lint contra número puro.

## Pacote

- Escolher o nome definitivo do pacote, hoje `ui`.
- Renomear a pasta `gallery`, provavelmente para `docs`.
- O espaço livre no topo das gavetas que sobem de baixo no celular está fora da escala (`src/modal.tsx`).
- A modal e a detecção de toque acessam a janela assim que o arquivo carrega, o que quebra a renderização no servidor que o Loremy usa.
- Ideia: configurar o tema do app num bloco no CSS (`@plugin`), com só as chaves que o projeto pode mudar, como a cor principal.
- A modal escuta o voltar do navegador assim que o arquivo carrega e empurra uma entrada de histórico por janela aberta (`src/modal.tsx`), o que ainda não foi testado contra um roteador que não seja o do Inertia, como o do Salalas.
- A modal não dismissível (`dismissible={false}`) prende Escape e clique fora e esconde o X, mas o gesto de arrastar a gaveta para baixo ainda fecha.
- Nome acessível: os `aria-label` foram removidos de todo o pacote, então botões só de ícone, setas, fechar e carregando não têm nome para leitor de tela. A proposta em discussão é o `Button` ter `label` obrigatório (lido pelo leitor de tela, mostrado como texto quando não há filho), `icon` para ícone com texto e `square` para só ícone, e os demais componentes seguirem a mesma ideia.

## Adoção pelo Salalas

O Salalas já usa o pacote. O que a troca decidiu:

- O emoji do jogo entra como conteúdo do botão e do título da seção, que aceitam qualquer coisa. Não há prop de emoji nem escala de texto só para ele.
- A coluna de 32 rem do app é o `max-w-lg` do Tailwind, no shell da tela, que é do app.
- O botão de linha cheia recebe `w-full` em cada uso, e os nomes de leitor de tela do app viram `aria-label`, que o botão já repassa.
- `ButtonGroup` ficou para escolha entre opções (tema, som, vibração, opções do jogo). Os botões de jogada que marcam a escolha feita, como "Duvido" ou "Verdade", continuam `Button` com `aria-pressed`: a cor ali é o significado da jogada, e inverter o escolhido apagaria isso.
- O menu da sala e o do jogador viram modal `sheet` com botões de linha cheia, sem o botão "Voltar" que o fechar já faz.
- O app instala o pacote pela tag, como os outros, sem os ajustes que o caminho local pedia.

O que a adoção pediu ao pacote: `disabled` no `Input`, `cancelLabel` e `tone` no `ConfirmDialog`, `dismissible` no `Modal`, `disabled` no `ButtonGroup` e no `ButtonGroupItem`, `aria-label` no item, `layout="segmented"` no grupo e `sideEffects` no `package.json`, que tirou do app o realce de código que ele nunca mostra.

O que falta: o voltar do navegador com modal aberta não foi testado contra o roteador do Salalas, e a galeria ainda não mostra o `dismissible` da modal, o `cancelLabel` e o `tone` da confirmação nem o `disabled` do campo.

## Vindo do Mylo, a discutir

O Mylo já usa o pacote. O que ele tinha e o pacote ainda não tem:

- O `Markdown` traz o realce de código para todo app que o usa. Na troca, o JavaScript do Mylo cresceu cerca de 57 kB.

## Adoção pelo Loremy

- A escolha de tema nas preferências passa a ser o `AppearancePicker`.
- Linhas de lista montadas com `staticRowClass`, `coverRowClass` e `layerRowClass` passam a ser `ListItem`, com o conteúdo de cada linha montado no próprio Loremy.
- `Chip` sai. Etiqueta estática vira `Badge` (tons `neutral`, `primary`, `success`, `warning`, `danger`), e chip clicável vira `Button`.

- Os links de crédito com `variant="inline"` passam a usar `variant="link"`.
- O `RemoveButton` saiu do pacote. Cada uso vira um `Button` ghost, quadrado, com `bleed` e o ícone de lixeira.
- As cores de avaliação continuam no CSS do próprio Loremy.
- A modal do trailer troca `width="lg"` por `className="max-w-4xl"`.
- As gavetas (`format="drawer"`) passam a ser `mobile="full"`: sobem de baixo no celular e viram painel à direita no computador.
- As faixas dos carrosséis (prateleira de itens e colaboradores) passam a ser `CarouselTrack`, que já esmaece as bordas. Hoje só a prateleira esmaece, por conta própria.
