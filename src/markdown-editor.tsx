import { lazy, Suspense } from 'react';
import type { ReactNode, Ref } from 'react';
import { cn } from './lib/utils';
import { Markdown } from './markdown';

export type MarkdownCommand =
    | 'bold'
    | 'italic'
    | 'strike'
    | 'code'
    | 'link'
    | 'heading'
    | 'task'
    | 'bullet'
    | 'numbered'
    | 'outdent'
    | 'indent'
    | 'quote'
    | 'codeBlock'
    | 'divider'
    | 'undo'
    | 'redo';

export type MarkdownEditorHandle = {
    run: (command: MarkdownCommand) => void;
    setLink: (href: string | null) => void;
    focus: () => void;
    blur: () => void;
};

export type MarkdownMenuItem = {
    command: MarkdownCommand;
    label: string;
    icon?: ReactNode;
};

export type MarkdownMenu = {
    label: string;
    items: MarkdownMenuItem[];
};

export const editorSizes = {
    sm: 'text-sm',
    md: 'text-base',
};

export type MarkdownEditorProps = {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    size?: keyof typeof editorSizes;
    menu?: MarkdownMenu;
    onToggle?: (task: number) => void;
    onLink?: (current: string | null) => void;
    onFocusChange?: (focused: boolean) => void;
    ref?: Ref<MarkdownEditorHandle>;
};

type Keys = { key: string; shift?: boolean; alt?: boolean };

const keys: Record<MarkdownCommand, Keys> = {
    bold: { key: 'B' },
    italic: { key: 'I' },
    strike: { key: 'S', shift: true },
    code: { key: 'E' },
    link: { key: 'L' },
    heading: { key: '2', alt: true },
    task: { key: '9', shift: true },
    bullet: { key: '8', shift: true },
    numbered: { key: '7', shift: true },
    outdent: { key: '[' },
    indent: { key: ']' },
    quote: { key: 'B', shift: true },
    codeBlock: { key: 'C', alt: true },
    divider: { key: '-', alt: true },
    undo: { key: 'Z' },
    redo: { key: 'Z', shift: true },
};

function apple(): boolean {
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function markdownShortcut(command: MarkdownCommand): string {
    const each = keys[command];

    if (apple()) {
        return `${each.alt ? '⌥' : ''}${each.shift ? '⇧' : ''}⌘${each.key}`;
    }

    return ['Ctrl', each.alt && 'Alt', each.shift && 'Shift', each.key]
        .filter(Boolean)
        .join('+');
}

export function EditorFallback(
    props: Pick<MarkdownEditorProps, 'value' | 'placeholder' | 'size'>,
) {
    return props.value ? (
        <Markdown size={props.size}>{props.value}</Markdown>
    ) : (
        <p
            className={cn(
                'text-foreground-muted',
                editorSizes[props.size ?? 'sm'],
            )}
        >
            {props.placeholder}
        </p>
    );
}

const EditorView = lazy(() => import('./markdown-editor-view'));

export function MarkdownEditor(props: MarkdownEditorProps) {
    return (
        <Suspense fallback={<EditorFallback {...props} />}>
            <EditorView {...props} />
        </Suspense>
    );
}
