'use client';

import { twMerge } from 'tailwind-merge';
import * as PhosphorIcons from '@phosphor-icons/react';

const iconMap = {
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
  // Tech replacements
  cloudflare: PhosphorIcons.CloudIcon,
  d3js: PhosphorIcons.GraphIcon,
  firebase: PhosphorIcons.FlameIcon,
  gemini: PhosphorIcons.SparkleIcon,
  go: PhosphorIcons.FileCodeIcon,
  neon: PhosphorIcons.LightningIcon,
  nextjs: PhosphorIcons.CaretDoubleUpIcon,
  prisma: PhosphorIcons.TriangleIcon,
  resend: PhosphorIcons.PaperPlaneIcon,
  rstudio: PhosphorIcons.ChartBarIcon,
  tetrio: PhosphorIcons.GameControllerIcon,
  vercel: PhosphorIcons.TriangleIcon,
  vite: PhosphorIcons.LightningIcon,
};

export type IconName = keyof typeof iconMap;

interface IconProps extends PhosphorIcons.IconProps {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className, ...props }: IconProps) => {
  const PhosphorIcon = iconMap[name];

  return (
    <PhosphorIcon className={twMerge('w-full h-full', className)} {...props} />
  );
};

Icon.displayName = 'Icon';

export { Icon };
