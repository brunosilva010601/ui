import {
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
import { Fragment, useState } from 'react';
import {
    AppearancePicker,
    Avatar,
    Backdrop,
    Brand,
    Button,
    Calendar,
    Badge,
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
    DropdownItem,
    DropdownMenu,
    EmptyState,
    FileInput,
    Form,
    FormActions,
    Heading,
    Hint,
    IconBadge,
    IconToggle,
    ImageViewer,
    Input,
    List,
    ListItem,
    Markdown,
    Modal,
    ModalFooter,
    MonthInput,
    notify,
    NumberInput,
    ProgressBar,
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
    useCarousel,
    useFilePicker,
    useHold,
    useOverflowing,
} from '../src';
import type {
    Appearance,
    ModalDesktop,
    ModalMobile,
    PaletteColor,
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

const emojiOptions = [
    { value: 'a', label: 'Option A', emoji: '🍎' },
    { value: 'b', label: 'Option B', emoji: '🍊' },
    { value: 'c', label: 'Option C', emoji: '🍇' },
];

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
        <div className="flex flex-col gap-lg">
            <Section title="Actions" collapsible remember="docs:actions">
                <ButtonDemo />
            </Section>
            <Section title="Choices" collapsible remember="docs:choices">
                <ButtonGroupDemo />
                <BadgeDemo />
                <IconToggleDemo />
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
                <FormDemo />
            </Section>
            <Section title="Display" collapsible remember="docs:display">
                <AvatarDemo />
                <ColorDotDemo />
                <IconBadgeDemo />
                <ProgressBarDemo />
                <HeadingDemo />
                <DetailDemo />
                <StatDemo />
                <BrandDemo />
                <EmptyStateDemo />
                <MarkdownDemo />
                <CodeBlockDemo />
                <LoadingDemo />
            </Section>
            <Section title="Structure" collapsible remember="docs:structure">
                <SectionDemo />
                <ListDemo />
                <TabsDemo />
                <CarouselDemo />
            </Section>
            <Section title="Overlays" collapsible remember="docs:overlays">
                <ModalDemo />
                <ConfirmDialogDemo />
                <DropdownMenuDemo />
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
            description="Every variant in both sizes, with text, icon and text, icon only and disabled. Without size, a link takes the size of the text around it."
            meta='variant · size · square · selected · disabled · asChild'
            collapsible
            collapsed
            remember="docs:button"
        >
            {sizes.map((size) => (
                <div
                    key={size}
                    className="flex flex-col gap-md sm:grid sm:grid-cols-5 sm:items-center sm:justify-items-center"
                >
                    <div className="sm:contents">
                        <span className={caption}>size="{size}"</span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            with icon
                        </span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            selected
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
                            className="flex flex-wrap items-center gap-sm sm:contents"
                        >
                            <Button variant={variant} size={size}>
                                {variant}
                            </Button>
                            <Button variant={variant} size={size}>
                                <Plus />
                                {variant}
                            </Button>
                            {variant === 'outline' ? (
                                <Button variant="outline" size={size} selected>
                                    {variant}
                                </Button>
                            ) : (
                                <span className="max-sm:hidden" />
                            )}
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
            <div className="flex flex-col gap-sm">
                <span className={caption}>edge cases</span>
                <div className="flex flex-wrap items-start gap-sm">
                    <Button>
                        <Plus className="size-10" />
                        Big icon
                    </Button>
                    <Button className="max-w-40 whitespace-normal">
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

function BadgeDemo() {
    return (
        <Section
            variant="outlined"
            title="Badge"
            description="Static label for a status or a count. Every tone in both sizes, with text, icon and text, and a count. Never clickable."
            meta="tone · size · count"
            collapsible
            collapsed
            remember="docs:badge"
        >
            {sizes.map((size) => (
                <div
                    key={size}
                    className="flex flex-col gap-md sm:grid sm:grid-cols-3 sm:items-center sm:justify-items-start"
                >
                    <div className="sm:contents">
                        <span className={caption}>size="{size}"</span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            with icon
                        </span>
                        <span className={cn(caption, 'max-sm:hidden')}>
                            count
                        </span>
                    </div>
                    {badgeTones.map((tone) => (
                        <div
                            key={tone}
                            className="flex flex-wrap items-center gap-sm sm:contents"
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
            meta="variant · size · iconOnly · layout · multiple · ButtonGroupItem"
            collapsible
            collapsed
            remember="docs:button-group"
        >
            {sizes.map((size) => (
                <div key={size} className="flex flex-col gap-sm">
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
            <div className="flex flex-col gap-sm">
                <span className={caption}>variant="ghost"</span>
                <ButtonGroup
                    variant="ghost"
                    layout="fill"
                    iconOnly
                    options={iconOptions}
                    value={valueOf('ghost')}
                    onChange={choose('ghost')}
                />
            </div>
            <div className="flex flex-col gap-sm">
                <span className={caption}>multiple</span>
                <ButtonGroup
                    multiple
                    options={options}
                    value={many}
                    onChange={setMany}
                />
            </div>
            <div className="flex flex-col gap-sm">
                <span className={caption}>layout="fill"</span>
                <ButtonGroup
                    layout="fill"
                    options={options}
                    value={valueOf('fill')}
                    onChange={choose('fill')}
                />
            </div>
            <div className="flex flex-col gap-sm">
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

function IconToggleDemo() {
    const [active, setActive] = useState<Record<string, boolean>>({
        stacked: true,
        inline: true,
    });
    const toggle = (key: string) => () =>
        setActive({ ...active, [key]: !active[key] });

    return (
        <Section
            variant="outlined"
            title="IconToggle"
            description="On and off button with an icon: stacked, inline and icon only, each on and off."
            meta="active · inline · iconOnly · tone"
            collapsible
            collapsed
            remember="docs:icon-toggle"
        >
            <div className="grid grid-cols-3 gap-sm sm:grid-cols-6">
                <IconToggle
                    label="Stacked"
                    tone="primary"
                    active={active.stacked}
                    onClick={toggle('stacked')}
                >
                    <Heart />
                </IconToggle>
                <IconToggle
                    label="Stacked"
                    tone="primary"
                    active={active.stackedOff}
                    onClick={toggle('stackedOff')}
                >
                    <Heart />
                </IconToggle>
                <IconToggle
                    label="Inline"
                    tone="primary"
                    inline
                    active={active.inline}
                    onClick={toggle('inline')}
                >
                    <Bell />
                </IconToggle>
                <IconToggle
                    label="Inline"
                    tone="primary"
                    inline
                    active={active.inlineOff}
                    onClick={toggle('inlineOff')}
                >
                    <Bell />
                </IconToggle>
                <IconToggle
                    label="Icon only"
                    tone="primary"
                    iconOnly
                    active={active.iconOnly}
                    onClick={toggle('iconOnly')}
                >
                    <Star />
                </IconToggle>
                <IconToggle
                    label="Icon only"
                    tone="primary"
                    iconOnly
                    active={!active.iconOnlyOff}
                    onClick={toggle('iconOnlyOff')}
                >
                    <Star />
                </IconToggle>
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
            description="Light, dark or system, each card with a preview of the theme. Saving the choice and applying the class stay in the app."
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
            description="Pick one option from a menu, or a sheet on touch screens: plain, with emoji, and with description and hint."
            meta="options · options[].emoji · description · hint"
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
                value={valueOf('emoji')}
                options={emojiOptions}
                onChange={choose('emoji')}
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
            <SearchInput value={empty} placeholder="Search" onChange={setEmpty} />
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
            <div className="grid gap-md sm:grid-cols-3">
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
            <div className="grid gap-md sm:grid-cols-2">
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
            <div className="grid grid-cols-5 items-center justify-items-start gap-md">
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
                    <Avatar key={size} name="Example" src={sample} size={size} />
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
            <div className="flex flex-wrap items-center gap-md">
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
            <div className="grid grid-cols-4 items-center justify-items-start gap-md">
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
            description="Empty, in progress and complete, green when the value reaches the maximum."
            meta="value · max"
            collapsible
            collapsed
            remember="docs:progress-bar"
        >
            <ProgressBar value={0} max={10} />
            <ProgressBar value={3} max={10} />
            <ProgressBar value={10} max={10} />
        </Section>
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
            description="Label and value pairs, stacked or inline, with Copyable for selectable text."
            meta="label · inline · Copyable"
            collapsible
            collapsed
            remember="docs:detail"
        >
            <dl className="grid grid-cols-2 gap-md">
                <Detail label="Label">Value</Detail>
                <Detail label="Copyable">
                    <Copyable>
                        <span>ABC-123</span>
                    </Copyable>
                </Detail>
            </dl>
            <dl className="grid grid-cols-[auto_1fr] gap-x-lg gap-y-sm">
                <Detail label="Label" inline>
                    Value
                </Detail>
                <Detail label="Other label" inline>
                    Other value
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
            <div className="flex flex-wrap items-end gap-lg">
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
            description="Placeholder for empty lists and pages, with and without an action."
            meta="icon · title · description · action"
            collapsible
            collapsed
            remember="docs:empty-state"
        >
            <div className="grid gap-md sm:grid-cols-2">
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
                code={'.card {\n    padding: var(--padding-md);\n}'}
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
            meta='Spinner · Skeleton shape · SectionSkeleton'
            collapsible
            collapsed
            remember="docs:loading"
        >
            <Spinner />
            <div className="flex items-center gap-md">
                <Skeleton shape="avatar" />
                <div className="flex flex-1 flex-col gap-sm">
                    <Skeleton shape="title" className="w-1/2" />
                    <Skeleton shape="line" />
                    <Skeleton shape="line" className="w-3/4" />
                </div>
            </div>
            <Skeleton className="h-16 rounded" />
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
            meta="variant · title · description · meta · icon · note · hint · menu · collapsible · collapsed · remember · onClick · href"
            collapsible
            collapsed
            remember="docs:section"
        >
            <Section title="Flat" description="No border, on the page background.">
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
            meta="List variant · bleed · columns · horizontal · ListItem onClick · href · external · active · selected · menu"
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
                        menu={{ label: 'Options', items: menuItems, hover: true }}
                    >
                        <span className="flex-1 text-sm">
                            Menu on hover
                        </span>
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
                className="flex h-28 w-40 items-center justify-center rounded border border-border bg-control"
            >
                <Image className="size-icon-lg text-foreground-faint" />
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
                <CarouselTrack control={many} className="gap-sm">
                    {slides(10)}
                </CarouselTrack>
            </CarouselFrame>
            <div className="rounded bg-surface-raised p-md">
                <CarouselFrame control={raised} arrows={raisedOverflowing}>
                    <CarouselTrack control={raised} className="gap-sm">
                        {slides(10)}
                    </CarouselTrack>
                </CarouselFrame>
            </div>
            <CarouselFrame control={few} arrows={fewOverflowing}>
                <CarouselTrack control={few} className="gap-sm">
                    {slides(2)}
                </CarouselTrack>
            </CarouselFrame>
        </Section>
    );
}

const modalCases: {
    label: string;
    mobile?: ModalMobile;
    desktop?: ModalDesktop;
}[] = [
    { label: 'dialog' },
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
            <div className="flex flex-wrap gap-md">
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
            description="Asks before a destructive action. Keeps the button disabled while the promise returned by onConfirm runs."
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
    return (
        <Section
            variant="outlined"
            title="DropdownMenu"
            description="Menu from every kind of trigger, with button and link items."
            meta="label · variant · trigger · align · DropdownItem asChild · href"
            collapsible
            collapsed
            remember="docs:dropdown-menu"
        >
            <div className="flex flex-wrap items-center gap-md">
                <DropdownMenu label="Options" trigger={<Settings />}>
                    <DropdownItem asChild>
                        <button
                            type="button"
                            onClick={() => notify({ title: 'Edit' })}
                        >
                            <Pencil />
                            Edit
                        </button>
                    </DropdownItem>
                    <DropdownItem asChild>
                        <button
                            type="button"
                            onClick={() => notify({ title: 'Copy' })}
                        >
                            <Copy />
                            Copy
                        </button>
                    </DropdownItem>
                    <DropdownItem href="#components">Link item</DropdownItem>
                </DropdownMenu>
                <DropdownMenu label="Options" variant="button" trigger="button">
                    <DropdownItem asChild>
                        <button type="button">Item 1</button>
                    </DropdownItem>
                    <DropdownItem asChild>
                        <button type="button">Item 2</button>
                    </DropdownItem>
                </DropdownMenu>
                <DropdownMenu
                    label="Options"
                    variant="chip"
                    trigger={<span>chip</span>}
                >
                    <DropdownItem asChild>
                        <button type="button">Item 1</button>
                    </DropdownItem>
                    <DropdownItem asChild>
                        <button type="button">Item 2</button>
                    </DropdownItem>
                </DropdownMenu>
            </div>
            <DropdownMenu
                label="Options"
                variant="field"
                align="start"
                trigger={<span className="flex-1">field</span>}
            >
                <DropdownItem asChild>
                    <button type="button">Item 1</button>
                </DropdownItem>
                <DropdownItem asChild>
                    <button type="button">Item 2</button>
                </DropdownItem>
            </DropdownMenu>
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
                    className="h-24 w-36 rounded object-cover"
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

    return (
        <Section
            variant="outlined"
            title="Backdrop"
            description="Dims the page behind floating content and closes when clicked."
            meta="open · onClose"
            collapsible
            collapsed
            remember="docs:backdrop"
        >
            <div>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Open
                </Button>
            </div>
            <Backdrop open={open} onClose={() => setOpen(false)} />
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
            <div className="flex flex-wrap gap-md">
                {(['success', 'info', 'warning', 'error'] as const).map(
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
            <div className="flex flex-wrap gap-md">
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
            <div className="flex items-center gap-md">
                <img
                    src={sample}
                    alt="Example"
                    draggable={false}
                    className="h-24 w-36 rounded object-cover select-none"
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
            <div className="flex flex-wrap items-center gap-md">
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
