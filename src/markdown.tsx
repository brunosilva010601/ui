import { Circle, CircleCheck } from 'lucide-react';
import type { Root, RootContent } from 'mdast';
import { createContext, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components, ExtraProps } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { buttonClass } from './button';
import { CodeBlock } from './code-block';
import { cn } from './lib/utils';

function blankLine(): RootContent {
    return {
        type: 'paragraph',
        children: [],
        data: { hName: 'div', hProperties: { className: ['h-lh'] } },
    };
}

function keepBlankLines() {
    return (tree: Root) => {
        tree.children = tree.children.flatMap((node, index) => {
            const end = tree.children[index - 1]?.position?.end.line;
            const start = node.position?.start.line;
            const extra =
                end === undefined || start === undefined ? 0 : start - end - 2;

            return [...Array.from({ length: extra }, blankLine), node];
        });
    };
}

type Toggle = ((line: number) => void) | undefined;

const TaskToggle = createContext<Toggle>(undefined);

type Node = ExtraProps['node'];

function boxOf(node: Node): boolean | null {
    for (const child of node?.children ?? []) {
        if (child.type !== 'element') {
            continue;
        }

        if (child.tagName === 'input') {
            return child.properties.checked === true;
        }

        if (child.tagName === 'p') {
            return boxOf(child);
        }
    }

    return null;
}

function TaskBox(props: { done: boolean; line: number | undefined }) {
    const toggle = useContext(TaskToggle);
    const Icon = props.done ? CircleCheck : Circle;
    const icon = (
        <Icon
            className={cn(
                'size-5',
                props.done ? 'text-primary-text' : 'text-foreground-muted',
            )}
        />
    );

    if (!toggle || props.line === undefined) {
        return <span className="flex h-lh shrink-0 items-center">{icon}</span>;
    }

    const line = props.line;

    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={props.done}
            className="flex h-lh shrink-0 cursor-pointer items-center"
            onClick={() => toggle(line)}
        >
            {icon}
        </button>
    );
}

const components: Components = {
    h1: (props) => <h2 className="text-lg font-bold">{props.children}</h2>,
    h2: (props) => <h3 className="text-base font-bold">{props.children}</h3>,
    h3: (props) => <h4 className="text-sm font-bold">{props.children}</h4>,
    p: (props) => <p>{props.children}</p>,
    ul: (props) => (
        <ul
            className={cn(
                'flex flex-col gap-1',
                props.className?.includes('contains-task-list')
                    ? 'list-none'
                    : 'list-disc ps-5',
            )}
        >
            {props.children}
        </ul>
    ),
    li: (props) => {
        const done = boxOf(props.node);

        if (done === null) {
            return <li>{props.children}</li>;
        }

        return (
            <li className="flex items-start gap-2">
                <TaskBox done={done} line={props.node?.position?.start.line} />
                <div
                    className={cn(
                        'flex min-w-0 flex-1 flex-col gap-1',
                        done && 'text-foreground-muted line-through',
                    )}
                >
                    {props.children}
                </div>
            </li>
        );
    },
    input: () => null,
    ol: (props) => (
        <ol className="flex list-decimal flex-col gap-1 ps-5">
            {props.children}
        </ol>
    ),
    strong: (props) => <strong className="font-bold">{props.children}</strong>,
    a: (props) => (
        <a
            href={props.href}
            target="_blank"
            rel="noreferrer"
            className={buttonClass({ variant: 'link' })}
        >
            {props.children}
        </a>
    ),
    blockquote: (props) => (
        <blockquote className="border-s-2 border-border ps-3 text-foreground-soft">
            {props.children}
        </blockquote>
    ),
    code: (props) => (
        <code className="rounded bg-surface-raised px-1">{props.children}</code>
    ),
    pre: (props) => {
        const code = props.node?.children[0];

        if (code?.type !== 'element' || code.tagName !== 'code') {
            return <pre>{props.children}</pre>;
        }

        const classes = code.properties.className;
        const language = Array.isArray(classes)
            ? classes
                  .map(String)
                  .find((name) => name.startsWith('language-'))
                  ?.slice('language-'.length)
            : undefined;
        const text = code.children
            .map((child) => (child.type === 'text' ? child.value : ''))
            .join('')
            .replace(/\n$/, '');

        return <CodeBlock code={text} language={language} />;
    },
    hr: () => <hr className="border-border" />,
    table: (props) => (
        <div className="overflow-x-auto rounded border border-border [overflow-wrap:normal]">
            <table className="min-w-full text-left">{props.children}</table>
        </div>
    ),
    th: (props) => (
        <th className="border-b border-border bg-surface px-3 py-2 font-semibold whitespace-nowrap">
            {props.children}
        </th>
    ),
    td: (props) => (
        <td className="border-t border-border px-3 py-2 whitespace-nowrap">
            {props.children}
        </td>
    ),
};

const sizes = {
    sm: 'text-sm',
    md: 'text-base',
};

type Props = {
    size?: keyof typeof sizes;
    onToggle?: (line: number) => void;
    children: string;
};

export function Markdown(props: Props) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 [overflow-wrap:anywhere] select-text',
                sizes[props.size ?? 'sm'],
            )}
        >
            <TaskToggle value={props.onToggle}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks, keepBlankLines]}
                    components={components}
                >
                    {props.children}
                </ReactMarkdown>
            </TaskToggle>
        </div>
    );
}
