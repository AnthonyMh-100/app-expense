import clsx from "clsx";

export type AvatarSize = "sm" | "md" | "lg";

type AvatarTone = {
  bg: string;
  text: string;
};

const AVATAR_TONES: AvatarTone[] = [
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
];

const SIZE_STYLES: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

const getInitials = (name: string, lastname?: string) => {
  const parts = (lastname ? `${name} ${lastname}` : name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
};

const getTone = (name: string, lastname?: string): AvatarTone => {
  const seed = `${name}${lastname ?? ""}`;

  const hash = [...seed].reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0,
    0,
  );

  return AVATAR_TONES[hash % AVATAR_TONES.length];
};

type AvatarProps = {
  name: string;
  lastname?: string;
  size?: AvatarSize;
  className?: string;
};

const Avatar = ({ name, lastname, size = "md", className }: AvatarProps) => {
  const initials = getInitials(name, lastname) || "?";
  const tone = getTone(name, lastname);

  return (
    <span
      title={`${name}${lastname ? ` ${lastname}` : ""}`.trim()}
      className={clsx(
        "grid shrink-0 place-items-center rounded-full font-semibold ring-1 ring-inset ring-slate-200/70",
        SIZE_STYLES[size],
        tone.bg,
        tone.text,
        className,
      )}
    >
      {initials}
    </span>
  );
};

export default Avatar;
