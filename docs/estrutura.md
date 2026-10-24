# Estrutura

## Pastas

- `theme.css`: entrada do tema. Junta os arquivos de `css/` e registra `src/` para o Tailwind gerar as classes dos componentes.
- `css/`: escalas e tamanhos (`tokens.css`), cores do claro e do escuro (`palettes.css`), animações, fonte e estilos base.
- `src/`: os componentes, todos exportados por `src/index.ts`.
- `gallery/`: página de consulta do tema e dos componentes. Não vai para os apps.

O pacote é publicado como código TypeScript, sem etapa de build, com duas entradas: `ui` (componentes) e `ui/theme.css` (tema).

## Instalar

O pacote vive no repositório privado `brunosilva010601/ui`, e cada versão é uma tag do git. O app aponta para uma tag no `package.json` e sobe de versão trocando a tag:

```json
"ui": "github:brunosilva010601/ui#v0.1.0"
```

Durante ajustes, o app pode usar a pasta local com `bun link`, e as mudanças no pacote aparecem na hora. Como o repositório é privado, o ambiente de deploy de cada app precisa de acesso a ele (chave ou token do GitHub).

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
