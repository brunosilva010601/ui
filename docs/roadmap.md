# Roadmap

## Pacote

- Quando o Loremy adotar: remover os nomes antigos (`gap-md`, `text-sm`, `size-icon-sm`, `--gap-*`, `--padding-*`, `--margin-*`) e o multiplicador `--spacing`, fechar `--text-*` e acrescentar um lint contra número puro. Mylo e Salalas já estão sem eles.
- Escolher o nome definitivo do pacote, hoje `ui`.
- Renomear a pasta `gallery`, provavelmente para `docs`.
- A modal e a detecção de toque já carregam onde não existe janela, mas o toque sai como falso nesse caso e só acerta quando a página revive no navegador, o que a renderização no servidor do Loremy ainda precisa resolver.
- Ideia: configurar o tema do app num bloco no CSS (`@plugin`), com só as chaves que o projeto pode mudar, como a cor principal.
- A modal escuta o voltar do navegador assim que o arquivo carrega e empurra uma entrada de histórico por janela aberta (`src/modal-history.ts`), o que ainda não foi testado contra um roteador que não seja o do Inertia, como o do Salalas.
- `Section` ainda tem quatro formas de clique (`onClick`, `href`, `headerHref`, `onHeaderClick`), e `Banner`, `EmptyState` e `notify` recebem a ação em três formatos.
- `Brand` no tamanho `md` traz recuo de posição junto do tamanho, e o girador aparece repetido no botão, no `Banner` e no `Spinner`.
- O mínimo de `lucide-react` aceito pelo pacote está abaixo do que ele usa.
- Ainda fora de `css/tokens.css` ou da escala: larguras `max-w-*` do Tailwind em `rem`, `--radius` em `rem`, `leading-relaxed` no bloco de código, as medidas de `lib/edge-fade.ts` e o ícone de 12 px da `Badge`.
- A decidir: item de lista `disabled` ou `busy` continua arrastável pela alça.
- A modal não dismissível (`dismissible={false}`) prende Escape e clique fora e esconde o X, mas o gesto de arrastar a gaveta para baixo ainda fecha.
- Nome acessível: os `aria-label` foram removidos de todo o pacote, então botões só de ícone, setas, fechar e carregando não têm nome para leitor de tela. A proposta em discussão é o `Button` ter `label` obrigatório (lido pelo leitor de tela, mostrado como texto quando não há filho), `icon` para ícone com texto e `square` para só ícone, e os demais componentes seguirem a mesma ideia.

## Adoção pelo Salalas

O Salalas já usa o pacote. O que a troca decidiu:

- O emoji do jogo entra como conteúdo do botão e do título da seção, que aceitam qualquer coisa. Não há prop de emoji nem escala de texto só para ele.
- A coluna de 32 rem do app é a largura `column` da `Page`, e o `Screen` só escolhe essa largura.
- O botão de linha cheia recebe `w-full` em cada uso, e os nomes de leitor de tela do app viram `aria-label`, que o botão já repassa.
- `ButtonGroup` ficou para escolha entre opções (tema, som, vibração, opções do jogo). Os botões de jogada que marcam a escolha feita, como "Duvido" ou "Verdade", continuam `Button` com `aria-pressed`: a cor ali é o significado da jogada, e inverter o escolhido apagaria isso.
- O menu da sala e o do jogador viram modal `sheet` com botões de linha cheia, sem o botão "Voltar" que o fechar já faz.
- O app instala o pacote pela tag, como os outros, sem os ajustes que o caminho local pedia.

O que a adoção pediu ao pacote: `disabled` no `Input`, `cancelLabel` e `tone` no `ConfirmDialog`, `dismissible` no `Modal`, `disabled` no `ButtonGroup` e no `ButtonGroupItem`, `aria-label` no item, `layout="segmented"` no grupo e `sideEffects` no `package.json`, que tirou do app o realce de código que ele nunca mostra.

O que falta: o voltar do navegador com modal aberta não foi testado contra o roteador do Salalas. Os cartões com regra do jogo (`EntryRow`, `GroupCard`, `IdentityCard`, `HoldToReveal` e a pista do Três Pistas) continuam montados no app, com as classes de `Surface` escritas à mão, porque têm medalha, tremor e toque próprios; vale passá-los para `Surface` quando forem mexidos. O teclado (`Keypad`) ainda reescreve o gesto de segurar em vez de usar `useHold`. O contador (`Stepper`) ainda manda o valor ao app a cada dígito, em vez de esperar o fim da digitação.

## Vindo do Mylo, a discutir

O Mylo já usa o pacote. O que ele tinha e o pacote ainda não tem:

- O `Markdown` traz o realce de código para todo app que o usa. Na troca, o JavaScript do Mylo cresceu cerca de 57 kB.

## Adoção pelo Loremy

- A escolha de tema nas preferências passa a ser o `AppearancePicker`.
- Linhas de lista montadas com `staticRowClass`, `coverRowClass` e `layerRowClass` passam a ser `ListItem`, com o conteúdo de cada linha montado no próprio Loremy.
- `Chip` sai. Etiqueta estática vira `Badge` (tons `neutral`, `primary`, `success`, `warning`, `danger`), e chip clicável vira `Button`.
- `ChipGroup` e `ChipOption` viram `ButtonGroup` e `ButtonGroupItem`.
- `IconToggle` vira `Button` outline com `mark` e `aria-pressed`, e as cores de avaliação entram como `className`, porque o tom do `mark` só cobre os tons e a paleta do pacote.
- As classes internas não são reexportadas: `menuRowClass` e `tintClass` da navegação viram `NavItem`, `ghostHoverClass` vira `Button` ghost, `sectionPadding` vira `p-12px` ou `Surface`, e `headingClass`, `HeadingTitle` e `HeadingDescription` viram `Heading` ou `ItemText`.
- Os links de crédito com `variant="inline"` passam a usar `variant="link"`.
- O `RemoveButton` saiu do pacote. Cada uso vira um `Button` ghost, quadrado, com `bleed` e o ícone de lixeira.
- As cores de avaliação continuam no CSS do próprio Loremy.
- A modal do trailer troca `width="lg"` por `className="max-w-4xl"`.
- As gavetas (`format="drawer"`) passam a ser `mobile="full"`: sobem de baixo no celular e viram painel à direita no computador.
- As faixas dos carrosséis (prateleira de itens e colaboradores) passam a ser `CarouselTrack`, que já esmaece as bordas. Hoje só a prateleira esmaece, por conta própria.
