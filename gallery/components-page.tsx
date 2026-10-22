import {
    Bell,
    Copy,
    FolderOpen,
    Heart,
    Image,
    Inbox,
    Pencil,
    Plus,
    Settings,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
    Avatar,
    Backdrop,
    Brand,
    Button,
    Calendar,
    CarouselFrame,
    Chip,
    ChipGroup,
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
    HeldMenu,
    Hint,
    IconBadge,
    IconToggle,
    ImageViewer,
    Input,
    layerRowClass,
    List,
    Markdown,
    Modal,
    ModalFooter,
    MonthInput,
    notify,
    NumberInput,
    ProgressBar,
    RemoveButton,
    SearchInput,
    Section,
    SectionSkeleton,
    Select,
    Skeleton,
    Spinner,
    Stat,
    staticRowClass,
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
import type { PaletteColor } from '../src';

const today = new Date().toISOString().slice(0, 10);

const sample =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/></svg>',
    );

const buttonVariants = [
    'primary',
    'outline',
    'ghost',
    'danger',
    'link',
    'inline',
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

const dotColors: PaletteColor[] = [
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

export function ComponentsPage() {
    return (
        <div className="flex flex-col gap-lg">
            <Section title="Actions" collapsible remember="docs:actions">
                <ButtonDemo />
                <RemoveButtonDemo />
            </Section>
            <Section title="Choices" collapsible remember="docs:choices">
                <ChipDemo />
                <ChipGroupDemo />
                <IconToggleDemo />
                <SwitchDemo />
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
                <HeldMenuDemo />
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
            description="Main action control, also usable as a link with asChild."
            collapsible
            collapsed
            remember="docs:button"
        >
            <Section
                variant="outlined"
                title="Variants"
                description="Each variant sets the weight of the action."
                meta='variant="primary" | "outline" | "ghost" | "danger" | "link" | "inline"'
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    {buttonVariants.map((variant) => (
                        <Button key={variant} variant={variant}>
                            {variant}
                        </Button>
                    ))}
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Small"
                description="Compact size for dense places."
                meta='size="sm"'
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    {buttonVariants.map((variant) => (
                        <Button key={variant} variant={variant} size="sm">
                            {variant}
                        </Button>
                    ))}
                </div>
            </Section>
            <Section
                variant="outlined"
                title="With icon"
                description="Icons go inside children, before the text."
                meta="children"
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    <Button>
                        <Plus />
                        Label
                    </Button>
                    <Button variant="outline">
                        <Settings />
                        Label
                    </Button>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Icon only"
                description="Square button for a single icon, labelled for screen readers."
                meta="square · aria-label"
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    <Button square aria-label="Add">
                        <Plus />
                    </Button>
                    <Button variant="outline" square aria-label="Settings">
                        <Settings />
                    </Button>
                    <Button variant="ghost" square aria-label="Notifications">
                        <Bell />
                    </Button>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Disabled"
                description="Blocks the action and fades the button."
                meta="disabled"
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    <Button disabled>primary</Button>
                    <Button variant="outline" disabled>
                        outline
                    </Button>
                </div>
            </Section>
        </Section>
    );
}

function RemoveButtonDemo() {
    return (
        <Section
            variant="outlined"
            title="RemoveButton"
            description="Ghost button with a trash icon for removing an item."
            collapsible
            collapsed
            remember="docs:remove-button"
        >
            <Section
                variant="outlined"
                title="Default"
                description="The label is read by screen readers."
                meta="label · onClick"
                collapsible
            >
                <div>
                    <RemoveButton
                        label="Remove"
                        onClick={() => notify({ title: 'Removed' })}
                    />
                </div>
            </Section>
        </Section>
    );
}

function ChipDemo() {
    return (
        <Section
            variant="outlined"
            title="Chip"
            description="Small tag for a status, a count or a quick action."
            collapsible
            collapsed
            remember="docs:chip"
        >
            <Section
                variant="outlined"
                title="Tones"
                description="Neutral by default, accent to highlight, selected for the chosen one."
                meta='tone="neutral" | "accent" | "selected"'
                collapsible
            >
                <div className="flex flex-wrap items-center gap-sm">
                    <Chip>neutral</Chip>
                    <Chip tone="accent">accent</Chip>
                    <Chip tone="selected">selected</Chip>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Small and counts"
                description="Compact size, and a tabular style for numbers."
                meta='size="sm" · count'
                collapsible
            >
                <div className="flex flex-wrap items-center gap-sm">
                    <Chip size="sm">sm</Chip>
                    <Chip size="sm" tone="accent">
                        <Star />
                        sm
                    </Chip>
                    <Chip count>12</Chip>
                    <Chip size="sm" count>
                        3
                    </Chip>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Clickable"
                description="Turns the chip into a button."
                meta="onClick"
                collapsible
            >
                <div className="flex flex-wrap items-center gap-sm">
                    <Chip onClick={() => notify({ title: 'Clicked' })}>
                        Label
                    </Chip>
                </div>
            </Section>
        </Section>
    );
}

function ChipGroupDemo() {
    const [pill, setPill] = useState('a');
    const [ghost, setGhost] = useState('b');
    const [icon, setIcon] = useState('a');
    const [fill, setFill] = useState('c');
    const [many, setMany] = useState<string[]>(['a', 'c']);

    return (
        <Section
            variant="outlined"
            title="ChipGroup"
            description="Row of chips to pick one option, or several."
            collapsible
            collapsed
            remember="docs:chip-group"
        >
            <Section
                variant="outlined"
                title="Pill"
                description="Bordered pills, the selected one filled."
                meta='variant="pill"'
                collapsible
            >
                <ChipGroup
                    variant="pill"
                    options={options}
                    value={pill}
                    onChange={setPill}
                />
            </Section>
            <Section
                variant="outlined"
                title="Ghost"
                description="No border, soft background on the selected option."
                meta='variant="ghost"'
                collapsible
            >
                <ChipGroup
                    variant="ghost"
                    options={options}
                    value={ghost}
                    onChange={setGhost}
                />
            </Section>
            <Section
                variant="outlined"
                title="Icons only"
                description="Round icon buttons, the text becomes the accessible name."
                meta='variant="icon" · iconOnly'
                collapsible
            >
                <ChipGroup
                    variant="icon"
                    iconOnly
                    options={iconOptions}
                    value={icon}
                    onChange={setIcon}
                />
            </Section>
            <Section
                variant="outlined"
                title="Full width"
                description="Options split the available width equally."
                meta='layout="fill"'
                collapsible
            >
                <ChipGroup
                    layout="fill"
                    options={options}
                    value={fill}
                    onChange={setFill}
                />
            </Section>
            <Section
                variant="outlined"
                title="Multiple"
                description="Any number of options can be selected."
                meta='multiple · layout="wrap"'
                collapsible
            >
                <ChipGroup
                    multiple
                    layout="wrap"
                    options={options}
                    value={many}
                    onChange={setMany}
                />
            </Section>
        </Section>
    );
}

function IconToggleDemo() {
    const [stacked, setStacked] = useState(true);
    const [inline, setInline] = useState(true);
    const [iconOnly, setIconOnly] = useState(false);

    return (
        <Section
            variant="outlined"
            title="IconToggle"
            description="On and off button with an icon and a label."
            collapsible
            collapsed
            remember="docs:icon-toggle"
        >
            <Section
                variant="outlined"
                title="Stacked"
                description="Icon above the label."
                meta="active · onClick"
                collapsible
            >
                <div className="grid grid-cols-3 gap-sm">
                    <IconToggle
                        label="Label"
                        tone="primary"
                        active={stacked}
                        onClick={() => setStacked(!stacked)}
                    >
                        <Heart />
                    </IconToggle>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Inline"
                description="Icon beside the label."
                meta="inline"
                collapsible
            >
                <div className="grid grid-cols-3 gap-sm">
                    <IconToggle
                        label="Label"
                        tone="primary"
                        inline
                        active={inline}
                        onClick={() => setInline(!inline)}
                    >
                        <Bell />
                    </IconToggle>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Icon only"
                description="Square, the label is only for screen readers."
                meta="iconOnly"
                collapsible
            >
                <div className="grid grid-cols-6 gap-sm">
                    <IconToggle
                        label="Label"
                        tone="primary"
                        iconOnly
                        active={iconOnly}
                        onClick={() => setIconOnly(!iconOnly)}
                    >
                        <Star />
                    </IconToggle>
                </div>
            </Section>
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
            description="On and off setting with a label."
            collapsible
            collapsed
            remember="docs:switch"
        >
            <Section
                variant="outlined"
                title="With description"
                description="Supporting text under the label."
                meta="label · description · checked · onChange"
                collapsible
            >
                <Switch
                    label="Label"
                    description="Supporting text."
                    checked={described}
                    onChange={setDescribed}
                />
            </Section>
            <Section
                variant="outlined"
                title="Label only"
                description="Just the label and the switch."
                meta="label"
                collapsible
            >
                <Switch label="Label" checked={plain} onChange={setPlain} />
            </Section>
        </Section>
    );
}

function InputDemo() {
    return (
        <Section
            variant="outlined"
            title="Input"
            description="Single line text field with label, help and error."
            collapsible
            collapsed
            remember="docs:input"
        >
            <Section
                variant="outlined"
                title="Default"
                description="Label above, placeholder inside."
                meta="label · placeholder"
                collapsible
            >
                <Input label="Label" placeholder="Placeholder" />
            </Section>
            <Section
                variant="outlined"
                title="With description"
                description="Supporting text under the field."
                meta="description"
                collapsible
            >
                <Input label="Label" description="Supporting text." />
            </Section>
            <Section
                variant="outlined"
                title="Optional with hint"
                description="Marks the field as optional and adds an info popover."
                meta="optional · hint"
                collapsible
            >
                <Input label="Label" optional hint="Short explanation." />
            </Section>
            <Section
                variant="outlined"
                title="Error"
                description="Red border and the message under the field."
                meta="error"
                collapsible
            >
                <Input label="Label" error="Error message." />
            </Section>
            <Section
                variant="outlined"
                title="Hidden label"
                description="The label stays only for screen readers."
                meta="hideLabel"
                collapsible
            >
                <Input label="Label" hideLabel placeholder="Placeholder" />
            </Section>
        </Section>
    );
}

function TextareaDemo() {
    return (
        <Section
            variant="outlined"
            title="Textarea"
            description="Multi line text field that grows with the content."
            collapsible
            collapsed
            remember="docs:textarea"
        >
            <Section
                variant="outlined"
                title="Medium"
                description="Default height range."
                meta='size="md"'
                collapsible
            >
                <Textarea label="Label" size="md" placeholder="Placeholder" />
            </Section>
            <Section
                variant="outlined"
                title="Large"
                description="Taller, for long texts."
                meta='size="lg"'
                collapsible
            >
                <Textarea label="Label" size="lg" />
            </Section>
            <Section
                variant="outlined"
                title="Error"
                description="Red border and the message under the field."
                meta="error"
                collapsible
            >
                <Textarea label="Label" error="Error message." />
            </Section>
        </Section>
    );
}

function SelectDemo() {
    const [plain, setPlain] = useState('a');
    const [emoji, setEmoji] = useState('b');
    const [described, setDescribed] = useState('c');

    return (
        <Section
            variant="outlined"
            title="Select"
            description="Pick one option from a menu, or a sheet on touch screens."
            collapsible
            collapsed
            remember="docs:select"
        >
            <Section
                variant="outlined"
                title="Default"
                description="Label and a list of options."
                meta="options · value · onChange"
                collapsible
            >
                <Select
                    label="Label"
                    value={plain}
                    options={options}
                    onChange={setPlain}
                />
            </Section>
            <Section
                variant="outlined"
                title="With emoji"
                description="Each option can show an emoji before the text."
                meta="options[].emoji"
                collapsible
            >
                <Select
                    label="Label"
                    value={emoji}
                    options={emojiOptions}
                    onChange={setEmoji}
                />
            </Section>
            <Section
                variant="outlined"
                title="With description and hint"
                description="Supporting text and an info popover."
                meta="description · hint"
                collapsible
            >
                <Select
                    label="Label"
                    description="Supporting text."
                    hint="Short explanation."
                    value={described}
                    options={options}
                    onChange={setDescribed}
                />
            </Section>
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
            description="Search field with icon and a clear button."
            collapsible
            collapsed
            remember="docs:search-input"
        >
            <Section
                variant="outlined"
                title="Empty"
                description="Shows the placeholder."
                meta="value · placeholder · onChange"
                collapsible
            >
                <SearchInput
                    value={empty}
                    placeholder="Search"
                    onChange={setEmpty}
                />
            </Section>
            <Section
                variant="outlined"
                title="Filled"
                description="The clear button appears with text."
                meta="onClear"
                collapsible
            >
                <SearchInput
                    value={filled}
                    placeholder="Search"
                    onChange={setFilled}
                    onClear={() => notify({ title: 'Cleared' })}
                />
            </Section>
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
            description="Number field with minus and plus, hold to repeat."
            collapsible
            collapsed
            remember="docs:number-input"
        >
            <Section
                variant="outlined"
                title="Range"
                description="Stops at the minimum and the maximum."
                meta="min · max"
                collapsible
            >
                <NumberInput
                    label="Label"
                    value={plain}
                    min={0}
                    max={10}
                    onChange={setPlain}
                />
            </Section>
            <Section
                variant="outlined"
                title="Leading zeros"
                description="Pads the value to a fixed number of digits."
                meta="pad"
                collapsible
            >
                <NumberInput
                    label="Label"
                    value={padded}
                    min={0}
                    max={99}
                    pad={2}
                    onChange={setPadded}
                />
            </Section>
            <Section
                variant="outlined"
                title="Steps that wrap"
                description="Moves in steps and goes back to the start after the end."
                meta="step · wrap"
                collapsible
            >
                <NumberInput
                    label="Label"
                    value={wrapped}
                    min={0}
                    max={59}
                    step={5}
                    pad={2}
                    wrap
                    onChange={setWrapped}
                />
            </Section>
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
            description="Month and year stepper, tap the value to pick a year."
            collapsible
            collapsed
            remember="docs:month-input"
        >
            <Section
                variant="outlined"
                title="Month"
                description="Steps month by month."
                meta="value · min · onChange"
                collapsible
            >
                <MonthInput
                    label="Label"
                    value={month}
                    min={{ year: 2020, month: 1 }}
                    onChange={setMonth}
                />
            </Section>
            <Section
                variant="outlined"
                title="Year"
                description="Steps year by year."
                meta="yearOnly"
                collapsible
            >
                <MonthInput
                    label="Label"
                    yearOnly
                    value={year}
                    min={{ year: 2020, month: 1 }}
                    onChange={setYear}
                />
            </Section>
        </Section>
    );
}

function CalendarDemo() {
    const [date, setDate] = useState(today);

    return (
        <Section
            variant="outlined"
            title="Calendar"
            description="Month grid to pick a day, in the locale and week start of UiProvider."
            collapsible
            collapsed
            remember="docs:calendar"
        >
            <Section
                variant="outlined"
                title="Marked days and minimum"
                description="Days before the minimum are disabled, marked days get a tint."
                meta="today · min · marked"
                collapsible
            >
                <Calendar
                    value={date}
                    today={today}
                    min={today}
                    marked={(day) => day.endsWith('-15') || day.endsWith('-28')}
                    onChange={setDate}
                />
            </Section>
        </Section>
    );
}

function CodeInputDemo() {
    return (
        <Section
            variant="outlined"
            title="CodeInput"
            description="One time code field, one box per digit."
            collapsible
            collapsed
            remember="docs:code-input"
        >
            <Section
                variant="outlined"
                title="Default"
                description="Digits only, pasting fills every box."
                meta="label · name"
                collapsible
            >
                <CodeInput label="Label" name="code" />
            </Section>
            <Section
                variant="outlined"
                title="Error"
                description="Red border and the message under the field."
                meta="error"
                collapsible
            >
                <CodeInput label="Label" name="code-error" error="Error message." />
            </Section>
        </Section>
    );
}

function ColorPickerDemo() {
    const [color, setColor] = useState<PaletteColor | null>('sky');

    return (
        <Section
            variant="outlined"
            title="ColorPicker"
            description="Pick one color of the palette, or none."
            collapsible
            collapsed
            remember="docs:color-picker"
        >
            <Section
                variant="outlined"
                title="Default"
                description="The none option uses its own label."
                meta="value · noneLabel · onChange"
                collapsible
            >
                <ColorPicker
                    label="Label"
                    noneLabel="None"
                    value={color}
                    onChange={setColor}
                />
            </Section>
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
            description="Drop area for a single file."
            collapsible
            collapsed
            remember="docs:file-input"
        >
            <Section
                variant="outlined"
                title="Default"
                description="Shows the file name once chosen."
                meta="file · onChange"
                collapsible
            >
                <FileInput label="Label" file={file} onChange={setFile} />
            </Section>
            <Section
                variant="outlined"
                title="Accepted types and error"
                description="Lists the accepted types and shows the error."
                meta="accept · error"
                collapsible
            >
                <FileInput
                    label="Label"
                    accept=".pdf,.png"
                    error="Error message."
                    file={typed}
                    onChange={setTyped}
                />
            </Section>
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
            description="Form with consistent spacing, submit buttons find it on their own."
            collapsible
            collapsed
            remember="docs:form"
        >
            <Section
                variant="outlined"
                title="Stacked actions"
                description="Full width buttons under the fields."
                meta="FormActions"
                collapsible
            >
                <Form onSubmit={submit}>
                    <Input label="Label" />
                    <FormActions>
                        <Button type="submit">Submit</Button>
                        <Button variant="ghost">Secondary</Button>
                    </FormActions>
                </Form>
            </Section>
            <Section
                variant="outlined"
                title="Inline actions"
                description="Buttons side by side."
                meta="FormActions inline"
                collapsible
            >
                <Form onSubmit={submit}>
                    <FormActions inline>
                        <Button type="submit">Submit</Button>
                        <span className="text-sm text-foreground-muted">
                            Submitted {sent} times
                        </span>
                    </FormActions>
                </Form>
            </Section>
        </Section>
    );
}

function AvatarDemo() {
    return (
        <Section
            variant="outlined"
            title="Avatar"
            description="Round picture of a person, or the first letter of the name."
            collapsible
            collapsed
            remember="docs:avatar"
        >
            <Section
                variant="outlined"
                title="Sizes"
                description="From 24 to 48 pixels."
                meta='size="xs" | "sm" | "md" | "lg"'
                collapsible
            >
                <div className="flex flex-wrap items-end gap-md">
                    {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                        <Avatar key={size} name="Example" size={size} />
                    ))}
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Picture"
                description="Uses the image instead of the letter."
                meta="src"
                collapsible
            >
                <div>
                    <Avatar name="Example" src={sample} size="md" />
                </div>
            </Section>
        </Section>
    );
}

