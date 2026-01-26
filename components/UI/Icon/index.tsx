'use client';

import { Icon as Iconify } from '@iconify/react';
import * as PhosphorIcons from '@phosphor-icons/react';

export const iconMap = {
  addressBook: PhosphorIcons.AddressBookIcon,
  arrowLeft: PhosphorIcons.ArrowLeftIcon,
  arrowRight: PhosphorIcons.ArrowRightIcon,
  arrowSquareOut: PhosphorIcons.ArrowSquareOutIcon,
  arrowUDownLeft: PhosphorIcons.ArrowUDownLeftIcon,
  article: PhosphorIcons.ArticleIcon,
  asterisk: PhosphorIcons.AsteriskIcon,
  bookOpen: PhosphorIcons.BookOpenIcon,
  bookmarks: PhosphorIcons.BookmarksIcon,
  bracketsSquare: PhosphorIcons.BracketsSquareIcon,
  briefcase: PhosphorIcons.BriefcaseIcon,
  calendarPlus: PhosphorIcons.CalendarPlusIcon,
  caretDown: PhosphorIcons.CaretDownIcon,
  caretLeft: PhosphorIcons.CaretLeftIcon,
  caretRight: PhosphorIcons.CaretRightIcon,
  caretUp: PhosphorIcons.CaretUpIcon,
  certificate: PhosphorIcons.CertificateIcon,
  chartBar: PhosphorIcons.ChartBarIcon,
  chartLine: PhosphorIcons.ChartLineIcon,
  chatCenteredText: PhosphorIcons.ChatCenteredTextIcon,
  checkCircle: PhosphorIcons.CheckCircleIcon,
  checks: PhosphorIcons.ChecksIcon,
  circleNotch: PhosphorIcons.CircleNotchIcon,
  clock: PhosphorIcons.ClockIcon,
  clockCounterClockwise: PhosphorIcons.ClockCounterClockwiseIcon,
  cloudMoon: PhosphorIcons.CloudMoonIcon,
  code: PhosphorIcons.CodeIcon,
  codeBlock: PhosphorIcons.CodeBlockIcon,
  cube: PhosphorIcons.CubeIcon,
  database: PhosphorIcons.DatabaseIcon,
  desktop: PhosphorIcons.DesktopIcon,
  deviceMobile: PhosphorIcons.DeviceMobileIcon,
  deviceTablet: PhosphorIcons.DeviceTabletIcon,
  dotsSixVertical: PhosphorIcons.DotsSixVerticalIcon,
  dotsThree: PhosphorIcons.DotsThreeIcon,
  envelope: PhosphorIcons.EnvelopeIcon,
  eye: PhosphorIcons.EyeIcon,
  file: PhosphorIcons.FileIcon,
  filePdf: PhosphorIcons.FilePdfIcon,
  floppyDisk: PhosphorIcons.FloppyDiskIcon,
  folder: PhosphorIcons.FolderIcon,
  gear: PhosphorIcons.GearIcon,
  ghost: PhosphorIcons.GhostIcon,
  githubLogo: PhosphorIcons.GithubLogoIcon,
  globe: PhosphorIcons.GlobeIcon,
  hammer: PhosphorIcons.HammerIcon,
  hash: PhosphorIcons.HashIcon,
  heart: PhosphorIcons.HeartIcon,
  houseLine: PhosphorIcons.HouseLineIcon,
  image: PhosphorIcons.ImageIcon,
  info: PhosphorIcons.InfoIcon,
  layout: PhosphorIcons.LayoutIcon,
  lightbulb: PhosphorIcons.LightbulbIcon,
  link: PhosphorIcons.LinkIcon,
  linkedinLogo: PhosphorIcons.LinkedinLogoIcon,
  list: PhosphorIcons.ListIcon,
  listBullets: PhosphorIcons.ListBulletsIcon,
  lock: PhosphorIcons.LockIcon,
  lockOpen: PhosphorIcons.LockOpenIcon,
  magnifyingGlass: PhosphorIcons.MagnifyingGlassIcon,
  magnifyingGlassPlus: PhosphorIcons.MagnifyingGlassPlusIcon,
  mapPin: PhosphorIcons.MapPinIcon,
  microphone: PhosphorIcons.MicrophoneIcon,
  microscope: PhosphorIcons.MicroscopeIcon,
  minus: PhosphorIcons.MinusIcon,
  monitor: PhosphorIcons.MonitorIcon,
  moon: PhosphorIcons.MoonIcon,
  musicNotes: PhosphorIcons.MusicNotesIcon,
  network: PhosphorIcons.NetworkIcon,
  newspaper: PhosphorIcons.NewspaperIcon,
  note: PhosphorIcons.NoteIcon,
  notePencil: PhosphorIcons.NotePencilIcon,
  package: PhosphorIcons.PackageIcon,
  palette: PhosphorIcons.PaletteIcon,
  pencilSimple: PhosphorIcons.PencilSimpleIcon,
  pencilSimpleLine: PhosphorIcons.PencilSimpleLineIcon,
  playCircle: PhosphorIcons.PlayCircleIcon,
  playlist: PhosphorIcons.PlaylistIcon,
  plus: PhosphorIcons.PlusIcon,
  presentationChart: PhosphorIcons.PresentationChartIcon,
  prohibit: PhosphorIcons.ProhibitIcon,
  pushPin: PhosphorIcons.PushPinIcon,
  pushPinSlash: PhosphorIcons.PushPinSlashIcon,
  quotes: PhosphorIcons.QuotesIcon,
  rocketLaunch: PhosphorIcons.RocketLaunchIcon,
  rows: PhosphorIcons.RowsIcon,
  share: PhosphorIcons.ShareIcon,
  shareNetwork: PhosphorIcons.ShareNetworkIcon,
  signIn: PhosphorIcons.SignInIcon,
  signOut: PhosphorIcons.SignOutIcon,
  spotifyLogo: PhosphorIcons.SpotifyLogoIcon,
  star: PhosphorIcons.StarIcon,
  sun: PhosphorIcons.SunIcon,
  table: PhosphorIcons.TableIcon,
  tag: PhosphorIcons.TagIcon,
  terminalWindow: PhosphorIcons.TerminalWindowIcon,
  textBolder: PhosphorIcons.TextBolderIcon,
  textH: PhosphorIcons.TextHIcon,
  textItalic: PhosphorIcons.TextItalicIcon,
  textUnderline: PhosphorIcons.TextUnderlineIcon,
  trash: PhosphorIcons.TrashIcon,
  trashSimple: PhosphorIcons.TrashSimpleIcon,
  userCircle: PhosphorIcons.UserCircleIcon,
  users: PhosphorIcons.UsersIcon,
  wall: PhosphorIcons.WallIcon,
  warning: PhosphorIcons.WarningIcon,
  waves: PhosphorIcons.WavesIcon,
  whatsappLogo: PhosphorIcons.WhatsappLogoIcon,
  x: PhosphorIcons.XIcon,
};

