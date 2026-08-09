import type { ReactNode } from "react";
import { Illustration } from "../Illustration";
import { lunaPalette as c } from "../palette";
import type { IllustrationProps } from "../types";

function SoftTile({ children, title, ...props }: IllustrationProps & { children: ReactNode; title: string }) { return <Illustration title={title} {...props}><path fill={c.softGray} d="M9 31C9 17 18 8 32 8s23 9 23 23c0 16-9 25-23 25S9 47 9 31Z" />{children}</Illustration>; }
export function EmptyIllustration(props: IllustrationProps) { return <SoftTile title="Empty" {...props}><circle cx="24" cy="30" r="2.5" fill={c.warmGray} /><circle cx="40" cy="30" r="2.5" fill={c.warmGray} /><path fill={c.warmGray} d="M23 42h18v3H23Z" /></SoftTile>; }
export function SelectedIllustration(props: IllustrationProps) { return <SoftTile title="Selected" {...props}><circle cx="32" cy="32" r="15" fill={c.sage} /><circle cx="32" cy="32" r="6" fill={c.paper} /><circle cx="32" cy="32" r="3" fill={c.sage} /></SoftTile>; }
export function CompletedIllustration(props: IllustrationProps) { return <SoftTile title="Completed" {...props}><circle cx="32" cy="32" r="16" fill={c.sage} /><path fill={c.paper} d="m21 32 4-4 6 6 12-13 4 4-16 18Z" /></SoftTile>; }
export function AddIllustration(props: IllustrationProps) { return <SoftTile title="Add" {...props}><path fill={c.sage} d="M29 17h6v12h12v6H35v12h-6V35H17v-6h12Z" /></SoftTile>; }
