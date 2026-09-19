import type { OrderParam } from "./eporner";

export const ORDERS: { value: OrderParam; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "top-weekly", label: "Trending week" },
  { value: "top-monthly", label: "Trending month" },
  { value: "most-popular", label: "Most popular" },
  { value: "top-rated", label: "Top rated" },
  { value: "longest", label: "Longest" },
  { value: "shortest", label: "Shortest" },
];

export const CATEGORIES = [
  "all",
  "teen",
  "milf",
  "anal",
  "lesbian",
  "amateur",
  "asian",
  "ebony",
  "latina",
  "brunette",
  "blonde",
  "big tits",
  "hardcore",
  "pov",
  "threesome",
  "creampie",
  "blowjob",
  "60fps",
  "4k",
  "redhead",
  "mature",
  "public",
  "massage",
] as const;

export const PER_PAGE_OPTIONS = [12, 24, 30, 48, 60] as const;
