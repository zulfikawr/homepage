'use client';

import * as PhosphorIcons from '@phosphor-icons/react';
import * as DevIcons from 'developer-icons';

export const iconMap = {
  addressBook: PhosphorIcons.AddressBookIcon,
  arrowLeft: PhosphorIcons.ArrowLeftIcon,
  arrowRight: PhosphorIcons.ArrowRightIcon,
  arrowSquareOut: PhosphorIcons.ArrowSquareOutIcon,
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
  clock: PhosphorIcons.ClockIcon,
  clockCounterClockwise: PhosphorIcons.ClockCounterClockwiseIcon,
  cloudMoon: PhosphorIcons.CloudMoonIcon,
  code: PhosphorIcons.CodeIcon,
  codeBlock: PhosphorIcons.CodeBlockIcon,
  cube: PhosphorIcons.CubeIcon,
  database: PhosphorIcons.DatabaseIcon,
  desktop: PhosphorIcons.DesktopIcon,
  dotsSixVertical: PhosphorIcons.DotsSixVerticalIcon,
  dotsThree: PhosphorIcons.DotsThreeIcon,
  envelope: PhosphorIcons.EnvelopeIcon,
  eye: PhosphorIcons.EyeIcon,
  file: PhosphorIcons.FileIcon,
  floppyDisk: PhosphorIcons.FloppyDiskIcon,
  folder: PhosphorIcons.FolderIcon,
  gear: PhosphorIcons.GearIcon,
  ghost: PhosphorIcons.GhostIcon,
  githubLogo: PhosphorIcons.GithubLogoIcon,
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
  pushPin: PhosphorIcons.PushPinIcon,
  pushPinSlash: PhosphorIcons.PushPinSlashIcon,
  quotes: PhosphorIcons.QuotesIcon,
  rocketLaunch: PhosphorIcons.RocketLaunchIcon,
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
  wall: PhosphorIcons.WallIcon,
  warning: PhosphorIcons.WarningIcon,
  waves: PhosphorIcons.WavesIcon,
  whatsappLogo: PhosphorIcons.WhatsappLogoIcon,
  x: PhosphorIcons.XIcon,
  // Tech replacements from developer-icons
  bun: DevIcons.BunJs,
  cloudflare: DevIcons.Cloudflare,
  css: DevIcons.CSS3,
  d3js: PhosphorIcons.GraphIcon, // D3 not in dev-icons
  firebase: DevIcons.Firebase,
  gemini: PhosphorIcons.SparkleIcon, // Gemini not in dev-icons
  git: DevIcons.Git,
  go: DevIcons.Go,
  html: DevIcons.HTML5,
  javascript: DevIcons.JavaScript,
  neon: PhosphorIcons.LightningIcon, // Neon not in dev-icons
  nextjs: DevIcons.NextJs,
  nodejs: DevIcons.NodeJs,
  prisma: DevIcons.Prisma,
  react: DevIcons.React,
  resend: DevIcons.ReSend,
  rstudio: DevIcons.R,
  tailwindcss: DevIcons.TailwindCSS,
  typescript: DevIcons.TypeScript,
  vercel: DevIcons.VercelDark,
  vite: DevIcons.ViteJS,
  vue: DevIcons.VueJs,
};

export type IconName = keyof typeof iconMap;

interface IconProps extends PhosphorIcons.IconProps {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className, size = 20, ...props }: IconProps) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon with name "${name}" not found`);
    return null;
  }

  // developer-icons expects size as a number, while PhosphorIcons handles string/number
  // Standardizing to ensure compatibility
  const iconSize = typeof size === 'string' ? parseInt(size) : size;

  return <IconComponent className={className} {...props} size={iconSize} />;
};

Icon.displayName = 'Icon';

export { Icon };
