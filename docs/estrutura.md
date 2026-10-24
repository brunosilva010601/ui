# Estrutura

## Pastas

- `theme.css`: entrada do tema. Junta os arquivos de `css/` e registra `src/` para o Tailwind gerar as classes dos componentes.
- `css/`: escalas e tamanhos (`tokens.css`), cores do claro e do escuro (`palettes.css`), animações, fonte e estilos base.
- `src/`: os componentes, todos exportados por `src/index.ts`.
- `gallery/`: página de consulta do tema e dos componentes. Não vai para os apps.

O pacote se chama `@brunosilva010601/ui` e é publicado como código TypeScript, sem etapa de build, com duas entradas: `@brunosilva010601/ui` (componentes) e `@brunosilva010601/ui/theme.css` (tema). Só `src/`, `css/` e `theme.css` vão no pacote publicado.

## Publicar

O pacote fica privado no GitHub Packages, ligado ao repositório `brunosilva010601/ui`. Para uma versão nova: subir o número em `package.json`, fazer o commit e rodar `bun publish`. O `.npmrc` do repositório lê o token da variável `GITHUB_PACKAGES_TOKEN`, que precisa de permissão `write:packages`.

## Instalar

Cada app tem um `.npmrc` igual ao do pacote, apontando o escopo `@brunosilva010601` para o GitHub Packages e lendo o token de `GITHUB_PACKAGES_TOKEN`. O pacote entra no `package.json` por versão:

```json
"@brunosilva010601/ui": "^0.1.0"
```

O token é um token clássico do GitHub com `read:packages`, e precisa existir em todo lugar que instala o app: no terminal local, nas variáveis de ambiente do deploy (Laravel Cloud) e nos secrets do GitHub Actions.

Durante ajustes, o app pode usar a pasta local com `bun link`, e as mudanças no pacote aparecem na hora.

## Ligar num app

1. No CSS do app, importar o Tailwind e depois o tema. Em seguida, sobrescrever as variáveis da cor principal no claro (`:root, .light`) e no escuro (`.dark`).
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
