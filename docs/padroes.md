# Padrões

## Tema

- Cor sempre pelo papel (`primary`, `surface`, `foreground-muted`), nunca por uma cor fixa do Tailwind. A exceção é a paleta de cores que o usuário escolhe para itens (`src/palette.ts`).
- Padding, gap, margem e tamanho vêm de uma escala só em `css/tokens.css`, com o valor escrito e o nome em pixels (`p-8px`, `gap-16px`): 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40 e 48. O número puro do Tailwind (`p-4`, que dá 16 px) não entra em código novo, e medida de um único componente é explícita (`w-[256px]`). Pixels não crescem com a fonte do navegador; o texto, em `rem`, cresce.
- A área segura do aparelho entra pela mesma escala (`pt-safe-top`, `pb-safe-bottom`, ou `var(--spacing-safe-bottom)` dentro de um `max()`), com uma regra só, e nenhum componente escreve `env()`.
- Sombra tem três nomes, e os do Tailwind não existem mais: `shadow-control` (botão do `Switch`), `shadow-floating` (aviso, botão flutuante, item arrastado) e `shadow-overlay` (modal e menu).
- As variáveis do tema ficam todas em `css/tokens.css`, inclusive as que não são escala, como `--gutter` e `--row-inset`.
- Os nomes antigos (`gap-md`, `size-icon-sm`) e o multiplicador `--spacing` só existem até os apps migrarem, e saem na versão em que o Loremy adotar o pacote.
- Texto usa a escala fechada 12, 14, 16, 18, 24, 30, 48 e 60 (`text-14px`) e, no dia a dia, os papéis prontos: `ui-page-title`, `ui-item-title`, `ui-note`, `ui-label`, `ui-prompt`, `ui-display` e `ui-hero`. Um app não define tamanho, peso nem altura de linha próprios. Nome novo de espaçamento ou de texto entra também em `src/lib/utils.ts`, senão a sobrescrita por `className` falha sem aviso.
- O espaço entre ícone e texto segue o tamanho do ícone: ícone de 14 px com `gap-4px`, de 16 px com `gap-8px`, de 20 px com `gap-12px`.
- Cada área com padding declara até onde uma lista com `bleed` avança (`--bleed`): a página pela margem dela, o card pelo padding dele. A lista recua isso e devolve o mesmo valor como recuo das linhas (`--row-inset`), para o fundo encostar na borda da área e o texto continuar alinhado com o resto.
- A altura de um controle é a soma do padding, da linha de texto e da borda. Não há altura fixa nem mínima, para o controle crescer com o conteúdo.
- Todo controle tem borda de 1 px, transparente quando não aparece, para trocar de variante nunca mudar a altura.
- Campos usam fonte 16 porque, abaixo disso, o iPhone dá zoom ao tocar no campo.
- A fonte de emoji vem antes das fontes do sistema na família padrão, porque é o pacote que a carrega: atrás delas, o emoji e os símbolos que o sistema também desenha (©, ❤, as teclas numéricas) mudariam de forma a cada aparelho e sairiam em preto e branco. Vir na frente também quer dizer que, se ela falhar, não sobra nada para desenhar o emoji, então trocar esses arquivos pede conferir no navegador que o desenho aparece.

## Componentes

