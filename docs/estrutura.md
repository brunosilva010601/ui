# Estrutura

## Pastas

- `theme.css`: entrada do tema. Junta os arquivos de `css/` e registra `src/` para o Tailwind gerar as classes dos componentes.
- `css/`: escalas e tamanhos (`tokens.css`), cores do claro e do escuro (`palettes.css`), animações, fonte e estilos base. Em `css/fonts/` ficam os arquivos da Noto Color Emoji, copiados do que o Google Fonts serve, porque a versão do `@fontsource` carrega e não desenha nada: o texto some e o espaço fica. A Outfit continua vindo do `@fontsource`.
- `src/`: os componentes. `src/index.ts` lista o que é público. `Section` e `Modal` são divididas em arquivos pelo assunto: histórico do navegador, gestos e formatos (`modal-*`), faixa recolhível e estado aberto (`section-*`).
- `lint/`: regras de lint que conferem nos apps o uso do tema e dos componentes (`index.js`) e a configuração que liga todas elas (`oxlintrc.json`). É JavaScript, e não TypeScript, porque o Node não tira os tipos de arquivos dentro de `node_modules`.
- `gallery/`: página de consulta do tema e dos componentes. Não vai para os apps.

O pacote se chama `@brunosilva010601/ui` e vai como código TypeScript, sem etapa de build, com quatro entradas: `@brunosilva010601/ui` (componentes), `@brunosilva010601/ui/theme.css` (tema), `@brunosilva010601/ui/lint` (regras de lint) e `@brunosilva010601/ui/lint/oxlintrc.json` (a configuração que liga todas as regras).

## Publicar

O repositório `brunosilva010601/ui` é público, e os apps instalam direto dele, sem registro nem token. Para uma versão nova: subir o número em `package.json`, fazer o commit, criar a tag `vX.Y.Z` nesse commit e enviar a tag ao GitHub.

## Instalar

O pacote entra no `package.json` do app apontando para a tag:

```json
"@brunosilva010601/ui": "github:brunosilva010601/ui#v0.12.1"
```

A tag `v0.1.0` aponta para um commit de antes do nome atual e não serve para instalar.

## Atualizar

1. Ler o que mudou entre a tag atual do app e a nova (`git log` e `git diff` entre as duas tags neste repositório) e as docs na tag nova.
2. Trocar a tag no `package.json` do app e instalar.
3. Rodar o lint, com as regras do pacote ligadas como em "Ligar num app", e os tipos, e corrigir tudo antes de publicar o app. Classe que o tema deixou de gerar não dá erro no build, o elemento só perde o estilo, então o lint é o único aviso.

Versões que quebram o app:

- 0.8.0: saíram os nomes em pixels (`gap-8px`, `text-12px`, `size-icon-16px`), o multiplicador de espaçamento, os tamanhos de texto, as alturas de linha e as cores do Tailwind fora da escala do tema, como descreve `padroes.md`.
- 0.8.1: o `Modal` passou a exigir `mobile`.
- 0.9.0: o `className` do `PageBottom` passou a ir na barra, dentro da caixa fixa, e o botão flutuante entra pelo `floating`. O `UiLabels` ganhou sete textos, que um objeto completo do app precisa ter. O lint passou a acusar o tamanho de ícone pelo `className` do botão.

Durante ajustes, o app pode usar a pasta local com `bun link`, e as mudanças no pacote aparecem na hora. Nesse modo o servidor do Vite serve os arquivos pelo caminho real da pasta, fora do projeto, e recusa tudo que está fora da raiz dele: sem liberar essa pasta em `server.fs.allow`, as fontes não carregam e o emoji sai em branco ou com o desenho do aparelho. Instalado pela tag, nada disso é preciso.

## Adotar num app

1. Instalar o pacote como descrito em "Instalar".
2. Ligar o pacote no código, como descrito abaixo, mantendo a cor principal atual do app.
3. Trocar os componentes de interface do app pelos do pacote, um por um, apagando a cópia local de cada um. O TypeScript e o lint apontam o que mudou, e `roadmap.md` registra o que cada adoção decidiu e o que ficou pendente.
4. Componentes do produto, que não são interface genérica, continuam no app, montados em cima dos do pacote.
5. Registrar nas docs do app o que foi trocado e o que ficou pendente.