function ColorDotDemo() {
    return (
        <Section
            variant="outlined"
            title="ColorDot"
            description="Small dot in a palette color."
            collapsible
            collapsed
            remember="docs:color-dot"
        >
            <Section
                variant="outlined"
                title="Colors and muted"
                description="Any palette color, or the muted gray."
                meta="color · muted"
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    {dotColors.map((color) => (
                        <ColorDot key={color} color={color} />
                    ))}
                    <ColorDot color={null} muted />
                </div>
            </Section>
        </Section>
    );
}

function IconBadgeDemo() {
    return (
        <Section
            variant="outlined"
            title="IconBadge"
            description="Icon inside a tinted circle."
            collapsible
            collapsed
            remember="docs:icon-badge"
        >
            <Section
                variant="outlined"
                title="Sizes"
                description="Small, medium and large."
                meta='size="sm" | "md" | "lg"'
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                        <IconBadge key={size} icon={Bell} size={size} />
                    ))}
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Colors"
                description="Any palette color, primary by default."
                meta="color"
                collapsible
            >
                <div className="flex flex-wrap items-center gap-md">
                    <IconBadge icon={Heart} color="rose" />
                    <IconBadge icon={Star} color="amber" />
                    <IconBadge icon={Settings} color="emerald" />
                </div>
            </Section>
        </Section>
    );
}

