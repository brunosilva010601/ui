import { TableKit } from '@tiptap/extension-table';
import { TaskList } from '@tiptap/extension-list';
import { Placeholder } from '@tiptap/extensions';
import type { ResolvedPos } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import { EditorContent, Extension, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useEffect, useImperativeHandle, useRef } from 'react';
import type { RefObject } from 'react';
import { buttonClass } from './button';
import { docToMarkdown, markdownToDoc } from './lib/markdown-doc';
import { cn } from './lib/utils';
import { EditorFallback, editorSizes } from './markdown-editor';
import type { MarkdownCommand, MarkdownEditorProps } from './markdown-editor';
import { SlashMenu, slashMenu, useSlashState } from './markdown-editor-menu';
import type { SlashListener } from './markdown-editor-menu';
import {
    listItem,
    taskAtCursor,
    taskItem,
    toggleTask,
} from './markdown-editor-nodes';
import type { Toggle } from './markdown-editor-nodes';

const HEADING_LEVEL = 2;
const COARSE = '(pointer: coarse)';

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

const ITEMS = ['listItem', 'taskItem'];

const STATES: [MarkdownCommand, string][] = [
    ['bold', 'bold'],
    ['italic', 'italic'],
    ['strike', 'strike'],
    ['code', 'code'],
    ['link', 'link'],
    ['heading', 'heading'],
    ['task', 'taskList'],
    ['bullet', 'bulletList'],
    ['numbered', 'orderedList'],
    ['quote', 'blockquote'],
    ['codeBlock', 'codeBlock'],
];

function activeCommands(editor: Editor): MarkdownCommand[] {
    return STATES.filter(([, name]) => editor.isActive(name)).map(
        ([command]) => command,
    );
}

function itemDepths($from: ResolvedPos): number[] {
    return Array.from(
        { length: $from.depth },
        (_, index) => $from.depth - index,
    ).filter((depth) => ITEMS.includes($from.node(depth).type.name));
}

function insertLine(editor: Editor, side: 'above' | 'below'): boolean {
    const { $from } = editor.state.selection;
    const [item] = itemDepths($from);
    const depth = item ?? $from.depth;
    const paragraph = editor.schema.nodes.paragraph.create();
    const line =
        item === undefined
            ? paragraph
            : $from.node(item).type.create(null, paragraph);
    const at = side === 'above' ? $from.before(depth) : $from.after(depth);
    const inside = at + (item === undefined ? 1 : 2);

    return editor
        .chain()
        .focus()
        .command(({ tr }) => {
            tr.insert(at, line);
            tr.setSelection(TextSelection.create(tr.doc, inside));

            return true;
        })
        .run();
}

function clearLine(editor: Editor): boolean {
    const { selection, doc } = editor.state;
    const { $from } = selection;

    if (editor.commands.undoInputRule()) {
        return true;
    }

    if (
        !selection.empty ||
        !$from.parent.isTextblock ||
        $from.parent.content.size > 0
    ) {
        return false;
    }

    const items = itemDepths($from);

    if (items.length > 0) {
        if ($from.node(items[0]).childCount > 1) {
            return false;
        }

        return items
            .reduce(
                (chain, depth) => chain.liftListItem($from.node(depth).type),
                editor.chain(),
            )
            .run();
    }

    if ($from.depth !== 1 || $from.index(0) !== 0 || doc.childCount < 2) {
        return false;
    }

    return editor
        .chain()
        .command(({ tr }) => {
            tr.delete($from.before(1), $from.after(1));
            tr.setSelection(TextSelection.atStart(tr.doc));

            return true;
        })
        .run();
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
        case 'lineAbove':
            insertLine(editor, 'above');
            break;
        case 'lineBelow':
            insertLine(editor, 'below');
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

function shortcuts(
    onLink: RefObject<(() => void) | undefined>,
    toggle: Toggle,
) {
    return Extension.create({
        name: 'markdownShortcuts',
        priority: 1000,
        addKeyboardShortcuts() {
            return {
                Backspace: () => clearLine(this.editor),
                'Mod-Shift-Enter': () => insertLine(this.editor, 'above'),
                'Mod-Alt-Enter': () => insertLine(this.editor, 'below'),
                'Mod-]': () => sink(this.editor),
                'Mod-[': () => lift(this.editor),
                'Mod-Alt--': () => this.editor.commands.setHorizontalRule(),
                'Mod-l': () => {
                    onLink.current?.();

                    return true;
                },
                'Mod-Enter': () => {
                    const task = taskAtCursor(this.editor);

                    if (task === null) {
                        return false;
                    }

                    toggleTask(this.editor, task, toggle);

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
    const activeChange = useRef(props.onActiveChange);
    const reported = useRef('');
    const menu = useRef(props.menu);
    const link = useRef<(() => void) | undefined>(undefined);
    const listen: SlashListener = useRef(undefined);
    const slash = useSlashState(listen);

    toggle.current = props.onToggle;
    change.current = props.onChange;
    focusChange.current = props.onFocusChange;
    activeChange.current = props.onActiveChange;
    menu.current = props.menu;

    const runCommand = (editor: Editor, command: MarkdownCommand) => {
        if (command === 'link') {
            link.current?.();

            return;
        }

        run(editor, command);
    };

    const editor = useEditor({
        immediatelyRender: false,
        content: markdownToDoc(props.value),
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                underline: false,
                listItem: false,
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
            listItem,
            TaskList,
            taskItem(toggle),
            TableKit.configure({ table: { resizable: false } }),
            Placeholder.configure({ placeholder: props.placeholder ?? '' }),
            shortcuts(link, toggle),
            ...(props.menu ? [slashMenu(menu, runCommand, listen)] : []),
        ],
        editorProps: {
            attributes: {
                class: cn('ui-editor', editorSizes[props.size ?? 'sm']),
                'aria-label': props.label,
                'aria-multiline': 'true',
                role: 'textbox',
                spellcheck: String(!window.matchMedia(COARSE).matches),
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
        onTransaction: ({ editor: current }) => {
            const next = activeCommands(current);

            if (next.join() !== reported.current) {
                reported.current = next.join();
                activeChange.current?.(next);
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
                if (editor) {
                    runCommand(editor, command);
                }
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

    return (
        <>
            <EditorContent editor={editor} />
            {props.menu && <SlashMenu state={slash} label={props.menu.label} />}
        </>
    );
}
