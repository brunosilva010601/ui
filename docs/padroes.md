# Padrões

## Tema

- Cor sempre pelo papel (`primary`, `surface`, `foreground-muted`), nunca por uma cor fixa do Tailwind. A exceção é a paleta de cores que o usuário escolhe para itens (`src/palette.ts`).
- Padding, gap e margem sempre pela escala com nome de `css/tokens.css`. Número só para o que não é espaçamento, como alturas, larguras e as margens negativas de sangria.
- O espaço entre ícone e texto segue o tamanho do ícone: ícone `xs` com `gap-xs`, `sm` com `gap-sm`, `md` com `gap-md`.
- Cada área com padding declara até onde uma lista com `bleed` avança (`--bleed`): a página pela margem dela, o card pelo padding dele. A lista recua isso e devolve o mesmo valor como recuo das linhas (`--row-inset`), para o fundo encostar na borda da área e o texto continuar alinhado com o resto.
- A altura de um controle é a soma do padding, da linha de texto e da borda. Não há altura fixa nem mínima, para o controle crescer com o conteúdo.
- Todo controle tem borda de 1 px, transparente quando não aparece, para trocar de variante nunca mudar a altura.
- Campos usam fonte 16 porque, abaixo disso, o iPhone dá zoom ao tocar no campo.
- A fonte de emoji vem antes das fontes do sistema na família padrão, porque é o pacote que a carrega: atrás delas, o emoji e os símbolos que o sistema também desenha (©, ❤, as teclas numéricas) mudariam de forma a cada aparelho e sairiam em preto e branco. Vir na frente também quer dizer que, se ela falhar, não sobra nada para desenhar o emoji, então trocar esses arquivos pede conferir no navegador que o desenho aparece.

## Componentes

- Nenhum componente depende de roteador nem dos textos de um app. Link, textos, idioma e navegação chegam pelo `UiProvider` ou por props.
- Em cada tamanho, o botão de texto e o botão quadrado de ícone têm a mesma altura. Mudar o padding de um exige ajustar o outro, em geral pelo tamanho do ícone.
- Ação é `Button`. Item de menu, aba, opção de grupo e linha de lista são componentes próprios, que reaproveitam os mesmos tokens (canto, recuo, realce) em vez de virar variante ou prop do botão; esticar o botão para ser item de menu mudava largura, recuo, alinhamento, quebra e canto, ou seja, era outro componente escondido numa prop. O item de menu (`DropdownItem`) tem canto padrão, recuo das listas, texto escuro com ícone cinza, e o escolhido (`selected`) ganha um fundo leve. Escolha entre opções é um `ButtonGroup` (uma opção que troca, ou várias com `multiple`), outline por padrão, com o escolhido invertido (fundo da cor do texto), igual à aba ativa, e ghost dentro de menu, com o fundo leve. Quando as opções são poucas, excludentes e do mesmo peso, `layout="segmented"` junta todas numa trilha só, com a moldura do campo em volta e larguras iguais, como a barra de abas; aba continua sendo troca de painel, nunca de valor. A cor principal fica para ação, nunca para seleção: o escolhido tem só duas aparências, invertido em abas e grupos e fundo leve em itens e linhas. `Badge` é só etiqueta estática, nunca clicável.
- O menu abre a partir do elemento que o app passa (um `Button`, ou o `RowTrigger` numa linha de formulário), e não de um tipo de gatilho do pacote, para o pacote não repetir as variantes do botão. O item age ao ser escolhido (`onSelect`), leva a outro lugar (`href`) ou, quando escolher não deve fechar o menu, é um `DropdownCheckboxItem`. Classes de estilo dos componentes não são API pública; só o `touchClass`, que aumenta a área de toque de qualquer peça pequena, continua exportado.
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
- O vazio (`EmptyState`) pede só o título; ícone, descrição e ação entram quando a tela pede. Não há uma segunda moldura de vazio, porque seriam dois jeitos de dizer a mesma coisa.
- Largura é do caso, não do controle. O botão nasce do tamanho do conteúdo e recebe `w-full` onde precisa ocupar a linha, como num rodapé ou numa grade de escolha. Não há prop de largura: ela seria um segundo jeito de dizer o que a classe já diz.
- O gesto de segurar ou clicar com o botão direito é uma peça própria (`useHold`), aplicável a qualquer elemento. O menu do item da lista e o das seções usam o mesmo gancho em cima dela (`useHeldMenu`), com o mesmo ⋯, e todo bloco clicável inteiro usa a mesma cobertura (`Cover`).

## Galeria

- Só componentes do pacote. Nada é criado para uso exclusivo da galeria.
- Grupos são `Section` flat recolhíveis. Cada componente é uma única `Section` outlined recolhível, com descrição e as props no `meta`.
- Dentro do componente aparecem todas as combinações juntas (variantes, tamanhos, com e sem ícone, estados), sem separar em várias seções. Só se divide quando o contexto muda de verdade.
- Cada componente mostra também os casos de limite: conteúdo que passa do espaço, texto longo que quebra, ícone grande, muitos itens.
- Textos de exemplo neutros e em inglês ("Label", "Option A"), nunca nomes tirados dos apps.
