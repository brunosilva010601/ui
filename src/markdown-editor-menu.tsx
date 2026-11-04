import { Extension } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { Suggestion } from '@tiptap/suggestion';
import type { SuggestionProps } from '@tiptap/suggestion';
import { useState } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { itemClass } from './dropdown-menu';
import { cn } from './lib/utils';
import type {
    MarkdownCommand,
    MarkdownMenu,
    MarkdownMenuItem,
} from './markdown-editor';
import { floatingClass } from './popover';

type Run = (editor: Editor, command: MarkdownCommand) => void;

type Open = SuggestionProps<MarkdownMenuItem, MarkdownMenuItem>;

export type SlashState = {
    open: Open | null;
    index: number;
    element: HTMLElement | null;
};

export type SlashListener = RefObject<
    ((state: SlashState) => void) | undefined
>;

const CLOSED: SlashState = { open: null, index: 0, element: null };

function folded(text: string): string {
    return text
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
}

function moved(state: SlashState, step: number): SlashState {
    const count = state.open?.items.length ?? 0;

    return { ...state, index: (state.index + step + count) % count };
}

export function slashMenu(
    menu: RefObject<MarkdownMenu | undefined>,
    run: Run,
    listen: SlashListener,
) {
    return Extension.create({
        name: 'slashMenu',
        addProseMirrorPlugins() {
            let state = CLOSED;
            let unmount: (() => void) | undefined;

            const publish = (next: SlashState) => {
                state = next;
                listen.current?.(next);
            };

            return [
                Suggestion<MarkdownMenuItem, MarkdownMenuItem>({
                    editor: this.editor,
                    char: '/',
                    items: ({ query }) =>
                        (menu.current?.items ?? []).filter((item) =>
                            folded(item.label).includes(folded(query)),
                        ),
                    command: ({ editor, range, props }) => {
                        editor.chain().focus().deleteRange(range).run();
                        run(editor, props.command);
                    },
                    render: () => ({
                        onStart: (props) => {
                            const element = document.createElement('div');

                            unmount = props.mount(element);
                            publish({ open: props, index: 0, element });
                        },
                        onUpdate: (props) =>
                            publish({
                                ...state,
                                open: props,
                                index: Math.min(
                                    state.index,
                                    Math.max(0, props.items.length - 1),
                                ),
                            }),
                        onKeyDown: ({ event }) => {
                            const items = state.open?.items ?? [];

                            if (items.length === 0) {
                                return false;
                            }

                            if (event.key === 'ArrowDown') {
                                publish(moved(state, 1));

                                return true;
                            }

                            if (event.key === 'ArrowUp') {
                                publish(moved(state, -1));

                                return true;
                            }

                            if (event.key === 'Enter') {
                                state.open?.command(items[state.index]);

                                return true;
                            }

                            return false;
                        },
                        onExit: () => {
                            publish(CLOSED);
                            unmount?.();
                            unmount = undefined;
                        },
                    }),
                }),
            ];
        },
    });
}

export function useSlashState(listen: SlashListener): SlashState {
    const [state, setState] = useState(CLOSED);

    listen.current = setState;

    return state;
}

export function SlashMenu(props: { state: SlashState; label: string }) {
    const { open, element, index } = props.state;

    if (!open || !element || open.items.length === 0) {
        return null;
    }

    return createPortal(
        <div
            role="listbox"
            aria-label={props.label}
            className={cn(
                floatingClass,
                'flex max-h-80 w-[208px] flex-col gap-1 overflow-y-auto p-1',
            )}
        >
            {open.items.map((item, at) => (
                <button
                    key={item.command}
                    type="button"
                    role="option"
                    aria-selected={at === index}
                    data-state={at === index ? 'on' : 'off'}
                    className={itemClass}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => open.command(item)}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </div>,
        element,
    );
}