function ProgressBarDemo() {
    return (
        <Section
            variant="outlined"
            title="ProgressBar"
            description="Thin bar for progress, green when complete."
            collapsible
            collapsed
            remember="docs:progress-bar"
        >
            <Section
                variant="outlined"
                title="In progress"
                description="Filled in proportion to the value."
                meta="value · max"
                collapsible
            >
                <ProgressBar value={3} max={10} />
            </Section>
            <Section
                variant="outlined"
                title="Complete"
                description="Turns green when the value reaches the maximum."
                meta="value = max"
                collapsible
            >
                <ProgressBar value={10} max={10} />
            </Section>
        </Section>
    );
}

function HeadingDemo() {
    return (
        <Section
            variant="outlined"
            title="Heading"
            description="Title with optional description and meta lines."
            collapsible
            collapsed
            remember="docs:heading"
        >
            <Section
                variant="outlined"
                title="Title and description"
                description="The usual pair."
                meta="title · description"
                collapsible
            >
                <Heading title="Title" description="Short description." />
            </Section>
            <Section
                variant="outlined"
                title="With meta"
                description="A third line in code font."
                meta="meta"
                collapsible
            >
                <Heading
                    title="Title"
                    description="Short description."
                    meta='prop="value"'
                />
            </Section>
        </Section>
    );
}

