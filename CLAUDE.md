# ui

Pacote de tema e componentes React usado pelos apps do Bruno (Mylo, Loremy, Salalas e os próximos).
Dá a todos a mesma aparência e é o lugar único onde a interface evolui.

Stack: React 19, Tailwind CSS 4, TypeScript, Radix e bun; a galeria de consulta roda com Vite (`bun run dev`) e tem a interface em inglês.

## Docs

- `docs/ideia.md`: para que o pacote existe, o que ele não é e quando os apps o adotam.
- `docs/estrutura.md`: pastas, como um app instala e liga o pacote, e como a galeria funciona.
- `docs/padroes.md`: regras de tema, espaçamento e componentes.
- `docs/roadmap.md`: o que está em aberto.

## Manutenção

- Consultar `docs/` antes de decidir ou criar componente.
- Atualizar o arquivo afetado na mesma mudança: ligação com os apps em `estrutura.md`, regra de tema ou componente em `padroes.md`.
- Componente novo ou variação nova entra também na galeria.
- Item concluído sai do `roadmap.md`. Ideia nova entra nele.
