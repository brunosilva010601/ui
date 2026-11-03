const ui = '@brunosilva010601/ui';

const palette =
    'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|taupe|mauve|mist|olive|black|white';
const colorUtility =
    'bg|text|border(?:-[xytrblse])?|outline|ring(?:-offset)?|inset-ring|shadow|inset-shadow|drop-shadow|divide|decoration|caret|accent|fill|stroke|from|via|to|placeholder';
const spacingUtility =
    'p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|size|w|h|min-w|min-h|max-w|max-h|inset(?:-[xy])?|top|right|bottom|left|start|end|translate-[xy]|scroll-[mp][xytrblse]?|indent|basis';
const spacingScale = [
    '0',
    'px',
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '4',
    '5',
    '6',
    '8',
    '10',
    '12',
];

const paletteColor = new RegExp(
    `^(?:${colorUtility})-(?:${palette})(?:-\\d{2,3})?(?:/\\S+)?$`,
);
const writtenColor = new RegExp(
    `^(?:${colorUtility})-\\[(?:color:)?(?:#|rgba?\\(|hsla?\\(|oklch\\(|oklab\\(|lab\\(|lch\\()`,
);
const spacingValue = new RegExp(
    `^-?(?:${spacingUtility})-(\\d+(?:\\.\\d+)?(?:px)?|px)$`,
);
const tailwindShadow =
    /^(?:inset-)?shadow(?:-(?:2xs|xs|sm|md|lg|xl|2xl|inner))?$/;
const offScaleText = /^text-(?:xl|4xl|[7-9]xl|\d+px|\[\d)/;
const lineHeight = /^leading-/;
const tailwindRadius =
    /^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-(?:xs|sm|md|lg|xl|2xl|3xl|4xl)$/;

function utility(token) {
    let depth = 0;
    let start = 0;

    for (let index = 0; index < token.length; index++) {
        const char = token[index];

        if (char === '[' || char === '(') {
            depth++;
        } else if (char === ']' || char === ')') {
            depth--;
        } else if (char === ':' && depth === 0) {
            start = index + 1;
        }
    }

    return token.slice(start).replace(/^!|!$/g, '');
}

function isClassString(node) {
    const parent = node.parent;

    if (!parent) {
        return true;
    }

    if (
        parent.type === 'ImportDeclaration' ||
        parent.type === 'ExportNamedDeclaration' ||
        parent.type === 'ExportAllDeclaration' ||
        parent.type === 'ImportExpression' ||
        parent.type === 'TSExternalModuleReference'
    ) {
        return false;
    }

    return !(
        parent.type === 'Property' &&
        parent.key === node &&
        parent.parent?.parent?.type !== 'CallExpression'
    );
}

function classRule(description, check) {
    return {
        meta: {
            type: 'problem',
            docs: { description },
            messages: { found: `{{token}}: ${description}` },
        },
        create(context) {
            const inspect = (node, value) => {
                for (const token of value.split(/\s+/)) {
                    if (token && check(utility(token))) {
                        context.report({
                            node,
                            messageId: 'found',
                            data: { token },
                        });
                    }
                }
            };

            return {
                Literal(node) {
                    if (typeof node.value === 'string' && isClassString(node)) {
                        inspect(node, node.value);
                    }
                },
                TemplateElement(node) {
                    inspect(node, node.value.cooked ?? node.value.raw);
                },
            };
        },
    };
}

function trackImports() {
    const imports = { ui: new Map(), icons: new Set() };

    const visitor = {
        ImportDeclaration(node) {
            for (const specifier of node.specifiers) {
                if (node.source.value === ui && specifier.imported) {
                    imports.ui.set(
                        specifier.local.name,
                        specifier.imported.name,
                    );
                }

                if (node.source.value === 'lucide-react') {
                    imports.icons.add(specifier.local.name);
                }
            }
        },
    };

    return { imports, visitor };
}

function elementName(node) {
    const name = node.openingElement.name;

    return name.type === 'JSXIdentifier' ? name.name : null;
}

function uiComponent(imports, node) {
    const name = elementName(node);

    return name ? imports.ui.get(name) : undefined;
}

function attribute(node, name) {
    return node.openingElement.attributes.find(
        (each) => each.type === 'JSXAttribute' && each.name.name === name,
    );
}

function attributeText(node, name) {
    const found = attribute(node, name);

    if (!found?.value) {
        return null;
    }

    if (found.value.type === 'Literal') {
        return String(found.value.value);
    }

    const expression = found.value.expression;

    return expression?.type === 'Literal' ? String(expression.value) : null;
}

function strings(node) {
    if (!node) {
        return [];
    }

    switch (node.type) {
        case 'Literal':
            return typeof node.value === 'string' ? [node.value] : [];
        case 'TemplateLiteral':
            return [
                ...node.quasis.map((quasi) => quasi.value.cooked ?? ''),
                ...node.expressions.flatMap(strings),
            ];
        case 'JSXExpressionContainer':
            return strings(node.expression);
        case 'CallExpression':
            return node.arguments.flatMap(strings);
        case 'ConditionalExpression':
            return [...strings(node.consequent), ...strings(node.alternate)];
        case 'LogicalExpression':
            return [...strings(node.left), ...strings(node.right)];
        case 'ArrayExpression':
            return node.elements.flatMap(strings);
        case 'ObjectExpression':
            return node.properties.flatMap((each) =>
                each.type === 'Property' ? strings(each.key) : [],
            );
        default:
            return [];
    }
}

function classes(node) {
    return strings(attribute(node, 'className')?.value)
        .flatMap((value) => value.split(/\s+/))
        .filter(Boolean)
        .map(utility);
}

function childElements(nodes) {
    return nodes.flatMap((node) => {
        switch (node.type) {
            case 'JSXElement':
                return [node];
            case 'JSXFragment':
                return childElements(node.children);
            case 'JSXExpressionContainer':
                return childElements([node.expression]);
            case 'LogicalExpression':
                return childElements([node.right]);
            case 'ConditionalExpression':
                return childElements([node.consequent, node.alternate]);
            default:
                return [];
        }
    });
}

function slots(nodes) {
    return nodes.flatMap((node) => {
        switch (node.type) {
            case 'JSXElement':
                return [[node]];
            case 'JSXFragment':
                return slots(node.children);
            case 'JSXExpressionContainer':
                return slots([node.expression]);
            case 'LogicalExpression':
                return slots([node.right]);
            case 'ConditionalExpression':
                return [childElements([node.consequent, node.alternate])];
            default:
                return [];
        }
    });
}

const iconRow = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Square buttons side by side are normal size, take no gap and no bleed.',
        },
        messages: {
            gap: 'Square buttons side by side take no gap: their 42px touch areas already keep the icons 22px apart.',
            bleed: 'A square button beside another one takes no bleed; wrap the row in IconGroup when it ends at the margin.',
            small: 'Square buttons side by side are normal size, for the 42px touch area.',
        },
    },
    create(context) {
        const { imports, visitor } = trackImports();

        return {
            ...visitor,
            JSXElement(node) {
                const isSquare = (child) =>
                    uiComponent(imports, child) === 'Button' &&
                    attribute(child, 'square');
                const filled = slots(node.children)
                    .map((slot) => slot.filter(isSquare))
                    .filter((slot) => slot.length > 0);

                if (filled.length < 2) {
                    return;
                }

                const squares = filled.flat();

                if (
                    classes(node).some((each) =>
                        /^(?:gap|gap-x|space-x)-/.test(each),
                    )
                ) {
                    context.report({
                        node: node.openingElement,
                        messageId: 'gap',
                    });
                }

                for (const square of squares) {
                    if (attribute(square, 'bleed')) {
                        context.report({
                            node: square.openingElement,
                            messageId: 'bleed',
                        });
                    }

                    if (attributeText(square, 'size') === 'sm') {
                        context.report({
                            node: square.openingElement,
                            messageId: 'small',
                        });
                    }
                }
            },
        };
    },
};

