import { Highlight } from 'prism-react-renderer';
import type { PrismTheme } from 'prism-react-renderer';
import { cn } from './lib/utils';

const theme: PrismTheme = {
    plain: {
        color: 'var(--color-foreground)',
        backgroundColor: 'var(--color-surface)',
    },
    styles: [
        {
            types: ['tag', 'class-name', 'function'],
            style: { color: 'var(--color-primary-text)' },
        },
        {
            types: ['attr-name', 'property'],
            style: { color: 'var(--color-foreground-soft)' },
        },
        {
            types: ['string', 'attr-value'],
            style: { color: 'var(--color-success)' },
        },
        {
            types: ['keyword', 'boolean', 'number'],
            style: { color: 'var(--color-danger)' },
        },
        {
            types: ['punctuation', 'operator'],
            style: { color: 'var(--color-foreground-muted)' },
        },
        {
            types: ['comment'],
            style: { color: 'var(--color-foreground-faint)' },
        },
    ],
};

type Props = {
    code: string;
    language?: string;
    className?: string;
};

export function CodeBlock(props: Props) {
    return (
        <Highlight
            code={props.code}
            language={props.language ?? 'tsx'}
            theme={theme}
        >
            {(highlight) => (
                <pre
                    className={cn(
                        'overflow-x-auto rounded border border-border p-md font-mono text-xs leading-relaxed [overflow-wrap:normal] select-text',
                        props.className,
                    )}
                    style={highlight.style}
                >
                    {highlight.tokens.map((line, index) => (
                        <div key={index} {...highlight.getLineProps({ line })}>
                            {line.map((token, key) => (
                                <span
                                    key={key}
                                    {...highlight.getTokenProps({ token })}
                                />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
}
