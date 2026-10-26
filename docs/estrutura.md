# Estrutura

## Pastas

- `theme.css`: entrada do tema. Junta os arquivos de `css/` e registra `src/` para o Tailwind gerar as classes dos componentes.
- `css/`: escalas e tamanhos (`tokens.css`), cores do claro e do escuro (`palettes.css`), animações, fonte e estilos base.
- `src/`: os componentes, todos exportados por `src/index.ts`.
- `gallery/`: página de consulta do tema e dos componentes. Não vai para os apps.

O pacote se chama `@brunosilva010601/ui` e vai como código TypeScript, sem etapa de build, com duas entradas: `@brunosilva010601/ui` (componentes) e `@brunosilva010601/ui/theme.css` (tema).

## Publicar

O repositório `brunosilva010601/ui` é público, e os apps instalam direto dele, sem registro nem token. Para uma versão nova: subir o número em `package.json`, fazer o commit, criar a tag `vX.Y.Z` nesse commit e enviar a tag ao GitHub.

## Instalar

O pacote entra no `package.json` do app apontando para a tag:

```json
"@brunosilva010601/ui": "github:brunosilva010601/ui#v0.4.1"
```

A tag `v0.1.0` aponta para um commit de antes do nome atual e não serve para instalar.

Durante ajustes, o app pode usar a pasta local com `bun link`, e as mudanças no pacote aparecem na hora.

## Adotar num app

1. Instalar o pacote como descrito em "Instalar".
2. Ligar o pacote no código, como descrito abaixo, mantendo a cor principal atual do app.
3. Trocar os componentes de interface do app pelos do pacote, um por um, apagando a cópia local de cada um. O TypeScript aponta o que mudou, e `roadmap.md` lista as diferenças em relação ao Mylo e ao Loremy.
4. Componentes do produto, que não são interface genérica, continuam no app, montados em cima dos do pacote.
5. Registrar nas docs do app o que foi trocado e o que ficou pendente.

Regras da adoção:

- Problema ou falta no pacote se corrige no próprio pacote, nunca com sobrescrita no app.
- App com renderização no servidor ainda não funciona com o pacote (ver `roadmap.md`).
- Nada de regra de negócio ou tela muda além do necessário para a troca.

## Ligar num app

1. No CSS do app, importar o Tailwind e depois `@brunosilva010601/ui/theme.css`, e remover os arquivos de tema próprios que ele substitui (tokens, paletas, animações, fonte). Em seguida, sobrescrever as variáveis da cor principal no claro (`:root, .light`) e no escuro (`.dark`).
2. O modo escuro é a classe `dark` no `html`.
3. Envolver o app com `UiProvider`, que recebe o componente de link do roteador, os textos internos, o idioma, o início da semana e o aviso de saída de página (`onLeave`). Sem ele, tudo funciona com textos em português e links comuns.
4. Montar o `Toaster` uma vez na raiz, passando claro ou escuro. Mensagens vindas do servidor ficam no app, chamando `notify`.
5. A escolha entre claro, escuro e sistema usa o `AppearancePicker`, mas guardar a escolha e aplicar a classe `dark` ficam no app.

No Inertia, duas ligações ficam no app:

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
>
```

```ts
router.on('before', (event) => {
    const visit = event.detail.visit;

    if (!visit.prefetch && visitReplacesModalEntry({ url: visit.url.href, method: visit.method })) {
        visit.replace = true;
    }
});
```

A segunda evita que modais abertas deixem entradas sobrando no histórico do navegador.

## Galeria

`bun run dev` abre a galeria, com as páginas Theme e Components. Ela usa só componentes do pacote: cada grupo, componente e exemplo é uma `Section`.

Em `vite.config.ts`, um passo de montagem lê `gallery/components-page.tsx` e acrescenta ao fim de toda `Section` com `meta` uma seção "Code" com o trecho exato daquele exemplo. Os trechos nunca são escritos à mão.
