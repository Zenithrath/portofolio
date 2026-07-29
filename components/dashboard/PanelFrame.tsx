"use client";

import type { ReactNode } from "react";

export function PanelFrame({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <header className="border-b border-white/[0.12] pb-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">{eyebrow}</p>
        <h1 className="mt-2 font-['Syne'] text-2xl font-extrabold text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{description}</p>
      </header>
      {children}
    </section>
  );
}

export function InputLabel({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">{label}</span>{children}</label>;
}

export const inputClass = "h-11 w-full border border-white/[0.14] bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#FF3D00]/70";
export const textareaClass = "min-h-28 w-full resize-y border border-white/[0.14] bg-black/20 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-[#FF3D00]/70";
export const selectClass = "dashboard-select h-11 w-full appearance-none border border-white/[0.14] bg-[#121514] px-3 pr-10 font-semibold text-white outline-none transition placeholder:text-white/20 hover:border-[#FF6B35]/70 focus:border-[#FF3D00] focus:bg-[#171A18] focus:ring-1 focus:ring-[#FF3D00]/35";

export function PrimaryButton({ children, pending, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return <button type="submit" disabled={pending || props.disabled} className={`inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF3D00] px-4 text-sm font-bold text-white transition hover:bg-[#FF6B35] disabled:cursor-wait disabled:opacity-60 ${className}`} {...props}>{pending ? "Menyimpan..." : children}</button>;
}

export function SecondaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`inline-flex min-h-10 items-center justify-center gap-2 border border-white/[0.14] px-3 text-sm font-semibold text-white/70 transition hover:border-[#FF3D00]/60 hover:text-white ${className}`} {...props}>{children}</button>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-white/65"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[#FF3D00]" />{label}</label>;
}

export function EmptyState({ text }: { text: string }) {
  return <div className="border-l-2 border-[#FF3D00] bg-white/[0.025] px-4 py-5 text-sm text-white/55">{text}</div>;
}
