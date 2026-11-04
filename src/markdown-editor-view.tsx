import { TableKit } from '@tiptap/extension-table';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import type { TaskItemOptions } from '@tiptap/extension-list';
import { Placeholder } from '@tiptap/extensions';
import {
    EditorContent,
    Extension,
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
    useEditor,
} from '@tiptap/react';
import type { Editor, ReactNodeViewProps } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Circle, CircleCheck } from 'lucide-react';
import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { RefObject } from 'react';
import { buttonClass } from './button';
import { docToMarkdown, markdownToDoc } from './lib/markdown-doc';
import { cn } from './lib/utils';
import { EditorFallback, editorSizes } from './markdown-editor';
import type { MarkdownCommand, MarkdownEditorProps } from './markdown-editor';

const HEADING_LEVEL = 2;

function sink(editor: Editor): boolean {
    return (
        editor.commands.sinkListItem('listItem') ||
        editor.commands.sinkListItem('taskItem')
    );
}

function lift(editor: Editor): boolean {
    return (
        editor.commands.liftListItem('listItem') ||
        editor.commands.liftListItem('taskItem')
    );
}

function run(editor: Editor, command: MarkdownCommand): void {
    const chain = editor.chain().focus();

    switch (command) {
        case 'bold':
            chain.toggleBold().run();
            break;
        case 'italic':
            chain.toggleItalic().run();
            break;
        case 'strike':
            chain.toggleStrike().run();
            break;
        case 'code':
            chain.toggleCode().run();
            break;
        case 'heading':
            chain.toggleHeading({ level: HEADING_LEVEL }).run();
            break;
        case 'task':
            chain.toggleTaskList().run();
            break;
        case 'bullet':
            chain.toggleBulletList().run();
            break;
        case 'numbered':
            chain.toggleOrderedList().run();
            break;
        case 'quote':
            chain.toggleBlockquote().run();
            break;
        case 'codeBlock':
            chain.toggleCodeBlock().run();
            break;
        case 'divider':
            chain.setHorizontalRule().run();
            break;
        case 'undo':
            chain.undo().run();
            break;
        case 'redo':
            chain.redo().run();
            break;
        case 'indent':
            chain.run();
            sink(editor);
            break;
        case 'outdent':
            chain.run();
            lift(editor);
            break;
        case 'link':
            break;
    }
}

type Toggle = RefObject<((task: number) => void) | undefined>;

function taskIndex(editor: Editor, position: number): number {
    let index = 0;

    editor.state.doc.nodesBetween(0, position, (node, at) => {
        if (node.type.name === 'taskItem' && at < position) {
            index++;
        }
    });

    return index;
}

function TaskView(props: ReactNodeViewProps) {
    const id = useId();
    const done = props.node.attrs.checked === true;
    const toggle = (props.extension.options as { toggle: Toggle }).toggle;
    const Icon = done ? CircleCheck : Circle;

    const change = () => {
        const position = props.getPos();

        if (typeof position !== 'number') {
            return;
        }

        if (toggle.current) {
            toggle.current(taskIndex(props.editor, position));

            return;
        }

        props.updateAttributes({ checked: !done });
    };

    return (
        <NodeViewWrapper className="flex items-start gap-2">
            <button
                type="button"
                role="checkbox"
                aria-checked={done}
                aria-labelledby={id}
                contentEditable={false}
                className="flex h-lh shrink-0 cursor-pointer items-center"
                onMouseDown={(event) => event.preventDefault()}
                onClick={change}
            >
                <Icon
                    className={cn(
                        'size-5',
                        done ? 'text-primary-text' : 'text-foreground-muted',
                    )}
                />
            </button>
            <NodeViewContent
                id={id}
                className={cn(
                    'min-w-0 flex-1',
                    done && 'text-foreground-muted line-through',
                )}
            />
        </NodeViewWrapper>
    );
}

function taskItem(toggle: Toggle) {
    return TaskItem.extend<TaskItemOptions & { toggle: Toggle }>({
        addOptions() {
            return { ...(this.parent?.() as TaskItemOptions), toggle };
        },
        addNodeView() {
            return ReactNodeViewRenderer(TaskView, { as: 'li' });
        },
    }).configure({ nested: true });
}

