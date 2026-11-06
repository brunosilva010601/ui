# Roadmap

## Pacote

- No `MarkdownEditor`, arrastar o item de lista para o lado ainda não muda o nível dele, como no Raycast; por ora o nível muda com Tab.
- Ligar as regras de `lint/` no Mylo e instalar nele a versão com o tema limpo. Loremy e Salalas já estendem a configuração do pacote desde a 0.8.1. O Mylo, na 0.7.1, ainda usa os nomes em pixels (`gap-8px`, `text-12px`, `size-icon-16px`) em cerca de 150 lugares, que somem sem aviso na 0.8.0, e tem 4 ícones com tamanho dentro do botão.
- Escolher o nome definitivo do pacote, hoje `ui`.
- Renomear a pasta `gallery`, provavelmente para `docs`.
- Ideia: configurar o tema do app num bloco no CSS (`@plugin`), com só as chaves que o pacote define e o projeto pode mudar, como a cor principal. Cor de produto fica fora dele, no `@theme` do app, como diz `padroes.md`.
- O histórico das modais agora troca a entrada da janela pela navegação do roteador (`src/modal-history.ts`), sem ligação no app, mas ainda não foi visto no navegador: falta repetir no Salalas a medida dos Ajustes (abrir, navegar de dentro, voltar) e conferir no Mylo e no Loremy que o voltar com modal aberta continua igual.
- Tirar `visitReplacesModalEntry` do `src/index.ts` quando o Mylo e o Loremy apagarem o `router.on('before')` que ainda o chama.
- `Section` ainda tem quatro formas de clique (`onClick`, `href`, `headerHref`, `onHeaderClick`), e `Banner`, `EmptyState` e `notify` recebem a ação em três formatos.
- `Brand` no tamanho `md` traz recuo de posição junto do tamanho, e o girador aparece repetido no botão, no `Banner` e no `Spinner`.
- O mínimo de `lucide-react` aceito pelo pacote está abaixo do que ele usa.
- Ainda fora de `css/tokens.css` ou da escala: larguras `max-w-*` do Tailwind em `rem`, `--radius` em `rem`, a altura de linha escrita à mão no bloco de código, as medidas de `lib/edge-fade.ts` e o ícone de 12 px da `Badge`, que fica fora dos tamanhos de ícone.
- A decidir: item de lista `disabled` ou `busy` continua arrastável pela alça.
- Nome acessível: as peças só de ícone do próprio pacote já têm nome pelos textos do `UiLabels`, mas o `Button` só de ícone de um app continua dependendo de o app lembrar do `aria-label`. A proposta em discussão é o `Button` ter `label` obrigatório (lido pelo leitor de tela, mostrado como texto quando não há filho), `icon` para ícone com texto e `square` para só ícone, e os demais componentes seguirem a mesma ideia.
- A confirmar: no Explorar do Loremy (430 × 932, escuro), a gaveta de Filtros fechou uma vez junto com o seletor de Serviços, aberto logo depois de fechar o de Gêneros pelo voltar. Não se repetiu em três tentativas. Os suspeitos são o histórico das modais (`src/modal-history.ts`) e o arrastar da gaveta (`src/modal.tsx`).
- O Loremy, ao instalar a versão seguinte, troca o botão de marcar pelo `stacked` (o lint já acusa o ícone dimensionado pelo `className` em `item/mark-toggle.tsx`), o contador de filtros pela `Badge` com `solid` e o botão flutuante pelo `floating` do `PageBottom`. Ainda sem peça no pacote: o `p-1` no avatar do menu e o `Surface` com `p-2 text-xs` no seletor de serviços.

## Adoção pelo Salalas

O Salalas já usa o pacote. O que a troca decidiu:

- O emoji do jogo entra como conteúdo do botão e do título da seção, que aceitam qualquer coisa. Não há prop de emoji nem escala de texto só para ele.
- A coluna de 32 rem do app é a largura `column` da `Page`, e o `Screen` só escolhe essa largura.
- O botão de linha cheia recebe `w-full` em cada uso, e os nomes de leitor de tela do app viram `aria-label`, que o botão já repassa.
- `ButtonGroup` ficou para escolha entre opções (som, vibração, aparência, opções do jogo). A aparência nos Ajustes é segmented como o som, porque as prévias do `AppearancePicker` ocupam a modal inteira. Os botões de jogada que marcam a escolha feita, como "Duvido" ou "Verdade", continuam `Button` com `aria-pressed`: a cor ali é o significado da jogada, e inverter o escolhido apagaria isso.
- O menu da sala e o do jogador viram modal `sheet` com botões de linha cheia, sem o botão "Voltar" que o fechar já faz.
- O app instala o pacote pela tag, como os outros, sem os ajustes que o caminho local pedia.

O que a adoção pediu ao pacote: `disabled` no `Input`, `cancelLabel` e `tone` no `ConfirmDialog`, `dismissible` no `Modal`, `disabled` no `ButtonGroup` e no `ButtonGroupItem`, `aria-label` no item, `layout="segmented"` no grupo, `sideEffects` no `package.json`, que tirou do app o realce de código que ele nunca mostra, o histórico das modais sem ligação com o roteador, `tone`, `linear` e `className` na `ProgressBar` e `plugins` vazio na configuração do oxlint.

O que falta: o relógio da rodada (`Countdown`) ainda tem barra própria e passa para a `ProgressBar` com `tone`, `linear` e `key` no prazo. Os cartões com regra do jogo (`EntryRow`, `GroupCard`, `IdentityCard`, `HoldToReveal` e a pista do Três Pistas) continuam montados no app, com as classes de `Surface` escritas à mão, porque têm medalha, tremor e toque próprios; vale passá-los para `Surface` quando forem mexidos. O teclado (`Keypad`) ainda reescreve o gesto de segurar em vez de usar `useHold`. O contador (`Stepper`) ainda manda o valor ao app a cada dígito, em vez de esperar o fim da digitação.

## Vindo do Mylo, a discutir

O Mylo já usa o pacote. O que ele tinha e o pacote ainda não tem:

- O `Markdown` traz o realce de código para todo app que o usa. Na troca, o JavaScript do Mylo cresceu cerca de 57 kB.