function DetailDemo() {
    return (
        <Section
            variant="outlined"
            title="Detail"
            description="Label and value pair for description lists, with Copyable for selectable text."
            collapsible
            collapsed
            remember="docs:detail"
        >
            <Section
                variant="outlined"
                title="Stacked"
                description="Label above the value."
                meta="label · children"
                collapsible
            >
                <dl className="grid grid-cols-2 gap-md">
                    <Detail label="Label">Value</Detail>
                    <Detail label="Copyable">
                        <Copyable>
                            <span>ABC-123</span>
                        </Copyable>
                    </Detail>
                </dl>
            </Section>
            <Section
                variant="outlined"
                title="Inline"
                description="Label and value side by side in a two column grid."
                meta="inline"
                collapsible
            >
                <dl className="grid grid-cols-[auto_1fr] gap-x-lg gap-y-sm">
                    <Detail label="Label" inline>
                        Value
                    </Detail>
                    <Detail label="Other label" inline>
                        Other value
                    </Detail>
                </dl>
            </Section>
        </Section>
    );
}

function StatDemo() {
    return (
        <Section
            variant="outlined"
            title="Stat"
            description="Number with a label, optionally a link."
            collapsible
            collapsed
            remember="docs:stat"
        >
            <Section
                variant="outlined"
                title="Sizes and link"
                description="Medium, large, and a stat that navigates."
                meta='size="md" | "lg" · href'
                collapsible
            >
                <div className="grid grid-cols-3 divide-x divide-border rounded border border-border bg-surface">
                    <Stat value={12} label="Medium" />
                    <Stat value={48} label="Large" size="lg" />
                    <Stat value={3} label="Link" href="#components" />
                </div>
            </Section>
        </Section>
    );
}

