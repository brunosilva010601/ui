import {
    ArrowLeft,
    Bell,
    Copy,
    FolderOpen,
    Grid2x2,
    Heart,
    Image,
    Inbox,
    ListIcon,
    Pencil,
    Plus,
    Settings,
    Star,
    Trash2,
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import {
    AppearancePicker,
    Avatar,
    Backdrop,
    Brand,
    Button,
    Calendar,
    Badge,
    Banner,
    ButtonGroup,
    ButtonGroupItem,
    CarouselFrame,
    CarouselTrack,
    cn,
    CodeBlock,
    CodeInput,
    ColorDot,
    ColorPicker,
    ConfirmDialog,
    Copyable,
    Detail,
    DropdownCheckboxItem,
    DropdownItem,
    DropdownMenu,
    DropZone,
    EmptyState,
    FileInput,
    Form,
    FormActions,
    Heading,
    Hint,
    IconBadge,
    ImageViewer,
    Input,
    List,
    ListItem,
    Markdown,
    MarkdownEditor,
    Modal,
    ModalFooter,
    MonthInput,
    notify,
    NumberInput,
    Pill,
    ProgressBar,
    RowTrigger,
    SearchInput,
    Section,
    SectionSkeleton,
    Select,
    Skeleton,
    Spinner,
    Stat,
    Switch,
    Tabs,
    TabsList,
    TabsTrigger,
    Textarea,
    AppShell,
    AuthScreen,
    Columns,
    Container,
    ControlStrut,
    Cover,
    ErrorScreen,
    Field,
    FieldError,
    FloatingButton,
    HighlightInput,
    ItemText,
    MainColumn,
    ModalClose,
    ModalCloseButton,
    ModalHiddenDescription,
    ModalTitle,
    NavItem,
    Page,
    PageBottom,
    PageFooter,
    IconGroup,
    paletteBorder,
    paletteColors,
    paletteFill,
    paletteText,
    Popover,
    PopoverContent,
    PopoverTrigger,
    SideColumn,
    Sortable,
    SortScope,
    Surface,
    touchClass,
    useCarousel,
    useFilePicker,
    useHold,
    useModalValue,
    useOverflowing,
} from '../src';
import type {
    Appearance,
    ModalDesktop,
    ModalMobile,
    PaletteColor,
    SortMove,
} from '../src';

const today = new Date().toISOString().slice(0, 10);

const sample =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/></svg>',
    );

const sizes = ['md', 'sm'] as const;

const buttonVariants = [
    'primary',
    'outline',
    'ghost',
    'danger',
    'link',
] as const;

const badgeTones = [
    'neutral',
    'primary',
    'success',
    'warning',
    'danger',
] as const;

const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
];

const contentOptions = (['red', 'green', 'blue'] as const).map(
    (color, index) => ({
        value: options[index].value,
        label: options[index].label,
        content: (
            <>
                <ColorDot color={color} />
                <span className="truncate">{options[index].label}</span>
            </>
        ),
    }),
);

const iconOptions = [
    { value: 'a', label: 'Option A', icon: Heart },
    { value: 'b', label: 'Option B', icon: Star },
    { value: 'c', label: 'Option C', icon: Bell },
];

const paletteSample: PaletteColor[] = [
    'red',
    'amber',
    'emerald',
    'sky',
    'violet',
    'rose',
];

const markdown = `**Bold**, *italic* and [link](#components).

- [x] Checked item
- [ ] Open item

1. First
2. Second

Inline \`code\` and a fenced block:

\`\`\`ts
const total = items.reduce((sum, item) => sum + item.price, 0);
\`\`\``;

const snippet = `function greet(name: string) {
    return \`Hello, \${name}!\`;
}`;

const caption = 'font-mono text-xs text-foreground-faint';

export function ComponentsPage() {
    return (
        <div className="flex flex-col gap-5">
            <Section title="Actions" collapsible remember="docs:actions">
                <ButtonDemo />
                <MarkedButtonDemo />
                <IconGroupDemo />
                <FloatingButtonDemo />
                <TouchClassDemo />
            </Section>
            <Section title="Choices" collapsible remember="docs:choices">
                <ButtonGroupDemo />
                <PillDemo />
                <BadgeDemo />
                <SwitchDemo />
                <AppearancePickerDemo />
            </Section>
            <Section title="Fields" collapsible remember="docs:fields">
                <InputDemo />
                <TextareaDemo />
                <SelectDemo />
                <SearchInputDemo />
                <NumberInputDemo />
                <MonthInputDemo />
                <CalendarDemo />
                <CodeInputDemo />
                <ColorPickerDemo />
                <FileInputDemo />
                <HighlightInputDemo />
                <FieldStatesDemo />
                <FormDemo />
            </Section>
            <Section title="Display" collapsible remember="docs:display">
                <AvatarDemo />
                <ColorDotDemo />
                <IconBadgeDemo />
                <ProgressBarDemo />
                <HeadingDemo />
                <ItemTextDemo />
                <PaletteDemo />
                <DetailDemo />
                <StatDemo />
                <BrandDemo />
                <BannerDemo />
                <EmptyStateDemo />
                <MarkdownDemo />
                <MarkdownEditorDemo />
                <CodeBlockDemo />
                <LoadingDemo />
            </Section>
            <Section title="Structure" collapsible remember="docs:structure">
                <PageDemo />
                <ScreensDemo />
                <NavItemDemo />
                <ContainerDemo />
                <ColumnsDemo />
                <ControlStrutDemo />
                <SurfaceDemo />
                <CoverDemo />
                <SectionDemo />
                <SortableDemo />
                <SortScopeDemo />
                <ListDemo />
                <ListItemStatesDemo />
                <TabsDemo />
                <CarouselDemo />
            </Section>
            <Section title="Overlays" collapsible remember="docs:overlays">
                <ModalDemo />
                <LockedModalDemo />
                <UseModalValueDemo />
                <ConfirmDialogDemo />
                <ConfirmDialogToneDemo />
                <DropdownMenuDemo />
                <PopoverDemo />
                <HintDemo />
                <ImageViewerDemo />
                <BackdropDemo />
                <NotifyDemo />
            </Section>
            <Section title="Utilities" collapsible remember="docs:utilities">
                <UseHoldDemo />
                <UseFilePickerDemo />
            </Section>
        </div>
    );
}

