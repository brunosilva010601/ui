import type { JSONContent } from '@tiptap/react';
import type {
    Definition,
    List,
    ListItem,
    PhrasingContent,
    Root,
    RootContent,
    Table,
} from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

type Mark = NonNullable<JSONContent['marks']>[number];

type Inline = JSONContent | 'line';

type Block = RootContent;

const parser = unified().use(remarkParse).use(remarkGfm);

const HEADING_LEVELS = 3;

const INDENT = '    ';

const FENCE = '```';

const LINE_BREAK = /\r?\n/;

function text(value: string, marks: Mark[]): JSONContent {
    return marks.length > 0
        ? { type: 'text', text: value, marks }
        : { type: 'text', text: value };
}

function inlineOf(
    nodes: PhrasingContent[],
    links: Map<string, string>,
    marks: Mark[] = [],
): Inline[] {
    return nodes.flatMap((node): Inline[] => {
        switch (node.type) {
            case 'text':
            case 'html':
                return node.value
                    .split(LINE_BREAK)
                    .flatMap((part, index): Inline[] => [
                        ...(index > 0 ? (['line'] as const) : []),
                        ...(part === '' ? [] : [text(part, marks)]),
                    ]);
            case 'break':
                return ['line'];
            case 'inlineCode':
                return [text(node.value, [...marks, { type: 'code' }])];
            case 'strong':
                return inlineOf(node.children, links, [
                    ...marks,
                    { type: 'bold' },
                ]);
            case 'emphasis':
                return inlineOf(node.children, links, [
                    ...marks,
                    { type: 'italic' },
                ]);
            case 'delete':
                return inlineOf(node.children, links, [
                    ...marks,
                    { type: 'strike' },
                ]);
            case 'link':
                return inlineOf(node.children, links, [
                    ...marks,
                    { type: 'link', attrs: { href: node.url } },
                ]);
            case 'linkReference': {
                const href = links.get(node.identifier);

                return inlineOf(
                    node.children,
                    links,
                    href
                        ? [...marks, { type: 'link', attrs: { href } }]
                        : marks,
                );
            }
            case 'image':
                return [
                    text(node.alt || node.url, [
                        ...marks,
                        { type: 'link', attrs: { href: node.url } },
                    ]),
                ];
            default:
                return [];
        }
    });
}

function lines(inline: Inline[]): JSONContent[][] {
    return inline.reduce<JSONContent[][]>(
        (all, node) => {
            if (node === 'line') {
                return [...all, []];
            }

            all[all.length - 1].push(node);

            return all;
        },
        [[]],
    );
}

function joined(inline: Inline[]): JSONContent[] {
    return inline.map((node) =>
        node === 'line' ? { type: 'text', text: ' ' } : node,
    );
}

function paragraph(content: JSONContent[]): JSONContent {
    return content.length > 0
        ? { type: 'paragraph', content }
        : { type: 'paragraph' };
}

function listItems(list: List, links: Map<string, string>): JSONContent[] {
    const groups: { task: boolean; items: ListItem[] }[] = [];

    for (const item of list.children) {
        const task = typeof item.checked === 'boolean';
        const last = groups.at(-1);

        if (last && last.task === task) {
            last.items.push(item);
        } else {
            groups.push({ task, items: [item] });
        }
    }

    return groups.map((group) => {
        const items = group.items.map((item) => {
            const content = blocksOf(item.children, links);

            if (content[0]?.type !== 'paragraph') {
                content.unshift(paragraph([]));
            }

            return group.task
                ? {
                      type: 'taskItem',
                      attrs: { checked: item.checked === true },
                      content,
                  }
                : { type: 'listItem', content };
        });

        if (group.task) {
            return { type: 'taskList', content: items };
        }

        return list.ordered
            ? {
                  type: 'orderedList',
                  attrs: { start: list.start ?? 1 },
                  content: items,
              }
            : { type: 'bulletList', content: items };
    });
}

function tableOf(table: Table, links: Map<string, string>): JSONContent {
    return {
        type: 'table',
        content: table.children.map((row, index) => ({
            type: 'tableRow',
            content: row.children.map((cell) => ({
                type: index === 0 ? 'tableHeader' : 'tableCell',
                content: [paragraph(joined(inlineOf(cell.children, links)))],
            })),
        })),
    };
}

function blockOf(node: Block, links: Map<string, string>): JSONContent[] {
    switch (node.type) {
        case 'paragraph':
            return lines(inlineOf(node.children, links)).map(paragraph);
        case 'heading':
            return [
                {
                    type: 'heading',
                    attrs: { level: Math.min(node.depth, HEADING_LEVELS) },
                    content: joined(inlineOf(node.children, links)),
                },
            ];
        case 'list':
            return listItems(node, links);
        case 'blockquote': {
            const content = blocksOf(node.children, links);

            return [
                {
                    type: 'blockquote',
                    content: content.length > 0 ? content : [paragraph([])],
                },
            ];
        }
        case 'code':
            return [
                {
                    type: 'codeBlock',
                    attrs: { language: node.lang ?? null },
                    content:
                        node.value === ''
                            ? undefined
                            : [{ type: 'text', text: node.value }],
                },
            ];
        case 'thematicBreak':
            return [{ type: 'horizontalRule' }];
        case 'table':
            return [tableOf(node, links)];
        case 'html':
            return node.value
                .split(LINE_BREAK)
                .map((line) => paragraph(line === '' ? [] : [text(line, [])]));
        default:
            return [];
    }
}