function BrandDemo() {
    return (
        <Section
            variant="outlined"
            title="Brand"
            description="Logo and name of the app, linking home."
            collapsible
            collapsed
            remember="docs:brand"
        >
            <Section
                variant="outlined"
                title="Sizes"
                description="Small for bars, large for sign in pages."
                meta='size="sm" | "md" | "lg" · name · logo · href'
                collapsible
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
        </Section>
    );
}

function EmptyStateDemo() {
    return (
        <Section
            variant="outlined"
            title="EmptyState"
            description="Placeholder for lists and pages with nothing to show."
            collapsible
            collapsed
            remember="docs:empty-state"
        >
            <Section
                variant="outlined"
                title="With action"
                description="Invites the first step."
                meta="description · action"
                collapsible
            >
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
            </Section>
            <Section
                variant="outlined"
                title="Title only"
                description="Icon and title."
                meta="icon · title"
                collapsible
            >
                <EmptyState icon={Inbox} title="Title" />
            </Section>
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
            description="Renders markdown with checklists, tables and code blocks."
            collapsible
            collapsed
            remember="docs:markdown"
        >
            <Section
                variant="outlined"
                title="Checkable items"
                description="Clicking a checkbox reports its line."
                meta='size="md" · onToggle'
                collapsible
            >
                <Markdown size="md" onToggle={toggle}>
                    {text}
                </Markdown>
            </Section>
            <Section
                variant="outlined"
                title="Small"
                description="Default size, read only."
                meta='size="sm"'
                collapsible
            >
                <Markdown size="sm">{markdown}</Markdown>
            </Section>
        </Section>
    );
}

function CodeBlockDemo() {
    return (
        <Section
            variant="outlined"
            title="CodeBlock"
            description="Formatted code with highlighting that follows the theme."
            collapsible
            collapsed
            remember="docs:code-block"
        >
            <Section
                variant="outlined"
                title="TypeScript"
                description="The default language."
                meta="code"
                collapsible
            >
                <CodeBlock code={snippet} />
            </Section>
            <Section
                variant="outlined"
                title="Other language"
                description="Any language bundled with Prism."
                meta='language="css"'
                collapsible
            >
                <CodeBlock
                    language="css"
                    code={'.card {\n    padding: var(--padding-md);\n}'}
                />
            </Section>
        </Section>
    );
}