function shortcuts(onLink: RefObject<(() => void) | undefined>) {
    return Extension.create({
        name: 'markdownShortcuts',
        addKeyboardShortcuts() {
            return {
                'Mod-]': () => sink(this.editor),
                'Mod-[': () => lift(this.editor),
                'Mod-Alt--': () => this.editor.commands.setHorizontalRule(),
                'Mod-l': () => {
                    onLink.current?.();

                    return true;
                },
            };
        },
    });
}

function openLink(event: MouseEvent): boolean {
    const link = (event.target as Element).closest('a');

    if (!link) {
        return false;
    }

    event.preventDefault();

    if (event.type === 'click') {
        window.open(link.href, '_blank', 'noreferrer');
    }

    return true;
}

export default function MarkdownEditorView(props: MarkdownEditorProps) {
    const emitted = useRef(props.value);
    const toggle = useRef(props.onToggle);
    const change = useRef(props.onChange);
    const focusChange = useRef(props.onFocusChange);
    const link = useRef<(() => void) | undefined>(undefined);

    toggle.current = props.onToggle;
    change.current = props.onChange;
    focusChange.current = props.onFocusChange;

    const editor = useEditor({
        immediatelyRender: false,
        content: markdownToDoc(props.value),
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                underline: false,
                link: {
                    openOnClick: false,
                    autolink: true,
                    linkOnPaste: true,
                    HTMLAttributes: {
                        class: buttonClass({ variant: 'link' }),
                        target: '_blank',
                        rel: 'noreferrer',
                    },
                },
            }),
            TaskList,
            taskItem(toggle),
            TableKit.configure({ table: { resizable: false } }),
            Placeholder.configure({ placeholder: props.placeholder ?? '' }),
            shortcuts(link),
        ],
        editorProps: {
            attributes: {
                class: cn('ui-editor', editorSizes[props.size ?? 'sm']),
                'aria-label': props.label,
                'aria-multiline': 'true',
                role: 'textbox',
            },
            handleDOMEvents: {
                mousedown: (_, event) => openLink(event),
                click: (_, event) => openLink(event),
            },
        },
        onUpdate: ({ editor: current }) => {
            const next = docToMarkdown(current.getJSON());

            if (next !== emitted.current) {
                emitted.current = next;
                change.current(next);
            }
        },
        onFocus: () => focusChange.current?.(true),
        onBlur: () => focusChange.current?.(false),
    });

    link.current = () =>
        props.onLink?.(
            (editor?.getAttributes('link').href as string | undefined) ?? null,
        );

    useEffect(() => {
        if (!editor || props.value === emitted.current) {
            return;
        }

        const { from, to } = editor.state.selection;

        emitted.current = props.value;
        editor
            .chain()
            .setMeta('addToHistory', false)
            .setContent(markdownToDoc(props.value), { emitUpdate: false })
            .setTextSelection({ from, to })
            .run();
    }, [editor, props.value]);

    useImperativeHandle(
        props.ref,
        () => ({
            run: (command) => {
                if (!editor) {
                    return;
                }

                if (command === 'link') {
                    link.current?.();

                    return;
                }

                run(editor, command);
            },
            setLink: (href) => {
                if (!editor) {
                    return;
                }

                const chain = editor.chain().focus().extendMarkRange('link');

                if (!href) {
                    chain.unsetLink().run();
                } else if (
                    editor.state.selection.empty &&
                    !editor.isActive('link')
                ) {
                    chain
                        .insertContent({
                            type: 'text',
                            text: href,
                            marks: [{ type: 'link', attrs: { href } }],
                        })
                        .run();
                } else {
                    chain.setLink({ href }).run();
                }
            },
            focus: () => editor?.commands.focus(),
            blur: () => editor?.commands.blur(),
        }),
        [editor],
    );

    if (!editor) {
        return <EditorFallback {...props} />;
    }

    return <EditorContent editor={editor} />;
}