Regras da adoção:

- Problema ou falta no pacote se corrige no próprio pacote, nunca com sobrescrita no app.
- Nada de regra de negócio ou tela muda além do necessário para a troca.

## Ligar num app

1. No CSS do app, importar o Tailwind e depois `@brunosilva010601/ui/theme.css`, e remover os arquivos de tema próprios que ele substitui (tokens, paletas, animações, fonte) e a fonte de emoji carregada pelo app, porque o pacote já traz a Noto Color Emoji. Em seguida, sobrescrever as variáveis da cor principal no claro (`:root, .light`) e no escuro (`.dark`): `--color-primary`, `--color-primary-text` e `--color-primary-foreground`. O `--color-primary-hover` e o `--color-focus` saem delas sozinhos. As cores do Tailwind continuam disponíveis como variáveis para isso (`var(--color-blue-600)`), sem virar classe.
2. O modo escuro é a classe `dark` no `html`.
3. A margem lateral é `--gutter`, de 16 px, igual em todos os apps, e o app não a muda. É o que o `Container` com `padded` aplica, o que a modal usa de recuo, o que a seção usa para sangrar o cabeçalho clicável e o recuo que uma faixa ou lista com `bleed` devolve.
4. Envolver o app com `UiProvider`, que recebe o componente de link do roteador, os textos internos, o idioma, o início da semana, o aviso de saída de página (`onLeave`) e o aviso de fim de navegação (`onSettle`). Sem ele, tudo funciona com textos em português e links comuns.
5. Montar o `Toaster` uma vez na raiz, passando claro ou escuro. Mensagens vindas do servidor ficam no app, chamando `notify`. O aviso sobe sozinho acima de um `PageBottom` ou `PageFooter` montado, que declaram a altura em `--page-bottom`.
6. A escolha entre claro, escuro e sistema usa o `AppearancePicker`, mas guardar a escolha e aplicar a classe `dark` ficam no app.
7. Na configuração do oxlint, estender a do pacote, para cada versão nova trazer as regras atualizadas sem mexer no app. A do pacote declara `plugins` vazio, porque sem isso o oxlint soma os plugins padrão dele (`unicorn`, `typescript`, `oxc`) aos que o app escolheu: os plugins nativos são só do app. As regras de fora no oxlint ainda estão em alfa, então uma versão nova dele pode pedir ajuste nelas.
8. O histórico das modais não pede ligação com nenhum roteador. Com uma modal, menu ou popover aberto, o pacote troca a entrada que ele empurrou pela navegação seguinte (`pushState` vira `replaceState`), então navegar de dentro da janela não deixa entrada sobrando e o voltar sai da página em vez de reabrir a janela.

No `.oxlintrc.json`:

```json
"extends": ["./node_modules/@brunosilva010601/ui/lint/oxlintrc.json"]
```

No bloco `lint` do `vite.config.ts` (Vite+):

```ts
import ui from '@brunosilva010601/ui/lint/oxlintrc.json' with { type: 'json' };

lint: { extends: [ui], ... }
```

No Inertia, a ligação com o roteador fica assim:

```tsx
<UiProvider
    link={Link}
    onLeave={(leave) =>
        router.on('start', (event) => {
            if (!event.detail.visit.only.length && !event.detail.visit.async) {
                leave();
            }
        })
    }
    onSettle={(settle) => router.on('finish', settle)}
>
```

Num roteador sem aviso de fim de navegação, como o react-router, `onSettle` fica no padrão: o `ConfirmDialog` que não recebe Promise fica ocupado até a janela fechar.

O `router.on('before')` com `visitReplacesModalEntry`, que o Mylo e o Loremy ainda têm, ficou desnecessário e não atrapalha: o Inertia passa a trocar a entrada ele mesmo, e a função continua exportada até os dois apagarem a ligação.

## Galeria

`bun run dev` abre a galeria, com as páginas Theme e Components. Ela usa só componentes do pacote: cada grupo, componente e exemplo é uma `Section`.

Em `vite.config.ts`, um passo de montagem lê `gallery/components-page.tsx` e acrescenta ao fim de toda `Section` com `meta` uma seção "Code" com o trecho exato daquele exemplo. Os trechos nunca são escritos à mão.
