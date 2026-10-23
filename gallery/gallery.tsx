import { useEffect, useState } from 'react';
import {
    Section,
    Tabs,
    TabsList,
    TabsTrigger,
    Toaster,
    UiProvider,
} from '../src';
import type { UiLabels } from '../src';
import { ComponentsPage } from './components-page';

type Scheme = 'light' | 'dark';

type Page = 'theme' | 'components';

const colorGroups = [
    {
        title: 'Base',
        description: 'Page, surfaces, controls and borders.',
        tokens: [
            'background',
            'surface',
            'surface-hover',
            'surface-raised',
            'control',
            'control-hover',
            'border',
            'overlay',
        ],
    },
    {
        title: 'Text',
        description: 'From the main text to the faintest hint.',
        tokens: [
            'foreground',
            'foreground-soft',
            'foreground-muted',
            'foreground-faint',
        ],
    },
    {
        title: 'Primary',
        description: 'The color each project chooses.',
        tokens: [
            'primary',
            'primary-hover',
            'primary-foreground',
            'primary-text',
        ],
    },
    {
        title: 'States',
        description: 'Success, warning and danger, each with its text color.',
        tokens: [
            'success',
            'success-foreground',
            'warning',
            'warning-foreground',
            'danger',
            'danger-hover',
            'danger-foreground',
        ],
    },
];

const textSizes = [
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
];

const weights = ['font-normal', 'font-medium', 'font-semibold', 'font-bold'];

const gaps = [
    { className: 'gap-px', px: 1 },
    { className: 'gap-2xs', px: 2 },
    { className: 'gap-xs', px: 4 },
    { className: 'gap-sm', px: 8 },
    { className: 'gap-md', px: 12 },
    { className: 'gap-lg', px: 20 },
    { className: 'gap-xl', px: 32 },
];

const paddings = [
    { className: 'p-px', px: 1 },
    { className: 'p-2xs', px: 2 },
    { className: 'p-xs', px: 4 },
    { className: 'p-sm', px: 8 },
    { className: 'p-md', px: 12 },
    { className: 'p-lg', px: 20 },
    { className: 'p-xl', px: 32 },
];

const sizes = [
    { className: 'size-icon-xs', px: 14, shape: 'rounded-sm bg-foreground-muted' },
    { className: 'size-icon-sm', px: 16, shape: 'rounded-sm bg-foreground-muted' },
    { className: 'size-icon-md', px: 20, shape: 'rounded-sm bg-foreground-muted' },
    { className: 'size-icon-lg', px: 24, shape: 'rounded-sm bg-foreground-muted' },
    { className: 'size-icon-xl', px: 32, shape: 'rounded-sm bg-foreground-muted' },
    {
        className: 'size-touch',
        px: 44,
        shape: 'rounded-full border border-dashed border-foreground-faint',
    },
];

const surfaces = [
    { label: 'surface', className: 'border border-border bg-surface' },
    { label: 'surface-raised', className: 'bg-surface-raised' },
    { label: 'control', className: 'border border-border bg-control' },
];

const animations = [
    'animate-fade-in',
    'animate-pop-in',
    'animate-slide-in-bottom',
    'animate-slide-in-right',
    'animate-slide-in-left',
];

const labels: UiLabels = {
    optional: 'optional',
    cancel: 'Cancel',
    chooseFile: 'Choose file',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
};

