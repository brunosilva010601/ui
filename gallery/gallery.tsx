import { Plus, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Badge,
    Button,
    ButtonGroup,
    Input,
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
            'canvas',
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
    'text-2xl',
    'text-3xl',
    'text-5xl',
    'text-6xl',
];

const textRoles = [
    'ui-page-title',
    'ui-item-title',
    'ui-note',
    'ui-label',
    'ui-prompt',
    'ui-display',
    'ui-hero',
];

const weights = ['font-normal', 'font-medium', 'font-semibold', 'font-bold'];

const gaps = [
    'gap-px',
    'gap-0.5',
    'gap-1',
    'gap-1.5',
    'gap-2',
    'gap-2.5',
    'gap-3',
    'gap-4',
    'gap-5',
    'gap-6',
    'gap-8',
    'gap-10',
    'gap-12',
];

const paddings = [
    'p-px',
    'p-0.5',
    'p-1',
    'p-1.5',
    'p-2',
    'p-2.5',
    'p-3',
    'p-4',
    'p-5',
    'p-6',
    'p-8',
    'p-10',
    'p-12',
];

const sizes = [
    {
        className: 'size-3.5',
        px: 14,
        shape: 'rounded bg-foreground-muted',
    },
    {
        className: 'size-4',
        px: 16,
        shape: 'rounded bg-foreground-muted',
    },
    {
        className: 'size-5',
        px: 20,
        shape: 'rounded bg-foreground-muted',
    },
    {
        className: 'size-6',
        px: 24,
        shape: 'rounded bg-foreground-muted',
    },
    {
        className: 'size-8',
        px: 32,
        shape: 'rounded bg-foreground-muted',
    },
    {
        className: 'size-touch',
        px: 44,
        shape: 'rounded-full border border-dashed border-foreground-faint',
    },
];

const surfaces = [
    { label: 'canvas', className: 'border border-border bg-canvas' },
    { label: 'surface', className: 'border border-border bg-surface' },
    { label: 'surface-raised', className: 'bg-surface-raised' },
    { label: 'control', className: 'border border-border bg-control' },
];

const shadows = ['shadow-control', 'shadow-floating', 'shadow-overlay'];

const animations = [
    'animate-fade-in',
    'animate-pop-in',
    'animate-slide-in-bottom',
    'animate-slide-in-right',
    'animate-slide-in-left',
];

const heightRowClass = 'flex flex-wrap items-start gap-2 *:shrink-0';

const choices = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
];

const labels: UiLabels = {
    optional: 'optional',
    cancel: 'Cancel',
    chooseFile: 'Choose file',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    decrease: 'Decrease',
    increase: 'Increase',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    today: 'Today',
    clear: 'Clear',
    loading: 'Loading',
    moreInfo: 'More information',
    suggestions: 'Suggestions',
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

    useEffect(() => {
        const follow = () => setPage(readPage());

        window.addEventListener('hashchange', follow);

        return () => window.removeEventListener('hashchange', follow);
    }, []);

    const changePage = (next: Page) => {
        window.location.hash = next;
        setPage(next);
    };

    return (
        <UiProvider labels={labels} locale="en-US">
            <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-3 pb-8 sm:px-5">
                <header className="sticky top-0 z-40 -mx-3 flex flex-col gap-2 border-b border-border bg-background/90 px-3 py-2 backdrop-blur-md sm:-mx-5 sm:flex-row sm:items-center sm:gap-3 sm:px-5">
                    <h1 className="text-lg font-semibold">ui</h1>
                    <div className="flex flex-1 items-center gap-2 sm:justify-between">
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
                    </div>
                </header>
                {page === 'theme' ? <ThemePage /> : <ComponentsPage />}
                <Toaster scheme={scheme} />
            </div>
        </UiProvider>
    );
}

