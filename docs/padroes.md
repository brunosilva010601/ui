# Padrões

## Tema

- Cor sempre pelo papel (`primary`, `surface`, `foreground-muted`), nunca por uma cor fixa do Tailwind. A exceção é a paleta de cores que o usuário escolhe para itens (`src/palette.ts`).
- Padding, gap e margem sempre pela escala com nome de `css/tokens.css`. Número só para o que não é espaçamento, como alturas, larguras e as margens negativas de sangria.
- O recuo de linha (`--row-inset`) é o mesmo padding das seções outlined. É isso que faz uma lista com `bleed` encostar na borda do card.
- A linha de texto tem a altura exata da fonte: a métrica da Outfit é ajustada para somar 100% (`css/fonts.css`) e todo elemento corta o espaço extra da primeira e da última linha (`text-box` em `css/base.css`). Texto em várias linhas mantém o espaçamento normal entre elas. Acentos e descendentes passam um pouco da caixa, então elementos que escondem o que transborda precisam de folga.
- O corte fica desligado em `input`, `textarea` e `select`, porque dentro deles o texto fica maior que o campo e desliza ao selecionar. Ele também não chega ao texto colocado direto dentro de um elemento flex (botão, badge, aba). Nesses controles de uma linha, a altura da linha é definida explicitamente com `leading-*`, sempre escrito depois da classe de tamanho de texto, porque o `cn` descarta o `leading` que vem antes de um `text-*`.
- A altura de um controle é a soma do padding, do tamanho da fonte e da borda. Não há altura fixa nem mínima, para o controle crescer com o conteúdo.
- Todo controle tem borda de 1 px, transparente quando não aparece, para trocar de variante nunca mudar a altura.
- Cada tamanho de controle define fonte, ícone e linha, e a linha tem a altura do ícone: assim um controle com ícone e um sem ícone têm a mesma altura. Os valores ficam em `src/button.tsx`, e os outros controles (campos, abas, linhas de menu) seguem os mesmos. Nos controles, cada tamanho tem um ícone só; os ícones maiores da escala ficam para componentes de exibição.
- Texto corrido mantém a altura de linha normal, porque é ela que separa as linhas de um parágrafo. Altura de linha 1 global deixaria o texto de várias linhas colado. Campos usam fonte 16 porque, abaixo disso, o iPhone dá zoom ao tocar no campo.

## Componentes

- Nenhum componente depende de roteador nem dos textos de um app. Link, textos, idioma e navegação chegam pelo `UiProvider` ou por props.
- Em cada tamanho, o botão de texto e o botão quadrado de ícone têm a mesma altura. Mudar o padding de um exige ajustar o outro, em geral pelo tamanho do ícone.
- Tudo que é clicável é `Button`. Escolha entre opções é um `ButtonGroup` (uma opção que troca, ou várias com `multiple`), e o botão selecionado usa a prop `selected`, que só existe no `outline` e tem o visual invertido (fundo da cor do texto), igual à aba ativa. A cor principal fica para ação, nunca para seleção. `Badge` é só etiqueta estática, nunca clicável.
- Link tem uma variante só (`variant="link"`). Sem `size`, ele herda o tamanho do texto em volta e quebra linha junto com a frase.
- A `Section` aceita uma terceira linha no cabeçalho (`meta`), em fonte de código, depois da descrição.
- Controles que se repetem com o mesmo papel (botão, campo) têm tamanhos fixos com nome. Modal, gaveta e menus têm uma largura padrão e mudam pelo `className` quando o conteúdo pede, porque cada caso tem um conteúdo diferente.
- O gesto de segurar ou clicar com o botão direito é uma peça própria (`useHold`), aplicável a qualquer elemento. O menu de linha (`HeldMenu`) é montado em cima dela.

## Galeria

- Só componentes do pacote. Nada é criado para uso exclusivo da galeria.
- Grupos são `Section` flat recolhíveis. Cada componente é uma única `Section` outlined recolhível, com descrição e as props no `meta`.
- Dentro do componente aparecem todas as combinações juntas (variantes, tamanhos, com e sem ícone, estados), sem separar em várias seções. Só se divide quando o contexto muda de verdade.
- Cada componente mostra também os casos de limite: conteúdo que passa do espaço, texto longo que quebra, ícone grande, muitos itens.
- Textos de exemplo neutros e em inglês ("Label", "Option A"), nunca nomes tirados dos apps.