- Nenhum componente depende de roteador nem dos textos de um app. Link, textos, idioma e navegação chegam pelo `UiProvider` ou por props.
- `src/index.ts` é uma lista explícita, e o que não está nela não é API. Classes de estilo e peças internas (`fieldClass`, `headingClass`, `useCloseOnBack`) ficam de fora; só `touchClass` é classe pública. App que precisa de uma classe interna está pedindo uma peça ou uma prop nova.
- A moldura de tela é do pacote: `AppShell` (barra lateral, conteúdo e painel, com o fundo `canvas` no computador), `Page`, `PageHeader` e `PageFooter`. `PageBottom` é a base fixa ao pé da tela e mede a própria altura em `--page-bottom`, que é o que mantém o `notify` acima do rodapé. Um app monta só o que é dele por cima, como botões do cabeçalho.
- A tela de autenticação (`AuthScreen`) e a de erro (`ErrorScreen`) são do pacote, e marca, ação e fundo chegam de fora.
- Cartão é `Surface`: fundo, borda, canto e recuo, com o bloco inteiro clicável quando tem ação (por `Cover`). O par de título e linha secundária de um item é `ItemText`, e o resto da linha continua livre.
- `ListItem` e `Surface` têm `disabled`; `ListItem` tem também `busy`, com o girador no fim. Nos dois casos o item não recebe clique nem abre menu.
- Um tom é sempre um destes cinco, em `src/tones.ts`: `neutral`, `primary`, `success`, `warning` e `danger`. `Badge`, `Banner`, `notify` e o botão marcado usam o mesmo mapa.
- Todo campo aceita as mesmas props (`FieldProps`): `label`, `hideLabel`, `description`, `hint`, `optional`, `error` e `disabled`.
- Botão marcado (`mark`) é o que mostra a escolha feita na cor do que ela significa, como uma jogada: recebe um tom ou uma cor da paleta, e o app liga e desliga junto de `aria-pressed`. É o único caso em que a seleção tem cor.
- A barra de abas e o grupo `segmented` usam a mesma moldura e o mesmo item, em `src/track.ts`, para nunca saírem diferentes.
- Em cada tamanho, o botão de texto e o botão quadrado de ícone têm a mesma altura: 42 px no médio, com ícone de 20 px no quadrado, e 30 px no pequeno, com ícone de 16 px. Mudar o padding de um exige ajustar o outro, em geral pelo tamanho do ícone, e o app não passa tamanho de ícone para o botão.
- Ação é `Button`. Item de menu, aba, opção de grupo e linha de lista são componentes próprios, que reaproveitam os mesmos tokens (canto, recuo, realce) em vez de virar variante ou prop do botão; esticar o botão para ser item de menu mudava largura, recuo, alinhamento, quebra e canto, ou seja, era outro componente escondido numa prop. O item de menu (`DropdownItem`) tem canto padrão, recuo das listas, texto escuro com ícone cinza, e o escolhido (`selected`) ganha um fundo leve. Escolha entre opções é um `ButtonGroup` (uma opção que troca, ou várias com `multiple`), outline por padrão, com o escolhido invertido (fundo da cor do texto), igual à aba ativa, e ghost dentro de menu, com o fundo leve. Quando as opções são poucas, excludentes e do mesmo peso, `layout="segmented"` junta todas numa trilha só, com a moldura do campo em volta e larguras iguais, como a barra de abas; aba continua sendo troca de painel, nunca de valor. A cor principal fica para ação, nunca para seleção: o escolhido tem só duas aparências, invertido em abas e grupos e fundo leve em itens e linhas. `Badge` é só etiqueta estática, nunca clicável.
- O menu abre a partir do elemento que o app passa (um `Button`, ou o `RowTrigger` numa linha de formulário), e não de um tipo de gatilho do pacote, para o pacote não repetir as variantes do botão. O item age ao ser escolhido (`onSelect`), leva a outro lugar (`href`) ou, quando escolher não deve fechar o menu, é um `DropdownCheckboxItem`. O `touchClass` aumenta a área de toque de qualquer peça pequena.
- O menu de clique não borra a tela: o botão que o abriu fica marcado como aberto, e uma camada invisível segura o primeiro toque fora, para ele só fechar o menu. O menu de segurar um item borra e escurece o resto, com um recorte no formato do item, que aparece por ele de verdade, com o fundo, o estado e o corte de onde está. Uma cópia do item por cima perdia tudo isso.
- O menu continua sobre o `Popover`, e não sobre o `DropdownMenu` do Radix, que daria papel de menu, setas e busca por letra: o do Radix só se posiciona pelo próprio gatilho, e o menu de segurar precisa se ancorar na linha inteira sem que clicar nela abra o menu; no toque, a escolha de valor abre numa modal.
- Link tem uma variante só (`variant="link"`). Sem `size`, ele herda o tamanho do texto em volta e quebra linha junto com a frase.
- A `Section` aceita uma terceira linha no cabeçalho (`meta`), em fonte de código, depois da descrição.
- A lista é só a moldura, e o conteúdo de cada item é livre e do app. O pacote dá o formato (`divided`, `cards` ou `bare`), o recuo, o realce, os estados ativo e selecionado, o clique do item inteiro e o menu do item, com o ⋯ no fim dentro do realce ou só ao passar o mouse. Assim cada app monta a linha do seu jeito sem o pacote virar o de um app só.
- Itens de lista e seções se reordenam arrastando por uma alça no recuo à esquerda (`onReorder` e `sortId`, ou `Sortable` em volta de seções). Ela aparece ao passar o mouse e, no modo de organizar (`organizing`), fica sempre à vista, porque no toque o segurar já é o gesto de outra coisa.
- Cada uso do `Modal` diz o formato no celular (`mobile`) e, quando foge do padrão, no computador (`desktop`), e a troca entre os dois é só CSS. Detectar a tela em JavaScript quebraria a montagem no servidor e trocaria a peça no meio, com a janela aberta, se o tamanho mudasse.
- Controles que se repetem com o mesmo papel (botão, campo) têm tamanhos fixos com nome. Modal, gaveta e menus têm uma largura padrão e mudam pelo `className` quando o conteúdo pede, porque cada caso tem um conteúdo diferente.
- Ação em curso é o `busy` do botão: ele bloqueia, se anuncia como ocupado e troca o ícone por um girador do tamanho do ícone, sem mudar de altura. Pulsar ou esmaecer o bloco em volta é do app, não do controle.
- Aviso que fica na tela é o `Banner`, com os tons da `Badge`, ícone por tom, ação ao lado e `bleed` para encostar nas bordas da área. Aviso passageiro é o `notify`, e dica sob demanda é o `Hint`: cada um aparece de um jeito e some de um jeito, então não são variantes da mesma peça.
- Modal que espera uma resposta obrigatória, como uma votação do grupo, recebe `dismissible={false}`: Escape, clique fora e o fechar somem, porque sair sem responder deixaria todo mundo esperando. Fora esse caso toda modal fecha.
- A confirmação (`ConfirmDialog`) é vermelha, porque quase sempre o que ela confirma destrói algo; `tone="primary"` é para o que só refaz, como sortear outra carta. O rótulo de cancelar segue o dos textos do app e muda por `cancelLabel` quando a tela pede a palavra do caso.
- O vazio (`EmptyState`) pede só o título; ícone, descrição e ação entram quando a tela pede, e `compact` é a forma para dentro de um cartão. Não há uma segunda moldura de vazio, porque seriam dois jeitos de dizer a mesma coisa.
- Largura é do caso, não do controle. O botão nasce do tamanho do conteúdo e recebe `w-full` onde precisa ocupar a linha, como num rodapé ou numa grade de escolha. Não há prop de largura: ela seria um segundo jeito de dizer o que a classe já diz.
- O gesto de segurar ou clicar com o botão direito é uma peça própria (`useHold`), aplicável a qualquer elemento. O menu do item da lista e o das seções usam o mesmo gancho em cima dela (`useHeldMenu`), com o mesmo ⋯, e todo bloco clicável inteiro usa a mesma cobertura (`Cover`).

## Galeria

- Só componentes do pacote. Nada é criado para uso exclusivo da galeria.
- Grupos são `Section` flat recolhíveis. Cada componente é uma única `Section` outlined recolhível, com descrição e as props no `meta`.
- Dentro do componente aparecem todas as combinações juntas (variantes, tamanhos, com e sem ícone, estados), sem separar em várias seções. Só se divide quando o contexto muda de verdade.
- Cada componente mostra também os casos de limite: conteúdo que passa do espaço, texto longo que quebra, ícone grande, muitos itens.
- Textos de exemplo neutros e em inglês ("Label", "Option A"), nunca nomes tirados dos apps.
