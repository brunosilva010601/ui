# Roadmap

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
- Pergunta grande e placar do jogo continuam no app: são tipografia de produto, e nenhum outro app tem.
- `ButtonGroup` ficou para escolha entre opções (tema, som, vibração, opções do jogo). Os botões de jogada que marcam a escolha feita, como "Duvido" ou "Verdade", continuam `Button` com `aria-pressed`: a cor ali é o significado da jogada, e inverter o escolhido apagaria isso.
- O menu da sala e o do jogador viram modal `sheet` com botões de linha cheia, sem o botão "Voltar" que o fechar já faz.
- O app instala o pacote por caminho local (`file:../ui`), e `vite.config.ts` e `tsconfig.app.json` apontam `react`, `react-dom` e `lucide-react` para a cópia do app, senão os tipos do pacote e os do app não se reconhecem. O mesmo `vite.config.ts` libera a pasta do pacote em `server.fs.allow`, senão as fontes não carregam no servidor de desenvolvimento.

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