function ThemePage() {
    const [runs, setRuns] = useState<Record<string, number>>({});
    const [choice, setChoice] = useState('a');

    return (
        <div className="flex flex-col gap-5">
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
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {group.tokens.map((token) => (
                                <div
                                    key={token}
                                    className="flex flex-col gap-1"
                                >
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
                    description="The closed text scale, in Outfit. Apps use the roles below day to day."
                    meta="text-xs … text-6xl"
                    collapsible
                >
                    <div className="flex flex-col gap-2">
                        {textSizes.map((size) => (
                            <p key={size} className={size}>
                                {size} Lorem ipsum
                            </p>
                        ))}
                    </div>
                </Section>
                <Section
                    variant="outlined"
                    title="Roles"
                    description="Size, weight and color decided together, so no app picks its own."
                    meta="ui-page-title · ui-item-title · ui-note · ui-label · ui-prompt · ui-display · ui-hero"
                    collapsible
                >
                    <div className="flex flex-col gap-2">
                        {textRoles.map((role) => (
                            <p key={role} className={role}>
                                {role}
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
                    <div className="flex flex-wrap gap-3">
                        {weights.map((weight) => (
                            <span key={weight} className={weight}>
                                {weight}
                            </span>
                        ))}
                    </div>
                </Section>
            </Section>
            <Section
                title="Control heights"
                collapsible
                remember="docs:heights"
            >
                <Section
                    variant="outlined"
                    title="Side by side"
                    description="Controls aligned at the top, so the bottoms show any difference in height. Height comes from padding, line height and a 1 px border, which is transparent when it is not visible."
                    meta="padding + font size + border"
                    collapsible
                >
                    <span className="font-mono text-xs text-foreground-muted">
                        md
                    </span>
                    <div className={heightRowClass}>
                        <Input
                            label="Field"
                            hideLabel
                            placeholder="Field"
                            className="w-[112px]"
                        />
                        <Button>Button</Button>
                        <Button variant="outline" square>
                            <Settings />
                        </Button>
                        <Tabs value="a">
                            <TabsList fit>
                                <TabsTrigger value="a">Tab A</TabsTrigger>
                                <TabsTrigger value="b">Tab B</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <span className="font-mono text-xs text-foreground-muted">
                        sm
                    </span>
                    <div className={heightRowClass}>
                        <Button size="sm">Button</Button>
                        <Button size="sm" variant="outline" square>
                            <Settings />
                        </Button>
                        <ButtonGroup
                            size="sm"
                            options={choices}
                            value={choice}
                            onChange={setChoice}
                        />
                        <Badge size="md">Badge md</Badge>
                        <Badge>Badge sm</Badge>
                    </div>
                    <span className="font-mono text-xs text-foreground-muted">
                        big icon and wrapping text
                    </span>
                    <div className={heightRowClass}>
                        <Button>
                            <Plus className="size-10" />
                            Big icon
                        </Button>
                        <Button className="max-w-[160px] whitespace-normal">
                            A longer label that wraps onto two lines
                        </Button>
                        <Button>Normal</Button>
                    </div>
                </Section>
            </Section>
            <Section title="Spacing" collapsible remember="docs:spacing">
                <Section
                    variant="outlined"
                    title="Gaps"
                    description="Space between items. Margins, positions and sizes use the same scale, named by its pixels."
                    meta="gap-{px} · m-{px} · size-{px}"
                    collapsible
                >
                    <div className="flex flex-col gap-2">
                        {gaps.map((gap) => (
                            <div key={gap} className="flex items-center gap-3">
                                <span className="w-[64px] font-mono text-xs text-foreground-soft">
                                    {gap}
                                </span>
                                <div className={`${gap} flex`}>
                                    <div className="h-4 w-6 rounded bg-primary" />
                                    <div className="h-4 w-6 rounded bg-primary" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
                <Section
                    variant="outlined"
                    title="Paddings"
                    description="Space from the edge to the content, same scale as gaps."
                    meta="p-{px} · px-{px} · py-{px}"
                    collapsible
                >
                    <div className="flex flex-wrap items-end gap-5">
                        {paddings.map((padding) => (
                            <div
                                key={padding}
                                className="flex flex-col items-center gap-1"
                            >
                                <div
                                    className={`${padding} rounded border border-border bg-surface-raised`}
                                >
                                    <div className="size-6 rounded bg-primary" />
                                </div>
                                <span className="font-mono text-xs text-foreground-soft">
                                    {padding}
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
                    meta="size-3.5 · size-4 · size-5 · size-6 · size-8 · size-touch"
                    collapsible
                >
                    <div className="flex flex-wrap items-end gap-5">
                        {sizes.map((size) => (
                            <div
                                key={size.className}
                                className="flex flex-col items-center gap-1"
                            >
                                <div
                                    className={`${size.className} ${size.shape}`}
                                />
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
                    <div className="grid grid-cols-3 gap-2">
                        {surfaces.map((surface) => (
                            <div
                                key={surface.label}
                                className={`rounded p-3 font-mono text-xs ${surface.className}`}
                            >
                                {surface.label}
                            </div>
                        ))}
                    </div>
                </Section>
                <Section
                    variant="outlined"
                    title="Shadows"
                    description="A switch knob, things floating over the page, and overlays."
                    meta="shadow-control · shadow-floating · shadow-overlay"
                    collapsible
                >
                    <div className="grid grid-cols-3 gap-2">
                        {shadows.map((shadow) => (
                            <div
                                key={shadow}
                                className={`rounded bg-surface p-3 font-mono text-xs ${shadow}`}
                            >
                                {shadow.replace('shadow-', '')}
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
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                                className="flex h-[80px] cursor-pointer items-center justify-center overflow-hidden rounded border border-border bg-surface hover:bg-surface-hover"
                            >
                                <span
                                    key={runs[animation] ?? 0}
                                    className={`${animation} rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground`}
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