function blankLinesBetween(previous: Block, next: Block): number {
    const end = previous.position?.end.line;
    const start = next.position?.start.line;

    return end === undefined || start === undefined ? 1 : start - end - 1;
}

function blocksOf(nodes: Block[], links: Map<string, string>): JSONContent[] {
    const shown = nodes.filter((node) => node.type !== 'definition');

    return shown.flatMap((node, index) => {
        const previous = shown[index - 1];
        const blank = previous ? blankLinesBetween(previous, node) : 0;
        const spaced =
            previous?.type === 'paragraph' && node.type === 'paragraph'
                ? blank
                : Math.max(0, blank - 1);

        return [
            ...Array.from({ length: spaced }, () => paragraph([])),
            ...blockOf(node, links),
        ];
    });
}

function definitions(tree: Root): Map<string, string> {
    return new Map(
        tree.children
            .filter((node): node is Definition => node.type === 'definition')
            .map((node) => [node.identifier, node.url]),
    );
}

export function markdownToDoc(markdown: string): JSONContent {
    const tree = parser.parse(markdown);
    const content = blocksOf(tree.children, definitions(tree));

    return {
        type: 'doc',
        content: content.length > 0 ? content : [paragraph([])],
    };
}

const MARK_ORDER = ['link', 'bold', 'italic', 'strike', 'code'] as const;

type MarkName = (typeof MARK_ORDER)[number];

const WRAPS: Record<Exclude<MarkName, 'link' | 'code'>, string> = {
    bold: '**',
    italic: '*',
    strike: '~~',
};

const AUTOLINK = /^(https?:\/\/|www\.)\S+$/;

function markKey(node: JSONContent, name: MarkName): string | null {
    const mark = node.marks?.find((each) => each.type === name);

    if (!mark) {
        return null;
    }

    return name === 'link' ? String(mark.attrs?.href ?? '') : name;
}

function escapeText(value: string): string {
    return value
        .replace(/[\\`*]/g, '\\$&')
        .replace(/~~/g, '\\~\\~')
        .replace(/\](?=\()/g, '\\]')
        .replace(/<(?=[a-zA-Z/!?])/g, '\\<')
        .replace(/(^|[^\p{L}\p{N}])_|_(?=[^\p{L}\p{N}]|$)/gu, (match) =>
            match.replace('_', '\\_'),
        );
}

function codeSpan(value: string): string {
    const longest = Math.max(
        0,
        ...(value.match(/`+/g) ?? []).map((run) => run.length),
    );
    const fence = '`'.repeat(longest + 1);
    const padded = longest > 0 ? ` ${value} ` : value;

    return `${fence}${padded}${fence}`;
}

function wrapped(inner: string, open: string, close: string): string {
    const parts = /^(\s*)([\s\S]*?)(\s*)$/.exec(inner);

    if (!parts || parts[2] === '') {
        return inner;
    }

    return `${parts[1]}${open}${parts[2]}${close}${parts[3]}`;
}

function inlineMarkdown(nodes: JSONContent[], level = 0): string {
    if (level === MARK_ORDER.length) {
        return nodes.map((node) => escapeText(node.text ?? '')).join('');
    }

    const name = MARK_ORDER[level];
    const groups: { key: string | null; nodes: JSONContent[] }[] = [];

    for (const node of nodes) {
        const key = markKey(node, name);
        const last = groups.at(-1);

        if (last && last.key === key) {
            last.nodes.push(node);
        } else {
            groups.push({ key, nodes: [node] });
        }
    }

    return groups
        .map((group) => {
            if (group.key === null) {
                return inlineMarkdown(group.nodes, level + 1);
            }

            if (name === 'code') {
                return codeSpan(group.nodes.map((node) => node.text).join(''));
            }

            const inner = inlineMarkdown(group.nodes, level + 1);

            if (name === 'link') {
                const plain = group.nodes.map((node) => node.text).join('');

                return plain === group.key && AUTOLINK.test(plain)
                    ? plain
                    : wrapped(inner, '[', `](${group.key})`);
            }

            return wrapped(inner, WRAPS[name], WRAPS[name]);
        })
        .join('');
}