const schemes: { value: Scheme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

const pages: { value: Page; label: string }[] = [
    { value: 'theme', label: 'Theme' },
    { value: 'components', label: 'Components' },
];

function readPage(): Page {
    return window.location.hash === '#components' ? 'components' : 'theme';
}

export function Gallery() {
    const [scheme, setScheme] = useState<Scheme>('light');
    const [page, setPage] = useState<Page>(readPage);

    useEffect(() => {
        document.documentElement.className = scheme;
    }, [scheme]);

    const changePage = (next: Page) => {
        window.location.hash = next;
        setPage(next);
    };

    return (
        <UiProvider labels={labels} locale="en-US">
            <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-xl p-lg">
                <header className="flex flex-wrap items-center justify-between gap-md">
                    <div className="flex flex-wrap items-center gap-md">
                        <h1 className="text-2xl font-semibold">ui</h1>
                        <Tabs value={page} onValueChange={changePage}>
                            <TabsList fit>
                                {pages.map((option) => (
                                    <TabsTrigger
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                    <Tabs value={scheme} onValueChange={setScheme}>
                        <TabsList fit>
                            {schemes.map((option) => (
                                <TabsTrigger
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </header>
                {page === 'theme' ? <ThemePage /> : <ComponentsPage />}
                <Toaster scheme={scheme} />
            </div>
        </UiProvider>
    );
}

function ThemePage() {
    const [runs, setRuns] = useState<Record<string, number>>({});

    return (
        <div className="flex flex-col gap-lg">
            <Section title="Colors" collapsible remember="docs:colors">
                {colorGroups.map((group) => (
                    <Section
                        key={group.title}
                        variant="outlined"
                        title={group.title}
                        description={group.description}
                        meta="bg-{token} · text-{token} · border-{token}"
                        collapsible
                        remember={`docs:colors-${group.title}`}
                    >
                        <div className="grid grid-cols-2 gap-sm sm:grid-cols-4">
                            {group.tokens.map((token) => (
                                <div key={token} className="flex flex-col gap-xs">
                                    <div
                                        className="h-12 rounded border border-border"
                                        style={{
                                            background: `var(--color-${token})`,
                                        }}
                                    />
                                    <span className="truncate font-mono text-xs text-foreground-soft">
                                        {token}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>
                ))}
            </Section>
            <Section title="Typography" collapsible remember="docs:typography">
                <Section
                    variant="outlined"
                    title="Sizes"
                    description="Tailwind text sizes in Outfit."
                    meta="text-xs … text-2xl"
                    collapsible
                >
                    <div className="flex flex-col gap-sm">
                        {textSizes.map((size) => (
                            <p key={size} className={size}>
                                {size} Lorem ipsum dolor
                            </p>
                        ))}
                    </div>
                </Section>
                <Section
                    variant="outlined"
                    title="Weights"
                    description="Body text is medium by default."
                    meta="font-normal · font-medium · font-semibold · font-bold"
                    collapsible
                >
                    <div className="flex flex-wrap gap-md">
                        {weights.map((weight) => (
                            <span key={weight} className={weight}>
                                {weight}
                            </span>
                        ))}
                    </div>
                </Section>
            </Section>
            <Section title="Spacing" collapsible remember="docs:spacing">
                <Section
                    variant="outlined"
                    title="Gaps"
                    description="Space between items. Margins use the same scale."
                    meta="gap-{size} · m-{size}"
                    collapsible
                >
                    <div className="flex flex-col gap-sm">
                        {gaps.map((gap) => (
                            <div
                                key={gap.className}
                                className="flex items-center gap-md"
                            >
                                <span className="w-16 font-mono text-xs text-foreground-soft">
                                    {gap.className}
                                </span>
                                <span className="w-10 text-xs text-foreground-faint">
                                    {gap.px} px
                                </span>
                                <div className={`${gap.className} flex`}>
                                    <div className="h-4 w-6 rounded-sm bg-primary" />
                                    <div className="h-4 w-6 rounded-sm bg-primary" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
                <Section
                    variant="outlined"
                    title="Paddings"
                    description="Space from the edge to the content, same scale as gaps."
                    meta="p-{size} · px-{size} · py-{size}"
                    collapsible
                >
                    <div className="flex flex-wrap items-end gap-lg">
                        {paddings.map((padding) => (
                            <div
                                key={padding.className}
                                className="flex flex-col items-center gap-xs"
                            >
                                <div
                                    className={`${padding.className} rounded-sm border border-border bg-surface-raised`}
                                >
                                    <div className="size-6 rounded-sm bg-primary" />
                                </div>
                                <span className="font-mono text-xs text-foreground-soft">
                                    {padding.className}
                                </span>
                                <span className="text-xs text-foreground-faint">
                                    {padding.px} px
                                </span>
                            </div>
                        ))}
                    </div>
                </Section>
            </Section>
            <Section title="Sizes" collapsible remember="docs:sizes">
                <Section
                    variant="outlined"
                    title="Icons and touch"
                    description="Icon sizes, and the minimum touch area of small controls."
                    meta="size-icon-{size} · size-touch"
                    collapsible
                >
                    <div className="flex flex-wrap items-end gap-lg">
                        {sizes.map((size) => (
                            <div
                                key={size.className}
                                className="flex flex-col items-center gap-xs"
                            >
                                <div className={`${size.className} ${size.shape}`} />
                                <span className="font-mono text-xs text-foreground-soft">
                                    {size.className.replace('size-', '')}
                                </span>
                                <span className="text-xs text-foreground-faint">
                                    {size.px} px
                                </span>
                            </div>
                        ))}
                    </div>
                </Section>
            </Section>
            <Section title="Surfaces" collapsible remember="docs:surfaces">
                <Section
                    variant="outlined"
                    title="Radius and surfaces"
                    description="One radius for cards and fields, three surface levels."
                    meta="rounded · bg-surface · bg-surface-raised · bg-control"
                    collapsible
                >
                    <div className="grid grid-cols-3 gap-sm">
                        {surfaces.map((surface) => (
                            <div
                                key={surface.label}
                                className={`rounded p-md font-mono text-xs ${surface.className}`}
                            >
                                {surface.label}
                            </div>
                        ))}
                    </div>
                </Section>
            </Section>
            <Section title="Motion" collapsible remember="docs:motion">
                <Section
                    variant="outlined"
                    title="Animations"
                    description="Click a box to replay. Reduced motion turns them off."
                    meta="animate-{name}"
                    collapsible
                >
                    <div className="grid grid-cols-2 gap-sm sm:grid-cols-3">
                        {animations.map((animation) => (
                            <button
                                key={animation}
                                type="button"
                                onClick={() =>
                                    setRuns({
                                        ...runs,
                                        [animation]: (runs[animation] ?? 0) + 1,
                                    })
                                }
                                className="flex h-20 cursor-pointer items-center justify-center overflow-hidden rounded border border-border bg-surface hover:bg-surface-hover"
                            >
                                <span
                                    key={runs[animation] ?? 0}
                                    className={`${animation} rounded-full bg-primary px-sm py-xs text-xs text-primary-foreground`}
                                >
                                    {animation.replace('animate-', '')}
                                </span>
                            </button>
                        ))}
                    </div>
                </Section>
            </Section>
        </div>
    );
}
