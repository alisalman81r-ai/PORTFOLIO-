import {
  Accessibility,
  ArrowUpRight,
  Award,
  Blocks,
  BookOpen,
  Briefcase,
  Atom,
  Building2,
  Check,
  Clapperboard,
  ClipboardList,
  Clock,
  Code2,
  CodeXml,
  Compass,
  Database,
  ExternalLink,
  Flag,
  FolderGit2,
  Gauge,
  Images,
  Download,
  GraduationCap,
  Infinity as InfinityIcon,
  Layers,
  MonitorSmartphone,
  Lightbulb,
  Palette,
  PencilRuler,
  Puzzle,
  Rocket,
  Route,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Target,
  TestTubeDiagonal,
  TriangleAlert,
  Trophy,
  User,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

/**
 * Central icon registry.
 *
 * WHY A REGISTRY AND NOT DIRECT IMPORTS
 * -------------------------------------
 * Data files store icons as *strings* (`icon: 'sprout'`) so they stay
 * serialisable, CMS-ready, and free of React imports. Something has to turn
 * those strings back into components — and without one shared place to do it,
 * every consumer grows its own `const ICONS = { … }` map. Three copies later
 * they disagree, and a typo in a data file renders nothing with no error.
 *
 * WHY NOT DYNAMIC LOOKUP
 * ----------------------
 * `lucide-react` exports a `icons` object keyed by name, so `icons[name]` would
 * remove this file entirely — and pull all ~1,600 icons into the bundle, since
 * a dynamic key defeats tree-shaking. Explicit imports keep only what is used.
 *
 * Keys are semantic, not vendor names: `monitor` rather than
 * `MonitorSmartphone`, so swapping the icon library later is a change here and
 * nowhere else.
 */
const REGISTRY = {
  // Journey
  sprout: Sprout,
  atom: Atom,
  layers: Layers,
  zap: Zap,
  building: Building2,
  storyboard: Clapperboard,
  infinity: InfinityIcon,

  // Pillars + skill categories
  monitor: MonitorSmartphone,
  server: Server,
  palette: Palette,
  puzzle: Puzzle,
  database: Database,
  wrench: Wrench,
  graduation: GraduationCap,
  accessibility: Accessibility,

  // General
  code: Code2,
  sparkles: Sparkles,
  check: Check,
  download: Download,
  arrow: ArrowUpRight,
  user: User,

  // Projects
  external: ExternalLink,
  close: X,
  gallery: Images,
  overview: Compass,
  problem: TriangleAlert,
  solution: Lightbulb,
  process: Route,
  results: Trophy,
  target: Target,
  milestone: Flag,

  // Services
  frontend: CodeXml,
  fullstack: Blocks,
  responsive: Smartphone,
  handoff: PencilRuler,
  gauge: Gauge,
  maintain: ShieldCheck,

  // Work process
  discovery: Search,
  planning: ClipboardList,
  build: Code2,
  testing: TestTubeDiagonal,
  deploy: Rocket,

  // Experience + achievements
  briefcase: Briefcase,
  repo: FolderGit2,
  learning: BookOpen,
  clock: Clock,
  award: Award,
}

/**
 * Renders a registered icon by name.
 *
 * Icons are decorative unless given a label — a name beside an icon means the
 * icon adds nothing for a screen reader and repeating it is noise. So this is
 * `aria-hidden` by default; pass `label` for a standalone icon that carries
 * meaning on its own, and it becomes an `img` role with an accessible name.
 *
 * Returns null for an unknown key rather than throwing: a typo in a data file
 * should leave a gap in the UI, not take down the section around it.
 *
 * @param {object} props
 * @param {string} props.name Registry key.
 * @param {string} [props.label] Accessible name. Omit when adjacent text
 *   already conveys the meaning.
 * @param {string} [props.className] Size and colour, e.g. 'size-5 text-accent'.
 */
export function Icon({ name, label, className, ...rest }) {
  const Component = REGISTRY[name]

  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[Icon] Unknown icon "${name}". Add it to the registry.`)
    }
    return null
  }

  return (
    <Component
      className={className}
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label}
      // Stroke scales with the icon so a large icon does not look heavy and a
      // small one does not disappear.
      strokeWidth={1.75}
      {...rest}
    />
  )
}