// Map tech icons to Iconify string names
export const iconifyMap: Record<string, string> = {
  // Languages
  javascript: 'vscode-icons:file-type-js-official',
  typescript: 'vscode-icons:file-type-typescript-official',
  python: 'vscode-icons:file-type-python',
  go: 'vscode-icons:file-type-go',
  rust: 'vscode-icons:file-type-rust',
  java: 'vscode-icons:file-type-java',
  php: 'vscode-icons:file-type-php',
  ruby: 'vscode-icons:file-type-ruby',
  swift: 'vscode-icons:file-type-swift',
  kotlin: 'vscode-icons:file-type-kotlin',
  cpp: 'vscode-icons:file-type-cpp',
  csharp: 'vscode-icons:file-type-csharp',
  dart: 'vscode-icons:file-type-dart',
  r: 'vscode-icons:file-type-r',
  rstudio: 'vscode-icons:file-type-r',

  // Frontend
  html: 'vscode-icons:file-type-html',
  css: 'vscode-icons:file-type-css',
  react: 'vscode-icons:file-type-reactjs',
  nextjs: 'vscode-icons:file-type-next',
  vue: 'vscode-icons:file-type-vue',
  angular: 'vscode-icons:file-type-angular',
  svelte: 'vscode-icons:file-type-svelte',
  tailwindcss: 'vscode-icons:file-type-tailwind',
  sass: 'vscode-icons:file-type-sass',
  less: 'vscode-icons:file-type-less',

  // Backend & Frameworks
  nodejs: 'vscode-icons:file-type-node',
  bun: 'vscode-icons:file-type-bun',
  nestjs: 'logos:nestjs',
  django: 'vscode-icons:file-type-django',
  flask: 'vscode-icons:file-type-flask',
  laravel: 'vscode-icons:file-type-laravel',
  rails: 'vscode-icons:file-type-rails',
  spring: 'vscode-icons:file-type-spring',

  // Databases
  postgresql: 'vscode-icons:file-type-pgsql',
  mysql: 'vscode-icons:file-type-mysql',
  mongodb: 'vscode-icons:file-type-mongo',
  redis: 'vscode-icons:file-type-redis',
  sqlite: 'vscode-icons:file-type-sqlite',
  firebase: 'vscode-icons:file-type-firebase',
  supabase: 'logos:supabase-icon',
  pocketbase: 'logos:pocketbase-icon',
  prisma: 'vscode-icons:file-type-prisma',

  // Cloud & DevOps
  docker: 'vscode-icons:file-type-docker',
  kubernetes: 'vscode-icons:file-type-kubernetes',
  aws: 'vscode-icons:file-type-aws',
  azure: 'vscode-icons:file-type-azure',
  gcp: 'logos:google-cloud',
  vercel: 'vscode-icons:file-type-vercel',
  netlify: 'vscode-icons:file-type-netlify',
  cloudflare: 'vscode-icons:file-type-cloudflare',
  git: 'vscode-icons:file-type-git',
  github: 'vscode-icons:file-type-github',

  // Tools & Others
  figma: 'vscode-icons:file-type-figma',
  gemini: 'vscode-icons:file-type-gemini',
  vitest: 'vscode-icons:file-type-vitest',
  jest: 'vscode-icons:file-type-jest',
  cypress: 'vscode-icons:file-type-cypress',
  graphql: 'vscode-icons:file-type-graphql',
  npm: 'vscode-icons:file-type-npm',
  pnpm: 'vscode-icons:file-type-pnpm',
  yarn: 'vscode-icons:file-type-yarn',
  vite: 'vscode-icons:file-type-vite',
  webpack: 'vscode-icons:file-type-webpack',
  flutter: 'vscode-icons:file-type-flutter',
  neon: 'logos:neon-icon',
  resend: 'logos:resend-icon',
  d3js: 'vscode-icons:file-type-d3',
};

export type IconName = keyof typeof iconMap | keyof typeof iconifyMap;

interface IconProps extends Omit<
  React.SVGProps<SVGSVGElement>,
  'name' | 'size' | 'mode' | 'onLoad' | 'rotate'
> {
  name: IconName;
  className?: string;
  size?: number | string;
  color?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  mirrored?: boolean;
  rotate?: number;
}

const Icon = ({ name, className, size = 20, ...props }: IconProps) => {
  if (name in iconifyMap) {
    const { ...iconifyProps } = props;

    return (
      <Iconify
        icon={iconifyMap[name as keyof typeof iconifyMap]}
        className={className}
        width={size}
        height={size}
        {...iconifyProps}
      />
    );
  }
  // Fallback to PhosphorIcons
  const IconComponent = iconMap[name as keyof typeof iconMap];

  if (!IconComponent) {
    console.warn(`Icon with name "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={className}
      size={size}
      {...(props as PhosphorIcons.IconProps)}
    />
  );
};

Icon.displayName = 'Icon';

export { Icon };