const iconSize = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'The button sizes its own icon; the app passes no icon size.',
        },
        messages: {
            found: 'The button sizes its own icon; remove the size from the icon.',
        },
    },
    create(context) {
        const { imports, visitor } = trackImports();

        const isIcon = (node) => {
            const name = node.openingElement.name;

            if (name.type === 'JSXMemberExpression') {
                return true;
            }

            return (
                name.type === 'JSXIdentifier' && imports.icons.has(name.name)
            );
        };

        return {
            ...visitor,
            JSXElement(node) {
                const component = uiComponent(imports, node);

                if (component !== 'Button' && component !== 'FloatingButton') {
                    return;
                }

                for (const child of childElements(node.children)) {
                    if (
                        isIcon(child) &&
                        (attribute(child, 'size') ||
                            classes(child).some((each) =>
                                /^(?:size|w|h)-/.test(each),
                            ))
                    ) {
                        context.report({
                            node: child.openingElement,
                            messageId: 'found',
                        });
                    }
                }
            },
        };
    },
};

export default {
    meta: { name: 'ui' },
    rules: {
        'fixed-color': classRule(
            'use a color role (text-primary, bg-surface, text-foreground-muted) instead of a fixed color.',
            (each) => paletteColor.test(each) || writtenColor.test(each),
        ),
        'spacing-scale': classRule(
            'use the spacing scale (px, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12), plus size-3.5 for a 14px icon.',
            (each) => {
                const match = spacingValue.exec(each);

                return (
                    each.startsWith('size-icon-') ||
                    (match !== null &&
                        !spacingScale.includes(match[1]) &&
                        each !== 'size-3.5')
                );
            },
        ),
        'tailwind-radius': classRule(
            'use rounded, rounded-full or rounded-none, on all sides or on one.',
            (each) => tailwindRadius.test(each),
        ),
        'tailwind-shadow': classRule(
            'use shadow-control, shadow-floating or shadow-overlay.',
            (each) => tailwindShadow.test(each),
        ),
        'safe-area': classRule(
            'use the safe area scale (pt-safe-top, pb-safe-bottom) instead of env().',
            (each) => /\[.*env\(/.test(each),
        ),
        'text-scale': classRule(
            'use the text scale (xs, sm, base, lg, 2xl, 3xl, 5xl, 6xl) or a text role (ui-note, ui-label), with no line height of its own.',
            (each) => offScaleText.test(each) || lineHeight.test(each),
        ),
        'icon-row': iconRow,
        'icon-size': iconSize,
    },
};