const LINE_START =
    /^(#{1,6}(?=\s|$)|>|[-+*](?=\s|$)|\d+(?=[.)](\s|$))|[=-]+\s*$|`{3,}|~{3,})/;

function oneLine(nodes: JSONContent[]): string {
    const line = inlineMarkdown(nodes).replace(/^\s+/, '');
    const start = LINE_START.exec(line);

    if (!start) {
        return line;
    }

    return /^\d/.test(start[0])
        ? `${start[0]}\\${line.slice(start[0].length)}`
        : `\\${line}`;
}

function lineMarkdown(nodes: JSONContent[] = []): string {
    return nodes
        .reduce<JSONContent[][]>(
            (all, node) => {
                if (node.type === 'hardBreak') {
                    return [...all, []];
                }

                all[all.length - 1].push(node);

                return all;
            },
            [[]],
        )
        .map(oneLine)
        .join('\n');
}

function flat(nodes: JSONContent[] = []): JSONContent[] {
    return nodes.map((node) =>
        node.type === 'hardBreak' ? { type: 'text', text: ' ' } : node,
    );
}

function indented(markdown: string, first: string, rest: string): string {
    return markdown
        .split('\n')
        .map((line, index) =>
            line === '' ? line : `${index === 0 ? first : rest}${line}`,
        )
        .join('\n');
}

function listFamily(node: JSONContent): 'bullet' | 'ordered' | null {
    if (node.type === 'bulletList' || node.type === 'taskList') {
        return 'bullet';
    }

    return node.type === 'orderedList' ? 'ordered' : null;
}

function itemMarkdown(item: JSONContent): string {
    const [first, ...rest] = item.content ?? [];
    const head = first?.type === 'paragraph' ? lineMarkdown(first.content) : '';
    const tail = (first?.type === 'paragraph' ? rest : (item.content ?? []))
        .filter(
            (child) =>
                child.type !== 'paragraph' || (child.content ?? []).length,
        )
        .map((child, index, all) => {
            const previous = all[index - 1];
            const markdown = blocksMarkdown([child]);
            const loose =
                child.type === 'paragraph' &&
                previous !== undefined &&
                previous.type !== 'paragraph';

            return `${loose ? '\n' : ''}${markdown}`;
        });

    return [head, ...tail].join('\n');
}

function listMarkdown(list: JSONContent, alternate: boolean): string {
    const start = Number(list.attrs?.start ?? 1);

    return (list.content ?? [])
        .map((item, index) => {
            const marker =
                list.type === 'orderedList'
                    ? `${start + index}${alternate ? ')' : '.'} `
                    : `${alternate ? '*' : '-'} ${
                          list.type === 'taskList'
                              ? `[${item.attrs?.checked ? 'x' : ' '}] `
                              : ''
                      }`;

            return indented(itemMarkdown(item), marker, INDENT);
        })
        .join('\n');
}

function cellMarkdown(cell: JSONContent): string {
    return (cell.content ?? [])
        .map((child) => inlineMarkdown(flat(child.content)))
        .join(' ')
        .replace(/\|/g, '\\|')
        .trim();
}

function tableMarkdown(table: JSONContent): string {
    const rows = (table.content ?? []).map((row) =>
        (row.content ?? []).map(cellMarkdown),
    );
    const width = Math.max(1, ...rows.map((row) => row.length));
    const line = (cells: string[]) =>
        `| ${Array.from({ length: width }, (_, index) => cells[index] ?? '').join(' | ')} |`;
    const [header = [], ...body] = rows;

    return [
        line(header),
        line(Array.from({ length: width }, () => '---')),
        ...body.map(line),
    ].join('\n');
}

function codeMarkdown(block: JSONContent): string {
    const code = (block.content ?? []).map((node) => node.text).join('');
    const longest = Math.max(
        0,
        ...(code.match(/^`{3,}/gm) ?? []).map((run) => run.length),
    );
    const fence = longest >= FENCE.length ? '`'.repeat(longest + 1) : FENCE;

    return `${fence}${block.attrs?.language ?? ''}\n${code}\n${fence}`;
}

function blockMarkdown(node: JSONContent, alternate: boolean): string {
    switch (node.type) {
        case 'paragraph':
            return lineMarkdown(node.content);
        case 'heading':
            return `${'#'.repeat(Number(node.attrs?.level ?? 1))} ${inlineMarkdown(flat(node.content))}`.trimEnd();
        case 'bulletList':
        case 'orderedList':
        case 'taskList':
            return listMarkdown(node, alternate);
        case 'blockquote':
            return blocksMarkdown(node.content ?? [])
                .split('\n')
                .map((line) => (line === '' ? '>' : `> ${line}`))
                .join('\n');
        case 'codeBlock':
            return codeMarkdown(node);
        case 'horizontalRule':
            return '---';
        case 'table':
            return tableMarkdown(node);
        default:
            return '';
    }
}

function empty(node: JSONContent): boolean {
    return node.type === 'paragraph' && (node.content ?? []).length === 0;
}

function blocksMarkdown(nodes: JSONContent[]): string {
    let markdown = '';
    let previous: JSONContent | null = null;
    let blank = 0;
    let alternate = false;

    for (const node of nodes) {
        if (empty(node)) {
            blank++;

            continue;
        }

        if (previous) {
            const plain =
                previous.type === 'paragraph' && node.type === 'paragraph';
            const family = listFamily(node);

            alternate =
                family !== null && family === listFamily(previous)
                    ? !alternate
                    : false;
            markdown += '\n'.repeat(blank + (plain ? 1 : 2));
        }

        markdown += blockMarkdown(node, alternate);
        previous = node;
        blank = 0;
    }

    return markdown;
}

export function docToMarkdown(doc: JSONContent): string {
    return blocksMarkdown(doc.content ?? []);
}
