export const lunaPalette = {
  paper: "#f8f7f1",
  ink: "#344039",
  sage: "#83a67d",
  sageLight: "#b9d0b3",
  leaf: "#668b61",
  cream: "#eee6cf",
  oat: "#d9caa7",
  yellow: "#e7c86b",
  orange: "#df9b64",
  coral: "#d98170",
  rose: "#d9a1a3",
  blue: "#91b8c5",
  blueLight: "#c2d9dc",
  lavender: "#aaa0c7",
  plum: "#81749e",
  warmGray: "#a9aaa4",
  softGray: "#d8d9d4",
  brown: "#8a674f",
  coffee: "#76503f",
  wine: "#a66f78",
} as const;

export type LunaPaletteName = keyof typeof lunaPalette;
