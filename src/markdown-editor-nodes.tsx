import { ListItem, TaskItem } from '@tiptap/extension-list';
import type { TaskItemOptions } from '@tiptap/extension-list';
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react';
import type { Editor, ReactNodeViewProps } from '@tiptap/react';
import { Circle, CircleCheck, GripVertical } from 'lucide-react';
import { useId } from 'react';
import type { RefObject } from 'react';
import { cn } from './lib/utils';

export type Toggle = RefObject<((task: number) => void) | undefined>;

function taskIndex(editor: Editor, position: number): number {
    let index = 0;

    editor.state.doc.nodesBetween(0, position, (node, at) => {
        if (node.type.name === 'taskItem' && at < position) {
            index++;
        }
    });

    return index;
}

export function toggleTask(
    editor: Editor,
    position: number,
    toggle: Toggle,
): void {
    if (toggle.current) {
        toggle.current(taskIndex(editor, position));

        return;
    }

    const node = editor.state.doc.nodeAt(position);

    editor.view.dispatch(
        editor.state.tr.setNodeMarkup(position, undefined, {
            ...node?.attrs,
            checked: node?.attrs.checked !== true,
        }),
    );
}

export function taskAtCursor(editor: Editor): number | null {
    const { $from } = editor.state.selection;

    for (let depth = $from.depth; depth > 0; depth--) {
        if ($from.node(depth).type.name === 'taskItem') {
            return $from.before(depth);
        }
    }

    return null;
}

function DragHandle(props: { list?: boolean }) {
    return (
        <span
            contentEditable={false}
            draggable
            data-drag-handle
            aria-hidden
            className={cn(
                'absolute top-0 end-full hidden h-lh cursor-grab items-center text-foreground-faint active:cursor-grabbing [@media(hover:hover)]:group-hover/drag:flex',
                props.list ? 'me-5' : 'me-1',
            )}
        >
            <GripVertical className="size-3.5" />
        </span>
    );
}

function TaskView(props: ReactNodeViewProps) {
    const id = useId();
    const done = props.node.attrs.checked === true;
    const toggle = (props.extension.options as { toggle: Toggle }).toggle;
    const Icon = done ? CircleCheck : Circle;

    const change = () => {
        const position = props.getPos();

        if (typeof position === 'number') {
            toggleTask(props.editor, position, toggle);
        }
    };

    return (
        <NodeViewWrapper className="group/drag relative flex items-start gap-2">
            <DragHandle />
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

function ListItemView() {
    return (
        <NodeViewWrapper className="group/drag relative">
            <DragHandle list />
            <NodeViewContent />
        </NodeViewWrapper>
    );
}

export function taskItem(toggle: Toggle) {
    return TaskItem.extend<TaskItemOptions & { toggle: Toggle }>({
        draggable: true,
        addOptions() {
            return { ...(this.parent?.() as TaskItemOptions), toggle };
        },
        addNodeView() {
            return ReactNodeViewRenderer(TaskView, { as: 'li' });
        },
    }).configure({ nested: true });
}

export const listItem = ListItem.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(ListItemView, { as: 'li' });
    },
});
