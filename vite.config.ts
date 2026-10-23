import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import ts from 'typescript';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

function dedent(text: string): string {
    const lines = text.replace(/^\n+/, '').trimEnd().split('\n');
    const indent = Math.min(
        ...lines
            .filter((line) => line.trim())
            .map((line) => line.length - line.trimStart().length),
    );

    return lines.map((line) => line.slice(indent)).join('\n');
}

function exampleCode(): Plugin {
    return {
        name: 'example-code',
        enforce: 'pre',
        transform(source, id) {
            if (!id.endsWith('/gallery/components-page.tsx')) {
                return;
            }

            const file = ts.createSourceFile(
                id,
                source,
                ts.ScriptTarget.Latest,
                true,
                ts.ScriptKind.TSX,
            );
            const inserts: { at: number; text: string }[] = [];

            const visit = (node: ts.Node) => {
                if (
                    ts.isJsxElement(node) &&
                    node.openingElement.tagName.getText(file) === 'Section' &&
                    node.openingElement.attributes.properties.some(
                        (attribute) =>
                            ts.isJsxAttribute(attribute) &&
                            attribute.name.getText(file) === 'meta',
                    )
                ) {
                    const code = dedent(
                        source.slice(
                            node.openingElement.end,
                            node.closingElement.getStart(file),
                        ),
                    );
                    inserts.push({
                        at: node.closingElement.getStart(file),
                        text: `<Section title="Code" collapsible collapsed><CodeBlock code={${JSON.stringify(code)}} /></Section>`,
                    });
                }

                ts.forEachChild(node, visit);
            };

            visit(file);

            if (!inserts.length) {
                return;
            }

            return {
                code: inserts
                    .sort((a, b) => b.at - a.at)
                    .reduce(
                        (text, insert) =>
                            text.slice(0, insert.at) +
                            insert.text +
                            text.slice(insert.at),
                        source,
                    ),
                map: null,
            };
        },
    };
}

export default defineConfig({
    root: 'gallery',
    server: { host: true },
    plugins: [exampleCode(), react(), tailwindcss()],
});