function ButtonDemo() {
    return (
        <Section
            variant="outlined"
            title="Button"
            description="Every variant in both sizes, with text, icon and text, icon only, disabled and busy. Without size, a link takes the size of the text around it."
            meta="variant · size · square · stacked · bleed · busy · disabled · asChild"
            collapsible
            collapsed
            remember="docs:button"
        >
            {sizes.map((size) => (
                <div
                    key={size}
                    className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:justify-items-center"
                >
                    <div className="sm:contents">
                        <span className={caption}>size="{size}"</span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            with icon
                        </span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            disabled
                        </span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            square
                        </span>
                    </div>
                    {buttonVariants.map((variant) => (
                        <div
                            key={variant}
                            className="flex flex-wrap items-center gap-2 sm:contents"
                        >
                            <Button variant={variant} size={size}>
                                {variant}
                            </Button>
                            <Button variant={variant} size={size}>
                                <Plus />
                                {variant}
                            </Button>
                            <Button variant={variant} size={size} disabled>
                                {variant}
                            </Button>
                            {variant === 'link' ? (
                                <span className="max-sm:hidden" />
                            ) : (
                                <Button variant={variant} size={size} square>
                                    <Plus />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <div className="flex flex-col gap-2">
                <span className={caption}>bleed, in a row with text</span>
                <div className="flex items-center justify-between rounded border border-border px-3 py-3">
                    <span>Label</span>
                    <Button variant="ghost" square bleed>
                        <Settings />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>
                    bleed="start", leading the row and keeping its gap to what
                    follows
                </span>
                <div className="flex items-center gap-2 rounded border border-border px-3 py-3">
                    <Button variant="ghost" square bleed="start">
                        <ArrowLeft />
                    </Button>
                    <span className="font-semibold">Title</span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>
                    stacked, icon over the label, in a grid of choices
                </span>
                <div className="grid grid-cols-3 gap-2 sm:max-w-[384px]">
                    <Button variant="outline" stacked>
                        <Star />
                        Label
                    </Button>
                    <Button variant="outline" stacked mark="primary">
                        <Heart />
                        Marked
                    </Button>
                    <Button variant="outline" stacked>
                        <Plus />A longer label that wraps
                    </Button>
                    <Button variant="ghost" stacked>
                        <span className="text-base font-semibold">12</span>
                        <span className="text-foreground-muted">Label</span>
                    </Button>
                    <Button variant="outline" size="sm" stacked>
                        <Star />
                        Small
                    </Button>
                    <Button variant="outline" stacked busy>
                        <Star />
                        Busy
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>busy</span>
                <div className="flex flex-wrap items-center gap-2">
                    <Button busy>Sending</Button>
                    <Button busy>
                        <Plus />
                        Sending
                    </Button>
                    <Button variant="outline" square busy>
                        <Plus />
                    </Button>
                    <Button size="sm" busy>
                        Sending
                    </Button>
                    <Button variant="outline" size="sm" square busy>
                        <Plus />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>edge cases</span>
                <div className="flex flex-wrap items-start gap-2">
                    <Button>
                        <Plus className="size-10" />
                        Big icon
                    </Button>
                    <Button className="max-w-[160px] whitespace-normal">
                        A longer label that wraps onto two lines
                    </Button>
                    <Button>Normal</Button>
                </div>
            </div>
            <p className="text-sm">
                A link inside a sentence:{' '}
                <Button variant="link" asChild>
                    <a href="#components">a source with a fairly long name</a>
                </Button>
                , wrapping like text.
            </p>
        </Section>
    );
}

function PillDemo() {
    const [picked, setPicked] = useState('2');

    return (
        <Section
            variant="outlined"
            title="Pill"
            description="Static text in the same shape and size as an outline button, to sit beside buttons without looking clickable, like a word already revealed in a row of choices. Both sizes, marked, and mixed into a ButtonGroup."
            meta="size · marked"
            collapsible
            collapsed
            remember="docs:pill"
        >
            {sizes.map((size) => (
                <div key={size} className="flex flex-col gap-2">
                    <span className={caption}>size="{size}"</span>
                    <div className="flex flex-wrap items-center gap-2">
                        <Pill size={size}>Revealed</Pill>
                        <Pill size={size} marked>
                            Marked
                        </Pill>
                    </div>
                </div>
            ))}
            <div className="flex flex-col gap-2">
                <span className={caption}>inside a ButtonGroup</span>
                <ButtonGroup value={picked} onChange={setPicked}>
                    <Pill>Which</Pill>
                    <ButtonGroupItem value="2" className="w-12">
                        2
                    </ButtonGroupItem>
                    <Pill marked>sport</Pill>
                    <ButtonGroupItem value="4" className="w-12">
                        4
                    </ButtonGroupItem>
                </ButtonGroup>
            </div>
        </Section>
    );
}

function BadgeDemo() {
    return (
        <Section
            variant="outlined"
            title="Badge"
            description="Static label for a status or a count. Every tone in both sizes, with text, icon and text, a count and the solid fill. Never clickable."
            meta="tone · size · solid · count"
            collapsible
            collapsed
            remember="docs:badge"
        >
            {sizes.map((size) => (
                <div
                    key={size}
                    className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:justify-items-start"
                >
                    <div className="sm:contents">
                        <span className={caption}>size="{size}"</span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            with icon
                        </span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            count
                        </span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            solid
                        </span>
                    </div>
                    {badgeTones.map((tone) => (
                        <div
                            key={tone}
                            className="flex flex-wrap items-center gap-2 sm:contents"
                        >
                            <Badge tone={tone} size={size}>
                                {tone}
                            </Badge>
                            <Badge tone={tone} size={size}>
                                <Star />
                                {tone}
                            </Badge>
                            <Badge tone={tone} size={size} count>
                                12
                            </Badge>
                            <Badge tone={tone} size={size} solid count>
                                3
                            </Badge>
                        </div>
                    ))}
                </div>
            ))}
        </Section>
    );
}

function ButtonGroupDemo() {
    const [values, setValues] = useState<Record<string, string>>({});
    const [many, setMany] = useState<string[]>(['a', 'c']);
    const [view, setView] = useState('list');
    const valueOf = (key: string) => values[key] ?? 'a';
    const choose = (key: string) => (value: string) =>
        setValues({ ...values, [key]: value });

    return (
        <Section
            variant="outlined"
            title="ButtonGroup"
            description="Outline or ghost buttons where one is selected, switching on click, or several with multiple, each turning on and off. Text, icon and text, and icon only in both sizes, then ghost, the layouts and custom items."
            meta="variant · size · iconOnly · label · layout · multiple · disabled · ButtonGroupItem"
            collapsible
            collapsed
            remember="docs:button-group"
        >
            {sizes.map((size) => (
                <div key={size} className="flex flex-col gap-2">
                    <span className={caption}>size="{size}"</span>
                    <ButtonGroup
                        size={size}
                        options={options}
                        value={valueOf(`text-${size}`)}
                        onChange={choose(`text-${size}`)}
                    />
                    <ButtonGroup
                        size={size}
                        options={iconOptions}
                        value={valueOf(`icon-text-${size}`)}
                        onChange={choose(`icon-text-${size}`)}
                    />
                    <ButtonGroup
                        size={size}
                        iconOnly
                        options={iconOptions}
                        value={valueOf(`icon-${size}`)}
                        onChange={choose(`icon-${size}`)}
                    />
                </div>
            ))}
            <div className="flex flex-col gap-2">
                <span className={caption}>variant="ghost" · label</span>
                <ButtonGroup
                    variant="ghost"
                    layout="fill"
                    label="View"
                    iconOnly
                    options={iconOptions}
                    value={valueOf('ghost')}
                    onChange={choose('ghost')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>multiple</span>
                <ButtonGroup
                    multiple
                    options={options}
                    value={many}
                    onChange={setMany}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>layout="fill"</span>
                <ButtonGroup
                    layout="fill"
                    options={options}
                    value={valueOf('fill')}
                    onChange={choose('fill')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>layout="segmented"</span>
                <ButtonGroup
                    layout="segmented"
                    options={options}
                    value={valueOf('segmented')}
                    onChange={choose('segmented')}
                />
                <ButtonGroup
                    layout="segmented"
                    size="sm"
                    options={iconOptions}
                    value={valueOf('segmented-sm')}
                    onChange={choose('segmented-sm')}
                />
                <ButtonGroup
                    layout="segmented"
                    value={valueOf('segmented-item')}
                    onChange={choose('segmented-item')}
                >
                    <ButtonGroupItem value="a">
                        <ListIcon />
                        List
                    </ButtonGroupItem>
                    <ButtonGroupItem value="b" aria-label="Grid">
                        <Grid2x2 />
                    </ButtonGroupItem>
                    <ButtonGroupItem value="c" disabled>
                        Disabled
                    </ButtonGroupItem>
                </ButtonGroup>
            </div>
            <div className="flex flex-col gap-2">
                <span className={caption}>ButtonGroupItem</span>
                <ButtonGroup value={view} onChange={setView}>
                    <ButtonGroupItem value="list">
                        <ListIcon />
                        List
                    </ButtonGroupItem>
                    <ButtonGroupItem value="grid">
                        <Grid2x2 />
                        Grid
                    </ButtonGroupItem>
                </ButtonGroup>
            </div>
        </Section>
    );
}

function SwitchDemo() {
    const [described, setDescribed] = useState(true);
    const [plain, setPlain] = useState(false);

    return (
        <Section
            variant="outlined"
            title="Switch"
            description="On and off setting, with or without a description."
            meta="label · description · checked · onChange"
            collapsible
            collapsed
            remember="docs:switch"
        >
            <Switch
                label="Label"
                description="Supporting text."
                checked={described}
                onChange={setDescribed}
            />
            <Switch label="Label" checked={plain} onChange={setPlain} />
        </Section>
    );
}

function AppearancePickerDemo() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    return (
        <Section
            variant="outlined"
            title="AppearancePicker"
            description="Light, dark or system, each card with a preview of the theme, in one row when there is room. Saving the choice stays in the app; setAppearance applies it."
            meta="value · onChange"
            collapsible
            collapsed
            remember="docs:appearance-picker"
        >
            <AppearancePicker value={appearance} onChange={setAppearance} />
        </Section>
    );
}

function InputDemo() {
    return (
        <Section
            variant="outlined"
            title="Input"
            description="Single line text field: placeholder, description, optional with hint, error and hidden label."
            meta="label · placeholder · description · optional · hint · error · hideLabel"
            collapsible
            collapsed
            remember="docs:input"
        >
            <Input label="Label" placeholder="Placeholder" />
            <Input label="Label" description="Supporting text." />
            <Input label="Label" optional hint="Short explanation." />
            <Input label="Label" error="Error message." />
            <Input label="Label" hideLabel placeholder="Hidden label" />
        </Section>
    );
}

function TextareaDemo() {
    return (
        <Section
            variant="outlined"
            title="Textarea"
            description="Multi line text field that grows with the content, in both sizes and with an error."
            meta="size · error"
            collapsible
            collapsed
            remember="docs:textarea"
        >
            <Textarea label="Label" size="md" placeholder="size md" />
            <Textarea label="Label" size="lg" placeholder="size lg" />
            <Textarea label="Label" error="Error message." />
        </Section>
    );
}

function SelectDemo() {
    const [values, setValues] = useState<Record<string, string>>({});
    const valueOf = (key: string) => values[key] ?? 'a';
    const choose = (key: string) => (value: string) =>
        setValues({ ...values, [key]: value });

    return (
        <Section
            variant="outlined"
            title="Select"
            description="Pick one option from a menu, or a sheet on touch screens: plain, with free content, and with description, hint and error."
            meta="options · options[].content · description · hint · optional · error · disabled"
            collapsible
            collapsed
            remember="docs:select"
        >
            <Select
                label="Label"
                value={valueOf('plain')}
                options={options}
                onChange={choose('plain')}
            />
            <Select
                label="Label"
                error="Error message"
                value={valueOf('error')}
                options={options}
                onChange={choose('error')}
            />
            <Select
                label="Label"
                disabled
                value={valueOf('disabled')}
                options={options}
                onChange={choose('disabled')}
            />
            <Select
                label="Label"
                value={valueOf('content')}
                options={contentOptions}
                onChange={choose('content')}
            />
            <Select
                label="Label"
                description="Supporting text."
                hint="Short explanation."
                value={valueOf('described')}
                options={options}
                onChange={choose('described')}
            />
        </Section>
    );
}

function SearchInputDemo() {
    const [empty, setEmpty] = useState('');
    const [filled, setFilled] = useState('Query');

    return (
        <Section
            variant="outlined"
            title="SearchInput"
            description="Search field with icon, empty and filled. The clear button appears with text."
            meta="value · placeholder · onChange · onClear"
            collapsible
            collapsed
            remember="docs:search-input"
        >
            <SearchInput
                value={empty}
                placeholder="Search"
                onChange={setEmpty}
            />
            <SearchInput
                value={filled}
                placeholder="Search"
                onChange={setFilled}
                onClear={() => notify({ title: 'Cleared' })}
            />
        </Section>
    );
}

function NumberInputDemo() {
    const [plain, setPlain] = useState<number | ''>(3);
    const [padded, setPadded] = useState<number | ''>(5);
    const [wrapped, setWrapped] = useState<number | ''>(55);

    return (
        <Section
            variant="outlined"
            title="NumberInput"
            description="Number field with minus and plus, hold to repeat: a range, leading zeros, and steps that wrap around."
            meta="min · max · pad · step · wrap"
            collapsible
            collapsed
            remember="docs:number-input"
        >
            <div className="grid gap-3 sm:grid-cols-3">
                <NumberInput
                    label="min · max"
                    value={plain}
                    min={0}
                    max={10}
                    onChange={setPlain}
                />
                <NumberInput
                    label="pad"
                    value={padded}
                    min={0}
                    max={99}
                    pad={2}
                    onChange={setPadded}
                />
                <NumberInput
                    label="step · wrap"
                    value={wrapped}
                    min={0}
                    max={59}
                    step={5}
                    pad={2}
                    wrap
                    onChange={setWrapped}
                />
            </div>
        </Section>
    );
}

function MonthInputDemo() {
    const [month, setMonth] = useState({ year: 2026, month: 10 });
    const [year, setYear] = useState({ year: 2026, month: 1 });

    return (
        <Section
            variant="outlined"
            title="MonthInput"
            description="Month and year stepper, tap the value to pick a year. Steps by month, or by year."
            meta="value · min · max · yearOnly"
            collapsible
            collapsed
            remember="docs:month-input"
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <MonthInput
                    label="Month"
                    value={month}
                    min={{ year: 2020, month: 1 }}
                    onChange={setMonth}
                />
                <MonthInput
                    label="yearOnly"
                    yearOnly
                    value={year}
                    min={{ year: 2020, month: 1 }}
                    onChange={setYear}
                />
            </div>
        </Section>
    );
}

function CalendarDemo() {
    const [date, setDate] = useState(today);

    return (
        <Section
            variant="outlined"
            title="Calendar"
            description="Month grid to pick a day, in the locale and week start of UiProvider. Days before min are disabled, marked days get a tint."
            meta="value · today · min · marked"
            collapsible
            collapsed
            remember="docs:calendar"
        >
            <Calendar
                value={date}
                today={today}
                min={today}
                marked={(day) => day.endsWith('-15') || day.endsWith('-28')}
                onChange={setDate}
            />
        </Section>
    );
}

function CodeInputDemo() {
    return (
        <Section
            variant="outlined"
            title="CodeInput"
            description="One time code field, one box per digit, with and without error."
            meta="name · error"
            collapsible
            collapsed
            remember="docs:code-input"
        >
            <CodeInput label="Label" name="code" />
            <CodeInput label="Label" name="code-error" error="Error message." />
        </Section>
    );
}

function ColorPickerDemo() {
    const [color, setColor] = useState<PaletteColor | null>('sky');

    return (
        <Section
            variant="outlined"
            title="ColorPicker"
            description="Pick one color of the palette. The first option clears it."
            meta="value · onChange · error"
            collapsible
            collapsed
            remember="docs:color-picker"
        >
            <ColorPicker label="Label" value={color} onChange={setColor} />
            <ColorPicker
                label="Label"
                value={null}
                error="Error message."
                onChange={() => {}}
            />
        </Section>
    );
}

function FileInputDemo() {
    const [file, setFile] = useState<File | null>(null);
    const [typed, setTyped] = useState<File | null>(null);

    return (
        <Section
            variant="outlined"
            title="FileInput"
            description="Area for a single file: plain, and with accepted types and an error."
            meta="file · onChange · accept · error"
            collapsible
            collapsed
            remember="docs:file-input"
        >
            <FileInput label="Label" file={file} onChange={setFile} />
            <FileInput
                label="Label"
                accept=".pdf,.png"
                error="Error message."
                file={typed}
                onChange={setTyped}
            />
        </Section>
    );
}

function FormDemo() {
    const [sent, setSent] = useState(0);
    const submit = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setSent(sent + 1);
    };

    return (
        <Section
            variant="outlined"
            title="Form"
            description="Form with consistent spacing. Actions stacked or inline, submit buttons find the form on their own."
            meta="gap · onSubmit · FormActions · inline"
            collapsible
            collapsed
            remember="docs:form"
        >
            <Form onSubmit={submit}>
                <Input label="Label" />
                <FormActions>
                    <Button type="submit">Submit</Button>
                    <Button variant="ghost">Secondary</Button>
                </FormActions>
            </Form>
            <Form onSubmit={submit}>
                <FormActions inline>
                    <Button type="submit">Submit</Button>
                    <span className="text-sm text-foreground-muted">
                        Submitted {sent} times
                    </span>
                </FormActions>
            </Form>
        </Section>
    );
}

function AvatarDemo() {
    return (
        <Section
            variant="outlined"
            title="Avatar"
            description="Every size, with the first letter of the name and with a picture."
            meta="name · size · src"
            collapsible
            collapsed
            remember="docs:avatar"
        >
            <div className="grid grid-cols-5 items-center justify-items-start gap-3">
                <span />
                {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                    <span key={size} className={caption}>
                        {size}
                    </span>
                ))}
                <span className={caption}>name</span>
                {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                    <Avatar key={size} name="Example" size={size} />
                ))}
                <span className={caption}>src</span>
                {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                    <Avatar
                        key={size}
                        name="Example"
                        src={sample}
                        size={size}
                    />
                ))}
            </div>
        </Section>
    );
}

function ColorDotDemo() {
    return (
        <Section
            variant="outlined"
            title="ColorDot"
            description="Small dot in any palette color, or muted."
            meta="color · muted"
            collapsible
            collapsed
            remember="docs:color-dot"
        >
            <div className="flex flex-wrap items-center gap-3">
                {paletteSample.map((color) => (
                    <ColorDot key={color} color={color} />
                ))}
                <ColorDot color={null} muted />
            </div>
        </Section>
    );
}

function IconBadgeDemo() {
    return (
        <Section
            variant="outlined"
            title="IconBadge"
            description="Icon in a tinted circle, every size in the primary color and in palette colors."
            meta="icon · size · color"
            collapsible
            collapsed
            remember="docs:icon-badge"
        >
            <div className="grid grid-cols-4 items-center justify-items-start gap-3">
                <span />
                <span className={caption}>sm</span>
                <span className={caption}>md</span>
                <span className={caption}>lg</span>
                {([null, 'rose', 'amber', 'emerald'] as const).map((color) => (
                    <Fragment key={color ?? 'primary'}>
                        <span className={caption}>{color ?? 'primary'}</span>
                        {(['sm', 'md', 'lg'] as const).map((size) => (
                            <IconBadge
                                key={size}
                                icon={Heart}
                                size={size}
                                color={color}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </Section>
    );
}

function ProgressBarDemo() {
    return (
        <Section
            variant="outlined"
            title="ProgressBar"
            description="Empty, in progress and complete, green when the value reaches the maximum. A tone fixes the color, and linear makes a bar driven by time advance at a steady pace."
            meta="value · max · tone · linear · className"
            collapsible
            collapsed
            remember="docs:progress-bar"
        >
            <ProgressBar value={0} max={10} />
            <ProgressBar value={3} max={10} />
            <ProgressBar value={10} max={10} />
            {badgeTones.map((tone) => (
                <ProgressBar key={tone} value={6} max={10} tone={tone} />
            ))}
            <ProgressBarCountdown />
        </Section>
    );
}

function ProgressBarCountdown() {
    const [left, setLeft] = useState(10);

    useEffect(() => {
        const timer = window.setInterval(
            () => setLeft((value) => (value <= 0 ? 10 : value - 0.25)),
            250,
        );

        return () => window.clearInterval(timer);
    }, []);

    return (
        <ProgressBar
            value={left}
            max={10}
            tone={left <= 3 ? 'danger' : 'neutral'}
            linear
        />
    );
}

function HeadingDemo() {
    return (
        <Section
            variant="outlined"
            title="Heading"
            description="Title alone, with a description, and with the meta line."
            meta="title · description · meta · as"
            collapsible
            collapsed
            remember="docs:heading"
        >
            <Heading title="Title" />
            <Heading title="Title" description="Short description." />
            <Heading
                title="Title"
                description="Short description."
                meta='prop="value"'
            />
        </Section>
    );
}

function DetailDemo() {
    return (
        <Section
            variant="outlined"
            title="Detail"
            description="Label and value pairs, stacked, inline or side by side, with an action beside them and Copyable for selectable text."
            meta="label · inline · side · action · Copyable"
            collapsible
            collapsed
            remember="docs:detail"
        >
            <dl className="grid grid-cols-2 gap-3">
                <Detail label="Label">Value</Detail>
                <Detail label="Copyable">
                    <Copyable>
                        <span>ABC-123</span>
                    </Copyable>
                </Detail>
                <Detail
                    label="With actions"
                    action={
                        <>
                            <Button variant="ghost" square title="Favorite">
                                <Star />
                            </Button>
                            <Button variant="ghost" square title="Notify">
                                <Bell />
                            </Button>
                        </>
                    }
                >
                    Value
                </Detail>
            </dl>
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2">
                <Detail label="Label" inline>
                    Value
                </Detail>
                <Detail label="Other label" inline>
                    Other value
                </Detail>
            </dl>
            <dl className="flex flex-col gap-2">
                <Detail label="Label" side>
                    Value
                </Detail>
                <Detail
                    label="With an action"
                    action={
                        <Button variant="ghost" square>
                            <Copy />
                        </Button>
                    }
                >
                    Value
                </Detail>
                <Detail
                    label="Side with an action"
                    side
                    action={
                        <Button variant="ghost" square>
                            <Copy />
                        </Button>
                    }
                >
                    Value
                </Detail>
            </dl>
        </Section>
    );
}

function StatDemo() {
    return (
        <Section
            variant="outlined"
            title="Stat"
            description="Number with a label, in both sizes and as a link."
            meta="value · label · size · href"
            collapsible
            collapsed
            remember="docs:stat"
        >
            <div className="grid grid-cols-3 divide-x divide-border rounded border border-border bg-surface">
                <Stat value={12} label="md" />
                <Stat value={48} label="lg" size="lg" />
                <Stat value={3} label="href" href="#components" />
            </div>
        </Section>
    );
}

function BrandDemo() {
    return (
        <Section
            variant="outlined"
            title="Brand"
            description="Logo and name of the app linking home, in every size."
            meta="name · logo · href · size"
            collapsible
            collapsed
            remember="docs:brand"
        >
            <div className="flex flex-wrap items-end gap-5">
                {(['sm', 'md', 'lg'] as const).map((size) => (
                    <Brand
                        key={size}
                        name="Brand"
                        href="#components"
                        size={size}
                        logo={(className) => <Bell className={className} />}
                    />
                ))}
            </div>
        </Section>
    );
}

function EmptyStateDemo() {
    return (
        <Section
            variant="outlined"
            title="EmptyState"
            description="Placeholder for empty lists and pages, with and without an action, and with the title alone."
            meta="icon · title · description · action · compact"
            collapsible
            collapsed
            remember="docs:empty-state"
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <EmptyState
                    icon={FolderOpen}
                    title="Title"
                    description="Empty state description."
                    action={{
                        label: 'Action',
                        icon: Plus,
                        onClick: () => notify({ title: 'Action' }),
                    }}
                />
                <EmptyState icon={Inbox} title="Title" />
                <EmptyState compact title="Compact, for inside a card." />
                <EmptyState
                    compact
                    title="Compact with an action."
                    action={{ label: 'Add', icon: Plus, onClick: () => {} }}
                />
                <EmptyState title="Nothing here yet" />
            </div>
        </Section>
    );
}

function BannerDemo() {
    return (
        <Section
            variant="outlined"
            title="Banner"
            description="Notice that stays in the content, in every tone, with a chosen icon, while waiting, with an action, and edge to edge inside an area."
            meta="tone · icon · busy · bleed · action"
            collapsible
            collapsed
            remember="docs:banner"
        >
            {badgeTones.map((tone) => (
                <Banner key={tone} tone={tone}>
                    tone="{tone}"
                </Banner>
            ))}
            <Banner tone="primary" icon={Bell}>
                A chosen icon, and a longer line of text that wraps onto two
                lines to show how it balances beside the icon.
            </Banner>
            <Banner busy>Waiting for something to finish</Banner>
            <Banner
                tone="warning"
                action={
                    <Button variant="link" size="sm">
                        Action
                    </Button>
                }
            >
                With an action beside the text
            </Banner>
            <div className="flex flex-col gap-2 rounded border border-border bg-surface p-3 [--bleed:var(--spacing-3)]">
                <span className={caption}>bleed inside a card</span>
                <Banner tone="danger" bleed>
                    Edge to edge, up to the padding of the area
                </Banner>
            </div>
        </Section>
    );
}

function MarkdownDemo() {
    const [text, setText] = useState(markdown);

    const toggle = (line: number) =>
        setText(
            text
                .split('\n')
                .map((row, index) =>
                    index === line - 1
                        ? row.includes('[x]')
                            ? row.replace('[x]', '[ ]')
                            : row.replace('[ ]', '[x]')
                        : row,
                )
                .join('\n'),
        );

    return (
        <Section
            variant="outlined"
            title="Markdown"
            description="Markdown with checklists, tables and code blocks. Medium with checkable items, then small and read only."
            meta="size · onToggle"
            collapsible
            collapsed
            remember="docs:markdown"
        >
            <Markdown size="md" onToggle={toggle}>
                {text}
            </Markdown>
            <Markdown size="sm">{markdown}</Markdown>
        </Section>
    );
}

function MarkdownEditorDemo() {
    const [text, setText] = useState(markdown);

    return (
        <Section
            variant="outlined"
            title="Markdown editor"
            description="Edits the formatted text and gives back Markdown. Typing # , - or [ ] at the start of a line turns it into a heading, list or checklist, / opens the menu, ⌘Enter ticks the line and list items drag by the handle."
            meta="value · onChange · menu · onToggle · onLink · ref"
            collapsible
            collapsed
            remember="docs:markdown-editor"
        >
            <MarkdownEditor
                label="Notes"
                placeholder="Write something"
                size="md"
                value={text}
                onChange={setText}
                menu={{
                    label: 'Formatting',
                    items: [
                        { command: 'heading', label: 'Heading' },
                        { command: 'task', label: 'Checklist' },
                        { command: 'bullet', label: 'List' },
                        { command: 'quote', label: 'Quote' },
                        { command: 'divider', label: 'Divider' },
                    ],
                }}
            />
            <Markdown size="sm">{text}</Markdown>
        </Section>
    );
}

function CodeBlockDemo() {
    return (
        <Section
            variant="outlined"
            title="CodeBlock"
            description="Formatted code with highlighting that follows the theme, TypeScript by default or any bundled language."
            meta="code · language"
            collapsible
            collapsed
            remember="docs:code-block"
        >
            <CodeBlock code={snippet} />
            <CodeBlock
                language="css"
                code={'.card {\n    padding: var(--spacing-3);\n}'}
            />
        </Section>
    );
}

function LoadingDemo() {
    return (
        <Section
            variant="outlined"
            title="Spinner and Skeleton"
            description="Loading indicators: the spinner, every skeleton shape and the ready made section placeholder."
            meta="Spinner · Skeleton shape · SectionSkeleton"
            collapsible
            collapsed
            remember="docs:loading"
        >
            <Spinner />
            <div className="flex items-center gap-3">
                <Skeleton shape="avatar" />
                <div className="flex flex-1 flex-col gap-2">
                    <Skeleton shape="title" className="w-1/2" />
                    <Skeleton shape="line" />
                    <Skeleton shape="line" className="w-3/4" />
                </div>
            </div>
            <Skeleton className="h-[64px] rounded" />
            <SectionSkeleton />
        </Section>
    );
}

function SectionDemo() {
    return (
        <Section
            variant="outlined"
            title="Section"
            description="Block with header and content, flat or outlined, with extras, collapsible and clickable. This whole page is built with it."
            meta="variant · title · description · meta · icon · note · hint · action · menu · hover · collapsible · collapsed · remember · onClick · href"
            collapsible
            collapsed
            remember="docs:section"
        >
            <Section
                title="Flat"
                description="No border, on the page background."
            >
                <p className="text-sm">Content.</p>
            </Section>
            <Section
                variant="outlined"
                title="Outlined"
                icon={Inbox}
                note={3}
                hint="Short explanation."
                menu={{
                    label: 'Options',
                    items: (
                        <>
                            <DropdownItem asChild>
                                <button type="button">
                                    <Pencil />
                                    Edit
                                </button>
                            </DropdownItem>
                            <DropdownItem asChild>
                                <button type="button">
                                    <Trash2 />
                                    Delete
                                </button>
                            </DropdownItem>
                        </>
                    ),
                }}
            >
                <p className="text-sm">Content.</p>
            </Section>
            <Section variant="outlined" title="Collapsed" collapsible collapsed>
                <p className="text-sm">Content.</p>
            </Section>
            <Section title="Flat collapsible" note={2} collapsible>
                <p className="text-sm">Content.</p>
            </Section>
            <Section description="Collapsible with a quiet label" collapsible>
                <p className="text-sm">Content.</p>
            </Section>
            <Section
                title="Action on hover"
                collapsible
                hover
                menu={{
                    label: 'Options',
                    items: (
                        <DropdownItem onSelect={() => {}}>Rename</DropdownItem>
                    ),
                }}
                action={
                    <Button variant="ghost" square title="Add">
                        <Plus />
                    </Button>
                }
            >
                <p className="text-sm">Content.</p>
            </Section>
            <Section
                variant="outlined"
                title="Clickable"
                description="The whole section is a button."
                onClick={() => notify({ title: 'Clicked' })}
            />
        </Section>
    );
}

function ListDemo() {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    const [sorted, setSorted] = useState(items);
    const [organizing, setOrganizing] = useState(false);
    const menuItems = (
        <>
            <DropdownItem asChild>
                <button type="button">
                    <Pencil />
                    Edit
                </button>
            </DropdownItem>
            <DropdownItem asChild>
                <button type="button">
                    <Trash2 />
                    Delete
                </button>
            </DropdownItem>
        </>
    );

    return (
        <Section
            variant="outlined"
            title="List"
            description="The list is only the frame: padding, dividers or cards, hover, the active and selected states, the click of the whole row and the row menu. What goes inside each item is free and belongs to the app. Divided, cards or bare; the menu opens by holding, right clicking or the ellipsis, which sits at the end of the row or floats over it on hover."
            meta="List variant · bleed · columns · horizontal · onReorder · organizing · ListItem onClick · href · external · active · selected · align · menu · sortId"
            collapsible
            collapsed
            remember="docs:list"
        >
            <div className="overflow-hidden rounded border border-border bg-surface">
                <List>
                    <ListItem>
                        <span className="text-sm">Static item</span>
                    </ListItem>
                    <ListItem onClick={() => notify({ title: 'Item clicked' })}>
                        <IconBadge icon={Inbox} size="sm" />
                        <span className="flex-1 text-sm">Clickable item</span>
                        <Badge>3</Badge>
                    </ListItem>
                    <ListItem
                        onClick={() => notify({ title: 'Item clicked' })}
                        menu={{ label: 'Options', items: menuItems }}
                    >
                        <Avatar name="Example" size="sm" />
                        <span className="flex-1 text-sm">With a menu</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            square
                            bleed
                            onClick={() => notify({ title: 'Button clicked' })}
                        >
                            <Pencil />
                        </Button>
                    </ListItem>
                    <ListItem
                        onClick={() => notify({ title: 'Item clicked' })}
                        menu={{
                            label: 'Options',
                            items: menuItems,
                            hover: true,
                        }}
                    >
                        <span className="flex-1 text-sm">Menu on hover</span>
                    </ListItem>
                    <ListItem
                        active
                        onClick={() => notify({ title: 'Item clicked' })}
                    >
                        <span className="text-sm">Active item</span>
                    </ListItem>
                    <ListItem
                        selected
                        onClick={() => notify({ title: 'Item clicked' })}
                    >
                        <span className="text-sm">Selected item</span>
                    </ListItem>
                    <ListItem
                        align="start"
                        onClick={() => notify({ title: 'Item clicked' })}
                    >
                        <Avatar name="Example" size="sm" />
                        <span className="flex-1 text-sm">
                            Aligned to the top: the avatar stays at the first
                            line when the text runs over several lines, as in a
                            long description that wraps.
                        </span>
                    </ListItem>
                </List>
            </div>
            <span className={caption}>onReorder · organizing · sortId</span>
            <div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOrganizing(!organizing)}
                >
                    {organizing ? 'Done' : 'Organize'}
                </Button>
            </div>
            <div className="overflow-hidden rounded border border-border bg-surface">
                <List organizing={organizing} onReorder={setSorted}>
                    {sorted.map((item) => (
                        <ListItem key={item} sortId={item}>
                            <span className="text-sm">{item}</span>
                        </ListItem>
                    ))}
                </List>
            </div>
            <span className={caption}>variant="cards"</span>
            <List variant="cards">
                {items.map((item) => (
                    <ListItem
                        key={item}
                        onClick={() => notify({ title: item })}
                    >
                        <span className="text-sm">{item}</span>
                    </ListItem>
                ))}
            </List>
            <span className={caption}>variant="bare"</span>
            <List variant="bare">
                {items.slice(0, 2).map((item) => (
                    <ListItem key={item}>
                        <span className="text-sm">{item}</span>
                    </ListItem>
                ))}
            </List>
            <div className="overflow-hidden rounded border border-border bg-surface">
                <List columns>
                    {items.map((item) => (
                        <ListItem key={item}>
                            <span className="text-sm">{item}</span>
                        </ListItem>
                    ))}
                </List>
            </div>
            <div className="rounded border border-border bg-surface">
                <List horizontal>
                    {items.slice(0, 3).map((item) => (
                        <ListItem key={item}>
                            <span className="text-sm">{item}</span>
                        </ListItem>
                    ))}
                </List>
            </div>
        </Section>
    );
}

function TabsDemo() {
    const [full, setFull] = useState('a');
    const [fit, setFit] = useState('b');
    const [icon, setIcon] = useState('a');
    const [many, setMany] = useState('tab-1');

    return (
        <Section
            variant="outlined"
            title="Tabs"
            description="Switch between views: full width, fitted to the content, with icons, and with more tabs than fit, which scrolls sideways and fades at the edges."
            meta="value · onValueChange · TabsList fit · TabsTrigger"
            collapsible
            collapsed
            remember="docs:tabs"
        >
            <Tabs value={full} onValueChange={setFull}>
                <TabsList>
                    {options.map((option) => (
                        <TabsTrigger key={option.value} value={option.value}>
                            {option.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Tabs value={fit} onValueChange={setFit}>
                <TabsList fit>
                    {options.map((option) => (
                        <TabsTrigger key={option.value} value={option.value}>
                            {option.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Tabs value={icon} onValueChange={setIcon}>
                <TabsList fit>
                    {iconOptions.map((option) => (
                        <TabsTrigger key={option.value} value={option.value}>
                            <option.icon />
                            {option.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <Tabs value={many} onValueChange={setMany}>
                <TabsList>
                    {Array.from({ length: 12 }, (_, index) => (
                        <TabsTrigger key={index} value={`tab-${index + 1}`}>
                            Longer tab name {index + 1}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </Section>
    );
}

function CarouselDemo() {
    const many = useCarousel();
    const manyOverflowing = useOverflowing(many);
    const raised = useCarousel();
    const raisedOverflowing = useOverflowing(raised);
    const few = useCarousel();
    const fewOverflowing = useOverflowing(few);

    const slides = (count: number) =>
        Array.from({ length: count }, (_, index) => (
            <div
                key={index}
                className="flex h-[112px] w-[160px] items-center justify-center rounded border border-border bg-control"
            >
                <Image className="size-6 text-foreground-faint" />
            </div>
        ));

    return (
        <Section
            variant="outlined"
            title="Carousel"
            description="Horizontal scroller with arrows on hover when the content overflows. The track fades the edges that hide content, on any background, since the fade is a mask and not a painted gradient."
            meta="useCarousel · useOverflowing · CarouselFrame arrows · CarouselTrack"
            collapsible
            collapsed
            remember="docs:carousel"
        >
            <CarouselFrame control={many} arrows={manyOverflowing}>
                <CarouselTrack control={many} className="gap-2">
                    {slides(10)}
                </CarouselTrack>
            </CarouselFrame>
            <div className="rounded bg-surface-raised p-3">
                <CarouselFrame control={raised} arrows={raisedOverflowing}>
                    <CarouselTrack control={raised} className="gap-2">
                        {slides(10)}
                    </CarouselTrack>
                </CarouselFrame>
            </div>
            <CarouselFrame control={few} arrows={fewOverflowing}>
                <CarouselTrack control={few} className="gap-2">
                    {slides(2)}
                </CarouselTrack>
            </CarouselFrame>
        </Section>
    );
}

const modalCases: {
    label: string;
    mobile: ModalMobile;
    desktop?: ModalDesktop;
}[] = [
    { label: 'dialog', mobile: 'dialog' },
    { label: 'top', mobile: 'top' },
    { label: 'left', mobile: 'left' },
    { label: 'right', mobile: 'right' },
    { label: 'sheet', mobile: 'sheet' },
    { label: 'full', mobile: 'full' },
    { label: 'sheet · desktop right', mobile: 'sheet', desktop: 'right' },
    { label: 'full · desktop dialog', mobile: 'full', desktop: 'dialog' },
    { label: 'full · desktop left', mobile: 'full', desktop: 'left' },
    { label: 'full · desktop top', mobile: 'full', desktop: 'top' },
];

function ModalDemo() {
    const [open, setOpen] = useState<string | null>(null);
    const close = () => setOpen(null);

    return (
        <Section
            variant="outlined"
            title="Modal"
            description="Each use says what the modal is on phones (mobile) and, when it differs from the default, on wider screens (desktop); the switch is CSS only. sheet rises from the bottom sized to its content and becomes a centered dialog on wider screens; full rises at full height and becomes a panel on the right. The dialog has a default width, changed with a max-w class. Closes with the back button and by dragging the sheets."
            meta="mobile · desktop · className · title · description · ModalFooter"
            collapsible
            collapsed
            remember="docs:modal"
        >
            <div className="flex flex-wrap gap-3">
                {modalCases.map((each) => (
                    <Button
                        key={each.label}
                        variant="outline"
                        onClick={() => setOpen(each.label)}
                    >
                        {each.label}
                    </Button>
                ))}
                <Button variant="outline" onClick={() => setOpen('wide')}>
                    dialog max-w-4xl
                </Button>
            </div>
            {modalCases.map((each) => (
                <Modal
                    key={each.label}
                    open={open === each.label}
                    onClose={close}
                    mobile={each.mobile}
                    desktop={each.desktop}
                    title="Title"
                    description={each.label}
                >
                    <p className="text-sm">Content.</p>
                    <ModalFooter>
                        <Button onClick={close}>Ok</Button>
                    </ModalFooter>
                </Modal>
            ))}
            <Modal
                open={open === 'wide'}
                onClose={close}
                mobile="dialog"
                className="max-w-4xl"
                title="Title"
            >
                <p className="text-sm">Content.</p>
            </Modal>
        </Section>
    );
}

function ConfirmDialogDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Section
            variant="outlined"
            title="ConfirmDialog"
            description="Asks before a destructive action. Keeps the button disabled while the promise returned by onConfirm runs, or, without a promise, until the next navigation settles or the dialog closes."
            meta="title · description · confirmLabel · onConfirm · blocked"
            collapsible
            collapsed
            remember="docs:confirm-dialog"
        >
            <div>
                <Button variant="danger" onClick={() => setOpen(true)}>
                    Open
                </Button>
            </div>
            <ConfirmDialog
                open={open}
                title="Title"
                description="Confirmation description."
                confirmLabel="Confirm"
                onConfirm={() =>
                    new Promise((resolve) => setTimeout(resolve, 800)).then(
                        () => setOpen(false),
                    )
                }
                onClose={() => setOpen(false)}
            />
        </Section>
    );
}

function DropdownMenuDemo() {
    const [chosen, setChosen] = useState('a');
    const [checked, setChecked] = useState<string[]>(['a']);
    const toggle = (value: string) =>
        setChecked(
            checked.includes(value)
                ? checked.filter((each) => each !== value)
                : [...checked, value],
        );

    return (
        <Section
            variant="outlined"
            title="DropdownMenu"
            description="Opens from any button and marks it open. Items act on select, link somewhere, mark the chosen one with a light background, or check several without closing. A row trigger opens a menu as wide as the row."
            meta="label · trigger · wide · align · choice · DropdownItem onSelect · href · selected · asChild · DropdownCheckboxItem · RowTrigger"
            collapsible
            collapsed
            remember="docs:dropdown-menu"
        >
            <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu
                    label="Options"
                    trigger={
                        <Button variant="ghost" square title="Options">
                            <Settings />
                        </Button>
                    }
                >
                    <DropdownItem onSelect={() => notify({ title: 'Edit' })}>
                        <Pencil />
                        Edit
                    </DropdownItem>
                    <DropdownItem onSelect={() => notify({ title: 'Copy' })}>
                        <Copy />
                        Copy
                    </DropdownItem>
                    <DropdownItem href="#components">Link item</DropdownItem>
                </DropdownMenu>
                <DropdownMenu
                    label="Choose"
                    trigger={<Button variant="outline">Choose one</Button>}
                >
                    {options.map((option) => (
                        <DropdownItem
                            key={option.value}
                            selected={chosen === option.value}
                            onSelect={() => setChosen(option.value)}
                        >
                            {option.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
                <DropdownMenu
                    label="Check"
                    trigger={<Button variant="ghost">Check several</Button>}
                >
                    {options.map((option) => (
                        <DropdownCheckboxItem
                            key={option.value}
                            checked={checked.includes(option.value)}
                            onCheckedChange={() => toggle(option.value)}
                        >
                            {option.label}
                        </DropdownCheckboxItem>
                    ))}
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded border border-border bg-surface">
                <DropdownMenu
                    label="Reminder"
                    wide
                    align="start"
                    trigger={
                        <RowTrigger
                            icon={Bell}
                            label="Reminder"
                            value={
                                options.find((o) => o.value === chosen)?.label
                            }
                            set
                        />
                    }
                >
                    {options.map((option) => (
                        <DropdownItem
                            key={option.value}
                            selected={chosen === option.value}
                            onSelect={() => setChosen(option.value)}
                        >
                            {option.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </div>
        </Section>
    );
}

function HintDemo() {
    return (
        <Section
            variant="outlined"
            title="Hint"
            description="Info icon that opens a short explanation."
            meta="children"
            collapsible
            collapsed
            remember="docs:hint"
        >
            <div>
                <Hint>Short explanation in a popover.</Hint>
            </div>
        </Section>
    );
}

function ImageViewerDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Section
            variant="outlined"
            title="ImageViewer"
            description="Shows an image full screen. Tap the image to close."
            meta="src · alt · open · onClose"
            collapsible
            collapsed
            remember="docs:image-viewer"
        >
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-fit cursor-pointer"
            >
                <img
                    src={sample}
                    alt="Example"
                    className="h-[96px] w-[144px] rounded object-cover"
                />
            </button>
            <ImageViewer
                src={sample}
                alt="Example"
                open={open}
                onClose={() => setOpen(false)}
            />
        </Section>
    );
}

function BackdropDemo() {
    const [open, setOpen] = useState(false);
    const [hole, setHole] = useState<HTMLButtonElement | null>(null);

    return (
        <Section
            variant="outlined"
            title="Backdrop"
            description="Catches the first click outside floating content and closes it. With a veil, it dims the page, leaving a hole around one element."
            meta="open · onClose · veil · hole"
            collapsible
            collapsed
            remember="docs:backdrop"
        >
            <div>
                <Button
                    ref={setHole}
                    variant="outline"
                    onClick={() => setOpen(true)}
                >
                    Open
                </Button>
            </div>
            <Backdrop
                open={open}
                onClose={() => setOpen(false)}
                veil
                hole={hole}
            />
        </Section>
    );
}

function NotifyDemo() {
    return (
        <Section
            variant="outlined"
            title="notify"
            description="Toasts in every tone, with a description, an action and as a clickable toast. Needs Toaster mounted once at the root."
            meta="tone · title · description · action · onOpen"
            collapsible
            collapsed
            remember="docs:notify"
        >
            <div className="flex flex-wrap gap-3">
                {(['success', 'primary', 'warning', 'danger'] as const).map(
                    (tone) => (
                        <Button
                            key={tone}
                            variant="outline"
                            onClick={() => notify({ tone, title: tone })}
                        >
                            {tone}
                        </Button>
                    ),
                )}
            </div>
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    onClick={() =>
                        notify({
                            title: 'Title',
                            description: 'Notice description.',
                        })
                    }
                >
                    description
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        notify({
                            title: 'Title',
                            action: {
                                label: 'Undo',
                                onClick: () => notify({ title: 'Undone' }),
                            },
                        })
                    }
                >
                    action
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        notify({
                            title: 'Title',
                            onOpen: () => notify({ title: 'Opened' }),
                        })
                    }
                >
                    onOpen
                </Button>
            </div>
        </Section>
    );
}

function UseHoldDemo() {
    const [count, setCount] = useState(0);
    const hold = useHold(() => setCount(count + 1));

    return (
        <Section
            variant="outlined"
            title="useHold"
            description="Hold or right click gesture for any element: spread the handlers on it."
            meta="useHold(onHold)"
            collapsible
            collapsed
            remember="docs:use-hold"
        >
            <div className="flex items-center gap-3">
                <img
                    src={sample}
                    alt="Example"
                    draggable={false}
                    className="h-[96px] w-[144px] rounded object-cover select-none"
                    {...hold}
                />
                <span className="text-sm text-foreground-muted">
                    Held {count} times
                </span>
            </div>
        </Section>
    );
}

function UseFilePickerDemo() {
    const [files, setFiles] = useState<File[]>([]);
    const filePicker = useFilePicker(setFiles);

    return (
        <Section
            variant="outlined"
            title="useFilePicker"
            description="Opens the system file picker from any button: render the picker once and call open."
            meta="open · picker"
            collapsible
            collapsed
            remember="docs:use-file-picker"
        >
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={filePicker.open}>
                    Choose files
                </Button>
                {filePicker.picker}
                {files.length > 0 && (
                    <span className="text-sm text-foreground-muted">
                        {files.map((file) => file.name).join(', ')}
                    </span>
                )}
            </div>
        </Section>
    );
}

function MarkedButtonDemo() {
    const [chosen, setChosen] = useState('success');
    const marks = ['success', 'warning', 'danger', 'violet'] as const;

    return (
        <Section
            variant="outlined"
            title="Marked button"
            description="A button that shows the choice made in the color of what it means, such as a move in a game. The color comes from a tone or the palette."
            meta="mark · aria-pressed"
            collapsible
            collapsed
            remember="docs:marked-button"
        >
            <div className="flex flex-wrap gap-2">
                {marks.map((mark) => (
                    <Button
                        key={mark}
                        variant="outline"
                        aria-pressed={chosen === mark}
                        mark={chosen === mark ? mark : undefined}
                        onClick={() => setChosen(mark)}
                    >
                        {mark}
                    </Button>
                ))}
            </div>
        </Section>
    );
}

function IconGroupDemo() {
    return (
        <Section
            variant="outlined"
            title="IconGroup"
            description="Icon buttons side by side, as close as they get without their touch areas overlapping. The last icon lines up with the margin of the area it sits in."
            meta="className"
            collapsible
            collapsed
            remember="docs:icon-group"
        >
            <div className="flex items-center rounded border border-border px-3 py-1">
                <span className="min-w-0 flex-1 truncate">Label</span>
                <IconGroup>
                    <Button variant="ghost" square>
                        <Star />
                    </Button>
                    <Button variant="ghost" square>
                        <Bell />
                    </Button>
                    <Button variant="ghost" square>
                        <Settings />
                    </Button>
                </IconGroup>
            </div>
        </Section>
    );
}

function FloatingButtonDemo() {
    return (
        <Section
            variant="outlined"
            title="FloatingButton"
            description="The round action that floats over the page, with its shadow and bigger icon. On a screen it goes in the floating slot of PageBottom, which places it above the bar."
            meta="same props as Button"
            collapsible
            collapsed
            remember="docs:floating-button"
        >
            <div>
                <FloatingButton>
                    <Plus />
                </FloatingButton>
            </div>
        </Section>
    );
}

function TouchClassDemo() {
    return (
        <Section
            variant="outlined"
            title="touchClass"
            description="Grows the touch area of any small piece to 44 px, without changing how it looks."
            meta="touchClass"
            collapsible
            collapsed
            remember="docs:touch-class"
        >
            <div>
                <Button variant="ghost" size="sm" square className={touchClass}>
                    <Star />
                </Button>
            </div>
        </Section>
    );
}

function HighlightInputDemo() {
    const [value, setValue] = useState('Buy milk tomorrow');

    return (
        <Section
            variant="outlined"
            title="HighlightInput"
            description="A text field that colors parts of what was typed: with a frame and without."
            meta="ranges · bare · same props as the other fields"
            collapsible
            collapsed
            remember="docs:highlight-input"
        >
            <HighlightInput
                label="Label"
                value={value}
                ranges={[[9, 17]]}
                onChange={setValue}
            />
            <HighlightInput
                label="Label"
                hideLabel
                bare
                value={value}
                ranges={[[0, 3]]}
                onChange={setValue}
            />
        </Section>
    );
}

function FieldStatesDemo() {
    const [number, setNumber] = useState<number | ''>(1984);
    const [text, setText] = useState('Value');

    return (
        <Section
            variant="outlined"
            title="Field states"
            description="Every field takes the same props. FieldError is the error line on its own, and NumberInput has a frameless form with a big value and a hold that speeds up."
            meta="label · hideLabel · description · hint · optional · error · disabled · FieldError · NumberInput bare · NumberInput rush"
            collapsible
            collapsed
            remember="docs:field-states"
        >
            <Input
                label="Disabled"
                value={text}
                disabled
                onChange={(event) => setText(event.target.value)}
            />
            <Textarea
                label="Disabled"
                value={text}
                disabled
                onChange={(event) => setText(event.target.value)}
            />
            <Input
                label="Optional with a hint"
                optional
                hint="Hint text."
                value={text}
                onChange={(event) => setText(event.target.value)}
            />
            <NumberInput
                label="Disabled"
                disabled
                value={number}
                min={0}
                max={9999}
                onChange={setNumber}
            />
            <NumberInput
                label="Bare"
                hideLabel
                bare
                rush
                className="self-center"
                value={number}
                min={0}
                max={9999}
                onChange={setNumber}
            />
            <FieldError message="Error message" />
            <Field
                id="field-demo"
                label="Field around any control"
                hint="Hint text."
                description="Description."
            >
                <span id="field-demo" className="ui-note">
                    Any control.
                </span>
            </Field>
        </Section>
    );
}

function ItemTextDemo() {
    return (
        <Section
            variant="outlined"
            title="ItemText"
            description="The title and secondary line of an item, for any row or card."
            meta="title · secondary"
            collapsible
            collapsed
            remember="docs:item-text"
        >
            <ItemText title="Title" secondary="Secondary line" />
            <ItemText
                title="A title long enough that it does not fit in the available space and has to be cut"
                secondary="A secondary line long enough that it does not fit in the available space and has to be cut"
            />
        </Section>
    );
}

function PaletteDemo() {
    return (
        <Section
            variant="outlined"
            title="Palette"
            description="The colors the user picks for items, as text, border and fill with readable text."
            meta="paletteText · paletteStroke · paletteBorder · paletteFill"
            collapsible
            collapsed
            remember="docs:palette"
        >
            <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
                {paletteColors.map((color) => (
                    <div key={color} className={cn('flex flex-col gap-1')}>
                        <span
                            className={cn(
                                'truncate text-xs',
                                paletteText(color),
                            )}
                        >
                            {color}
                        </span>
                        <span
                            className={cn(
                                'h-4 rounded border',
                                paletteBorder(color),
                            )}
                        />
                        <span
                            className={cn('h-4 rounded', paletteFill(color))}
                        />
                    </div>
                ))}
            </div>
        </Section>
    );
}

function PageDemo() {
    const [footer, setFooter] = useState(false);
    const [bottom, setBottom] = useState(false);

    return (
        <Section
            variant="outlined"
            title="Page"
            description="The frame of a screen: the shell with a side bar, the content, and a footer stuck to the bottom, which tells notify how much to clear. A floating button above the bar keeps the end of the page clear and lifts notify over it too. The header comes from the app."
            meta="AppShell · Page · header · PageBottom floating · PageFooter"
            collapsible
            collapsed
            remember="docs:page"
        >
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setFooter(!footer)}>
                    Toggle PageFooter
                </Button>
                <Button variant="outline" onClick={() => setBottom(!bottom)}>
                    Toggle PageBottom
                </Button>
            </div>
            <div className="overflow-clip rounded border border-border">
                <AppShell className="min-h-0">
                    <Page
                        className="min-h-0"
                        width="column"
                        header={
                            <div className="flex w-full items-center border-b border-border px-(--gutter) py-1">
                                <h3 className="ui-page-title min-w-0 flex-1 truncate">
                                    Header of the app
                                </h3>
                                <IconGroup>
                                    <Button variant="ghost" square>
                                        <Settings />
                                    </Button>
                                </IconGroup>
                            </div>
                        }
                        bottom={
                            footer ? (
                                <PageFooter>
                                    <Button>Footer action</Button>
                                </PageFooter>
                            ) : (
                                bottom && (
                                    <PageBottom
                                        floating={
                                            <FloatingButton aria-label="Add">
                                                <Plus />
                                            </FloatingButton>
                                        }
                                        className="flex justify-center border-t border-border bg-background px-(--gutter) py-3"
                                    >
                                        <span className="ui-note">
                                            Bottom bar
                                        </span>
                                    </PageBottom>
                                )
                            )
                        }
                    >
                        <p className="ui-note">Content.</p>
                    </Page>
                </AppShell>
            </div>
        </Section>
    );
}

function ScreensDemo() {
    return (
        <Section
            variant="outlined"
            title="AuthScreen and ErrorScreen"
            description="The whole screen around a sign-in form or an error. The brand, the action and what stays behind come from the app."
            meta="brand · title · description · status · backdrop"
            collapsible
            collapsed
            remember="docs:screens"
        >
            <div className="overflow-clip rounded border border-border">
                <AuthScreen
                    className="min-h-0"
                    brand={<span className="text-5xl font-bold">Brand</span>}
                    title="Title"
                    description="Description."
                >
                    <Button>Action</Button>
                </AuthScreen>
            </div>
            <div className="overflow-clip rounded border border-border">
                <ErrorScreen
                    className="min-h-0 py-8"
                    status={404}
                    title="Title"
                    description="Description."
                >
                    <Button>Action</Button>
                </ErrorScreen>
            </div>
        </Section>
    );
}

function NavItemDemo() {
    return (
        <Section
            variant="outlined"
            title="NavItem"
            description="A row of the side navigation: a link, a button, or any element with asChild. The current page gets a light background."
            meta="active · href · onClick · asChild"
            collapsible
            collapsed
            remember="docs:nav-item"
        >
            <div className="flex max-w-xs flex-col gap-1">
                <NavItem href="#components" active>
                    <Inbox />
                    Active
                </NavItem>
                <NavItem href="#components">
                    <Star />
                    Link
                </NavItem>
                <NavItem onClick={() => {}}>
                    <Settings />
                    Button
                </NavItem>
            </div>
        </Section>
    );
}

function ContainerDemo() {
    const widths = ['narrow', 'column', 'bar', 'page', 'full'] as const;

    return (
        <Section
            variant="outlined"
            title="Container"
            description="The width of a page or column, with the side margin of the page when padded."
            meta="width · padded"
            collapsible
            collapsed
            remember="docs:container"
        >
            {widths.map((width) => (
                <Container
                    key={width}
                    width={width}
                    padded
                    className="rounded bg-surface-raised"
                >
                    <p className={caption}>{width}</p>
                </Container>
            ))}
        </Section>
    );
}

function ColumnsDemo() {
    return (
        <Section
            variant="outlined"
            title="Columns"
            description="A main column and a side column on very wide screens, one after the other below that. The side column sticks while it fits the screen."
            meta="Columns · empty · MainColumn · SideColumn"
            collapsible
            collapsed
            remember="docs:columns"
        >
            <Columns>
                <MainColumn>
                    <Surface>Main column</Surface>
                    <Surface>Main column</Surface>
                </MainColumn>
                <SideColumn>
                    <Surface>Side column</Surface>
                </SideColumn>
            </Columns>
        </Section>
    );
}

function ControlStrutDemo() {
    return (
        <Section
            variant="outlined"
            title="ControlStrut"
            description="Invisible and without width, it holds a row at the height of a control even when the row only has text or bleeding buttons."
            meta="no props"
            collapsible
            collapsed
            remember="docs:control-strut"
        >
            <div className="flex items-center gap-2 rounded border border-border px-3">
                <ControlStrut />
                <span>Row with the height of a control</span>
            </div>
        </Section>
    );
}

function SurfaceDemo() {
    const [selected, setSelected] = useState(false);

    return (
        <Section
            variant="outlined"
            title="Surface"
            description="The card: background, border, radius and inner space, with the whole block clickable when it has an action."
            meta="flush · selected · disabled · onClick · href · external · asChild"
            collapsible
            collapsed
            remember="docs:surface"
        >
            <Surface>Static</Surface>
            <Surface onClick={() => setSelected(!selected)} selected={selected}>
                Clickable, click to select
            </Surface>
            <Surface href="#components">Link</Surface>
            <Surface asChild>
                <button type="button" className="text-left">
                    Any element, with asChild
                </button>
            </Surface>
            <Surface disabled onClick={() => {}}>
                Disabled
            </Surface>
            <Surface flush>
                <List>
                    <ListItem>Flush, with a list inside</ListItem>
                </List>
            </Surface>
        </Section>
    );
}

function CoverDemo() {
    return (
        <Section
            variant="outlined"
            title="Cover"
            description="The invisible layer that makes a whole block clickable, as a link or a button. Whatever needs its own click stays above it."
            meta="href · external · onClick · className"
            collapsible
            collapsed
            remember="docs:cover"
        >
            <div className="relative rounded border border-border p-3 hover:bg-surface-hover">
                <Cover onClick={() => notify({ title: 'Clicked' })} />
                <span className="pointer-events-none relative">
                    Click anywhere
                </span>
            </div>
        </Section>
    );
}

const SORT_SCOPE_START: Record<string, string[]> = {
    today: ['Call the bank', 'Pay rent'],
    later: ['Fix the shelf'],
    empty: [],
};

function SortScopeDemo() {
    const [lists, setLists] = useState(SORT_SCOPE_START);
    const move = (move: SortMove) =>
        setLists((current) => ({
            ...Object.fromEntries(
                Object.entries(current).map(([key, ids]) => [
                    key,
                    ids.filter((id) => id !== move.id),
                ]),
            ),
            [move.to]:
                move.ids.length === 1
                    ? [
                          move.id,
                          ...current[move.to].filter((id) => id !== move.id),
                      ]
                    : move.ids,
        }));

    return (
        <Section
            variant="outlined"
            title="SortScope"
            description="Moves list items between the lists and drop zones inside the page, with a line where the item lands."
            meta="onMove · organizing · List sortList · Section sortList · DropZone"
            collapsible
            collapsed
            remember="docs:sort-scope"
        >
            <SortScope organizing onMove={move}>
                <DropZone id="empty" className="p-3">
                    <p className="ui-note">
                        Drop here to put the item first in Empty.
                    </p>
                </DropZone>
                {Object.entries(lists).map(([key, ids]) => (
                    <Section
                        key={key}
                        title={key}
                        note={ids.length}
                        sortList={key}
                        collapsible
                    >
                        <List bleed sortList={key}>
                            {ids.map((id) => (
                                <ListItem key={id} sortId={id}>
                                    {id}
                                </ListItem>
                            ))}
                        </List>
                    </Section>
                ))}
            </SortScope>
        </Section>
    );
}

function SortableDemo() {
    const [order, setOrder] = useState(['Section 1', 'Section 2', 'Section 3']);

    return (
        <Section
            variant="outlined"
            title="Sortable"
            description="Reorders the sections inside it by the handle in their left inset."
            meta="onReorder · organizing"
            collapsible
            collapsed
            remember="docs:sortable"
        >
            <Sortable organizing onReorder={setOrder}>
                {order.map((title) => (
                    <Section
                        key={title}
                        title={title}
                        sortId={title}
                        collapsible
                    >
                        <p className="ui-note">Content.</p>
                    </Section>
                ))}
            </Sortable>
        </Section>
    );
}

function ListItemStatesDemo() {
    return (
        <Section
            variant="outlined"
            title="ListItem states"
            description="An item that cannot be used now, and one whose action is running. Neither takes clicks nor opens its menu."
            meta="disabled · busy"
            collapsible
            collapsed
            remember="docs:list-item-states"
        >
            <List variant="cards">
                <ListItem disabled onClick={() => {}}>
                    <ItemText title="Disabled" secondary="Secondary line" />
                </ListItem>
                <ListItem busy onClick={() => {}}>
                    <ItemText title="Busy" secondary="Secondary line" />
                </ListItem>
            </List>
        </Section>
    );
}

function LockedModalDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Section
            variant="outlined"
            title="Modal that waits for an answer"
            description="Escape, the click outside and the close button are gone, because leaving without answering would keep others waiting. ModalCloseButton is the close button on its own, for a custom header."
            meta="dismissible · ModalCloseButton · ModalTitle · ModalHiddenDescription"
            collapsible
            collapsed
            remember="docs:locked-modal"
        >
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Open
                </Button>
                <Modal
                    trigger={
                        <Button variant="outline">With ModalCloseButton</Button>
                    }
                    mobile="dialog"
                    hideClose
                >
                    <div className="flex items-center justify-between gap-3">
                        <ModalTitle>Custom header</ModalTitle>
                        <ModalHiddenDescription>
                            Read only by screen readers.
                        </ModalHiddenDescription>
                        <ModalCloseButton />
                    </div>
                </Modal>
            </div>
            <Modal open={open} mobile="sheet" dismissible={false} title="Title">
                <p className="text-sm">Content.</p>
                <ModalFooter>
                    <Button onClick={() => setOpen(false)}>Answer</Button>
                </ModalFooter>
            </Modal>
        </Section>
    );
}

function UseModalValueDemo() {
    const [value, setValue] = useState<string | null>(null);
    const modal = useModalValue(value);

    return (
        <Section
            variant="outlined"
            title="useModalValue"
            description="Keeps showing what a modal was opened with while it closes, when the app has already cleared the value."
            meta="value · key · open"
            collapsible
            collapsed
            remember="docs:use-modal-value"
        >
            <div>
                <Button variant="outline" onClick={() => setValue('Option A')}>
                    Open
                </Button>
            </div>
            <Modal
                key={modal.key}
                open={modal.open}
                onClose={() => setValue(null)}
                mobile="dialog"
                title={modal.value}
            >
                <ModalClose asChild>
                    <Button variant="outline">Clear the value</Button>
                </ModalClose>
            </Modal>
        </Section>
    );
}

function ConfirmDialogToneDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Section
            variant="outlined"
            title="ConfirmDialog that only redoes"
            description="Red is for what destroys something. The primary tone is for what only redoes, and the cancel label can take the word of the case."
            meta="tone · cancelLabel"
            collapsible
            collapsed
            remember="docs:confirm-dialog-tone"
        >
            <div>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Open
                </Button>
            </div>
            <ConfirmDialog
                open={open}
                title="Title"
                description="Description."
                confirmLabel="Draw again"
                cancelLabel="Keep"
                tone="primary"
                onConfirm={() => setOpen(false)}
                onClose={() => setOpen(false)}
            />
        </Section>
    );
}

function PopoverDemo() {
    return (
        <Section
            variant="outlined"
            title="Popover"
            description="A floating box anchored to any element, for what is not a list of options."
            meta="Popover · PopoverTrigger · PopoverContent · align"
            collapsible
            collapsed
            remember="docs:popover"
        >
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="self-start">
                        Open
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="ui-note max-w-xs p-3">
                    Content.
                </PopoverContent>
            </Popover>
        </Section>
    );
}