function LoadingDemo() {
    return (
        <Section
            variant="outlined"
            title="Spinner and Skeleton"
            description="Loading indicators."
            collapsible
            collapsed
            remember="docs:loading"
        >
            <Section
                variant="outlined"
                title="Spinner"
                description="Small spinning icon."
                meta="Spinner"
                collapsible
            >
                <Spinner />
            </Section>
            <Section
                variant="outlined"
                title="Skeleton shapes"
                description="Pulsing placeholders shaped like the content."
                meta='shape="title" | "line" | "fill" | "avatar"'
                collapsible
            >
                <div className="flex flex-col gap-sm">
                    <Skeleton shape="title" className="w-1/2" />
                    <Skeleton shape="line" />
                    <Skeleton shape="line" className="w-3/4" />
                    <Skeleton className="h-16 rounded" />
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Section placeholder"
                description="Ready made skeleton of a section row."
                meta="SectionSkeleton"
                collapsible
            >
                <SectionSkeleton />
            </Section>
        </Section>
    );
}

function SectionDemo() {
    return (
        <Section
            variant="outlined"
            title="Section"
            description="Block with header and content. This whole page is built with it."
            collapsible
            collapsed
            remember="docs:section"
        >
            <Section
                variant="outlined"
                title="Flat"
                description="No border, for grouping on the page background."
                meta='variant="flat" · title · description'
                collapsible
            >
                <Section title="Title" description="Section description.">
                    <p className="text-sm">Content.</p>
                </Section>
            </Section>
            <Section
                variant="outlined"
                title="Outlined with extras"
                description="Icon, count, info popover and a menu on hold or right click."
                meta='variant="outlined" · icon · note · hint · menu'
                collapsible
            >
                <Section
                    variant="outlined"
                    title="Title"
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
            </Section>
            <Section
                variant="outlined"
                title="Collapsible"
                description="Opens and closes from the header, can start closed and remember its state."
                meta="collapsible · collapsed · remember"
                collapsible
            >
                <Section variant="outlined" title="Title" collapsible collapsed>
                    <p className="text-sm">Content.</p>
                </Section>
                <Section title="Title" note={2} collapsible>
                    <p className="text-sm">Content.</p>
                </Section>
            </Section>
            <Section
                variant="outlined"
                title="Clickable"
                description="The whole section acts as a button or a link."
                meta="onClick · href"
                collapsible
            >
                <Section
                    variant="outlined"
                    title="Title"
                    description="Section description."
                    onClick={() => notify({ title: 'Clicked' })}
                />
            </Section>
        </Section>
    );
}

