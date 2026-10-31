# Roadmap

## Pacote

- Escolher o nome definitivo do pacote, hoje `ui`.
- Renomear a pasta `gallery`, provavelmente para `docs`.
- O espaço livre no topo das gavetas que sobem de baixo no celular está fora da escala (`src/modal.tsx`).
- A modal e a detecção de toque acessam a janela assim que o arquivo carrega, o que quebra a renderização no servidor que o Loremy usa.
- Ideia: configurar o tema do app num bloco no CSS (`@plugin`), com só as chaves que o projeto pode mudar, como a cor principal.
- A modal escuta o voltar do navegador assim que o arquivo carrega e empurra uma entrada de histórico por janela aberta (`src/modal.tsx`), o que ainda não foi testado contra um roteador que não seja o do Inertia, como o do Salalas.
- Nome acessível: os `aria-label` foram removidos de todo o pacote, então botões só de ícone, setas, fechar e carregando não têm nome para leitor de tela. A proposta em discussão é o `Button` ter `label` obrigatório (lido pelo leitor de tela, mostrado como texto quando não há filho), `icon` para ícone com texto e `square` para só ícone, e os demais componentes seguirem a mesma ideia.

## Adoção pelo Salalas

O Salalas vai adotar o pacote. O que já está decidido para a troca:

- O emoji do jogo entra como conteúdo do botão e do título da seção, que aceitam qualquer coisa, no tamanho da escala de ícone. Não há prop de emoji nem escala de texto só para ele.
- A coluna de 32 rem do app é o `max-w-lg` do Tailwind, no shell da tela, que é do app.
- O botão de linha cheia recebe `w-full` em cada uso, e os dezenove nomes de leitor de tela do app viram `aria-label`, que o botão já repassa.
- Pergunta grande e placar do jogo continuam no app: são tipografia de produto, e nenhum outro app tem.

O que falta decidir:

- O app tem dez botões que marcam escolha por `aria-pressed`. Pelos padrões, escolha entre opções é `ButtonGroup`, o que deixa o escolhido invertido em vez de realçado.
- O tema do app é um atributo no `html` e o do pacote é a classe `dark`, com CSS do logo preso no atributo. Nada disso o TypeScript aponta: o app simplesmente nasce claro.

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