function ListDemo() {
    const items = ['Item 1', 'Item 2', 'Item 3'];

    return (
        <Section
            variant="outlined"
            title="List"
            description="List with dividers, rows styled by the row classes."
            collapsible
            collapsed
            remember="docs:list"
        >
            <Section
                variant="outlined"
                title="Rows"
                description="Divided rows with the static row style."
                meta="staticRowClass"
                collapsible
            >
                <div className="rounded border border-border bg-surface">
                    <List>
                        {items.map((item) => (
                            <li key={item} className={staticRowClass}>
                                <ColorDot color="sky" />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </List>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Columns"
                description="Two columns on wide screens."
                meta="columns"
                collapsible
            >
                <div className="overflow-hidden rounded border border-border bg-surface">
                    <List columns>
                        {[...items, 'Item 4'].map((item) => (
                            <li key={item} className={staticRowClass}>
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </List>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Horizontal"
                description="Items side by side with vertical dividers."
                meta="horizontal"
                collapsible
            >
                <div className="rounded border border-border bg-surface">
                    <List horizontal>
                        {items.map((item) => (
                            <li key={item} className={staticRowClass}>
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </List>
                </div>
            </Section>
        </Section>
    );
}

function TabsDemo() {
    const [full, setFull] = useState('a');
    const [fit, setFit] = useState('b');

    return (
        <Section
            variant="outlined"
            title="Tabs"
            description="Switch between views, scrolls when the tabs do not fit."
            collapsible
            collapsed
            remember="docs:tabs"
        >
            <Section
                variant="outlined"
                title="Full width"
                description="Tabs share the width."
                meta="Tabs · TabsList · TabsTrigger"
                collapsible
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
            </Section>
            <Section
                variant="outlined"
                title="Fit"
                description="Shrinks to the content on wide screens."
                meta="TabsList fit"
                collapsible
            >
                <Tabs value={fit} onValueChange={setFit}>
                    <TabsList fit>
                        {options.map((option) => (
                            <TabsTrigger key={option.value} value={option.value}>
                                {option.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </Section>
        </Section>
    );
}

function CarouselDemo() {
    const control = useCarousel();
    const overflowing = useOverflowing(control);

    return (
        <Section
            variant="outlined"
            title="CarouselFrame"
            description="Horizontal scroller with arrows on hover, driven by useCarousel."
            collapsible
            collapsed
            remember="docs:carousel"
        >
            <Section
                variant="outlined"
                title="With arrows"
                description="Arrows only when the content overflows."
                meta="control · arrows · useOverflowing"
                collapsible
            >
                <CarouselFrame control={control} arrows={overflowing}>
                    <div
                        ref={control.track}
                        className="flex snap-x gap-sm overflow-x-auto [scrollbar-width:none]"
                    >
                        {Array.from({ length: 10 }, (_, index) => (
                            <div
                                key={index}
                                className="flex h-28 w-40 shrink-0 snap-start items-center justify-center rounded border border-border bg-surface"
                            >
                                <Image className="size-icon-lg text-foreground-faint" />
                            </div>
                        ))}
                    </div>
                </CarouselFrame>
            </Section>
        </Section>
    );
}

function ModalDemo() {
    const [open, setOpen] = useState<string | null>(null);
    const close = () => setOpen(null);

    return (
        <Section
            variant="outlined"
            title="Modal"
            description="Dialog or drawer, closes with the back button and by dragging on phones."
            collapsible
            collapsed
            remember="docs:modal"
        >
            <Section
                variant="outlined"
                title="Dialog"
                description="Centered, with a footer for actions."
                meta="title · description · ModalFooter"
                collapsible
            >
                <div>
                    <Button variant="outline" onClick={() => setOpen('dialog')}>
                        Open
                    </Button>
                </div>
                <Modal
                    open={open === 'dialog'}
                    onClose={close}
                    title="Title"
                    description="Dialog description."
                >
                    <p className="text-sm">Content.</p>
                    <ModalFooter>
                        <Button onClick={close}>Ok</Button>
                    </ModalFooter>
                </Modal>
            </Section>
            <Section
                variant="outlined"
                title="Wide dialog"
                description="More room for content."
                meta='width="lg"'
                collapsible
            >
                <div>
                    <Button variant="outline" onClick={() => setOpen('wide')}>
                        Open
                    </Button>
                </div>
                <Modal
                    open={open === 'wide'}
                    onClose={close}
                    width="lg"
                    title="Title"
                >
                    <p className="text-sm">Content.</p>
                </Modal>
            </Section>
            <Section
                variant="outlined"
                title="Drawer"
                description="Slides from the side, from the bottom on phones."
                meta='format="drawer"'
                collapsible
            >
                <div>
                    <Button variant="outline" onClick={() => setOpen('right')}>
                        Open
                    </Button>
                </div>
                <Modal
                    open={open === 'right'}
                    onClose={close}
                    format="drawer"
                    title="Title"
                >
                    <p className="text-sm">Content.</p>
                </Modal>
            </Section>
            <Section
                variant="outlined"
                title="Side panel"
                description="Stays a side panel on phones too."
                meta='side="left" · mobile="panel"'
                collapsible
            >
                <div>
                    <Button variant="outline" onClick={() => setOpen('left')}>
                        Open
                    </Button>
                </div>
                <Modal
                    open={open === 'left'}
                    onClose={close}
                    format="drawer"
                    side="left"
                    mobile="panel"
                    title="Title"
                >
                    <p className="text-sm">Content.</p>
                </Modal>
            </Section>
            <Section
                variant="outlined"
                title="Top drawer"
                description="Drops from the top, height fits the content."
                meta='side="top" · fit'
                collapsible
            >
                <div>
                    <Button variant="outline" onClick={() => setOpen('top')}>
                        Open
                    </Button>
                </div>
                <Modal
                    open={open === 'top'}
                    onClose={close}
                    format="drawer"
                    side="top"
                    fit
                    title="Title"
                >
                    <p className="text-sm">Content.</p>
                </Modal>
            </Section>
        </Section>
    );
}

function ConfirmDialogDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Section
            variant="outlined"
            title="ConfirmDialog"
            description="Asks before a destructive action."
            collapsible
            collapsed
            remember="docs:confirm-dialog"
        >
            <Section
                variant="outlined"
                title="Waiting for the action"
                description="Keeps the button disabled while the returned promise runs."
                meta="onConfirm returns a Promise"
                collapsible
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
        </Section>
    );
}

function DropdownMenuDemo() {
    return (
        <Section
            variant="outlined"
            title="DropdownMenu"
            description="Menu that opens from a trigger, items as buttons or links."
            collapsible
            collapsed
            remember="docs:dropdown-menu"
        >
            <Section
                variant="outlined"
                title="Icon trigger"
                description="The default trigger, with a link item."
                meta='variant="icon" · DropdownItem asChild · href'
                collapsible
            >
                <div>
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
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Button trigger"
                description="An outline button opens the menu."
                meta='variant="button"'
                collapsible
            >
                <div>
                    <DropdownMenu label="Options" variant="button" trigger="Open">
                        <DropdownItem asChild>
                            <button type="button">Item 1</button>
                        </DropdownItem>
                        <DropdownItem asChild>
                            <button type="button">Item 2</button>
                        </DropdownItem>
                    </DropdownMenu>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Chip trigger"
                description="Compact text trigger in the primary color."
                meta='variant="chip"'
                collapsible
            >
                <div>
                    <DropdownMenu
                        label="Options"
                        variant="chip"
                        trigger={<span>Choose</span>}
                    >
                        <DropdownItem asChild>
                            <button type="button">Item 1</button>
                        </DropdownItem>
                        <DropdownItem asChild>
                            <button type="button">Item 2</button>
                        </DropdownItem>
                    </DropdownMenu>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Field trigger"
                description="Looks like a field, the menu takes its width."
                meta='variant="field" · align="start"'
                collapsible
            >
                <DropdownMenu
                    label="Options"
                    variant="field"
                    align="start"
                    trigger={<span className="flex-1">Open</span>}
                >
                    <DropdownItem asChild>
                        <button type="button">Item 1</button>
                    </DropdownItem>
                    <DropdownItem asChild>
                        <button type="button">Item 2</button>
                    </DropdownItem>
                </DropdownMenu>
            </Section>
        </Section>
    );
}

function HeldMenuDemo() {
    const rows = ['Row 1', 'Row 2'];

    return (
        <Section
            variant="outlined"
            title="HeldMenu"
            description="Row menu opened by holding, right clicking or the ellipsis button."
            collapsible
            collapsed
            remember="docs:held-menu"
        >
            <Section
                variant="outlined"
                title="List rows"
                description="The ellipsis shows on devices with a mouse."
                meta="label · row"
                collapsible
            >
                <div className="rounded border border-border bg-surface">
                    <List>
                        {rows.map((row) => (
                            <li key={row}>
                                <HeldMenu
                                    label="Options"
                                    row={
                                        <div className={layerRowClass}>
                                            <span className="text-sm">{row}</span>
                                        </div>
                                    }
                                >
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
                                </HeldMenu>
                            </li>
                        ))}
                    </List>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Ellipsis on hover"
                description="The ellipsis floats over the row only while hovering."
                meta="hover"
                collapsible
            >
                <div className="rounded border border-border bg-surface">
                    <HeldMenu
                        label="Options"
                        hover
                        row={
                            <div className={layerRowClass}>
                                <span className="text-sm">Row</span>
                            </div>
                        }
                    >
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
                    </HeldMenu>
                </div>
            </Section>
        </Section>
    );
}

function HintDemo() {
    return (
        <Section
            variant="outlined"
            title="Hint"
            description="Info icon that opens a short explanation."
            collapsible
            collapsed
            remember="docs:hint"
        >
            <Section
                variant="outlined"
                title="Default"
                description="The text goes in children."
                meta="children"
                collapsible
            >
                <div>
                    <Hint>Short explanation in a popover.</Hint>
                </div>
            </Section>
        </Section>
    );
}

function ImageViewerDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Section
            variant="outlined"
            title="ImageViewer"
            description="Shows an image full screen."
            collapsible
            collapsed
            remember="docs:image-viewer"
        >
            <Section
                variant="outlined"
                title="Default"
                description="Tap the image to close."
                meta="src · alt · open · onClose"
                collapsible
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
        </Section>
    );
}

function BackdropDemo() {
    const [open, setOpen] = useState(false);

    return (
        <Section
            variant="outlined"
            title="Backdrop"
            description="Dims the page behind floating content."
            collapsible
            collapsed
            remember="docs:backdrop"
        >
            <Section
                variant="outlined"
                title="Default"
                description="Closes when clicked."
                meta="open · onClose"
                collapsible
            >
                <div>
                    <Button variant="outline" onClick={() => setOpen(true)}>
                        Open
                    </Button>
                </div>
                <Backdrop open={open} onClose={() => setOpen(false)} />
            </Section>
        </Section>
    );
}

function NotifyDemo() {
    return (
        <Section
            variant="outlined"
            title="notify"
            description="Shows a toast. Needs Toaster mounted once at the root."
            collapsible
            collapsed
            remember="docs:notify"
        >
            <Section
                variant="outlined"
                title="Tones"
                description="Icon and color by meaning."
                meta='tone="success" | "info" | "warning" | "error"'
                collapsible
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
            </Section>
            <Section
                variant="outlined"
                title="Description"
                description="A second line under the title."
                meta="description"
                collapsible
            >
                <div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            notify({
                                title: 'Title',
                                description: 'Notice description.',
                            })
                        }
                    >
                        Show
                    </Button>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Action"
                description="A button on the toast, like undo."
                meta="action"
                collapsible
            >
                <div>
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
                        Show
                    </Button>
                </div>
            </Section>
            <Section
                variant="outlined"
                title="Openable"
                description="The whole toast is clickable."
                meta="onOpen"
                collapsible
            >
                <div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            notify({
                                title: 'Title',
                                onOpen: () => notify({ title: 'Opened' }),
                            })
                        }
                    >
                        Show
                    </Button>
                </div>
            </Section>
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
            description="Hold or right click gesture for any element."
            collapsible
            collapsed
            remember="docs:use-hold"
        >
            <Section
                variant="outlined"
                title="On an image"
                description="Spread the handlers on the element."
                meta="useHold(onHold)"
                collapsible
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
            description="Opens the system file picker from any button."
            collapsible
            collapsed
            remember="docs:use-file-picker"
        >
            <Section
                variant="outlined"
                title="From a button"
                description="Render the picker once and call open."
                meta="open · picker"
                collapsible
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
        </Section>
    );
}
