import React from "react";

function InstagramIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
    );
}

function WhatsappIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M12.04 2a9.86 9.86 0 0 0-8.45 14.94L2.35 22l5.18-1.22A9.97 9.97 0 1 0 12.04 2Zm0 1.9a8.06 8.06 0 0 1 6.83 12.34 8.09 8.09 0 0 1-10.92 2.64l-.35-.21-3 .7.72-2.9-.23-.37A8.06 8.06 0 0 1 12.04 3.9Zm-3.1 3.72c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.63 1.11 2.81.14.18 1.89 3.02 4.68 4.11 2.32.91 2.8.73 3.3.68.51-.05 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32-.27-.14-1.65-.81-1.9-.9-.25-.09-.44-.14-.62.14-.18.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.27-.14-1.16-.43-2.22-1.37-.82-.73-1.37-1.64-1.53-1.91-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.86-2.05-.22-.53-.45-.46-.62-.46l-.53-.01Z" />
        </svg>
    );
}

function GithubIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.82.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.84c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.56 4.93.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
    );
}

const iconMap = {
    github: GithubIcon,
    instagram: InstagramIcon,
    whatsapp: WhatsappIcon,
};

function normalizeHref(contact) {
    if (!contact?.value) return null;
    if (contact.platform === "whatsapp" && !contact.value.startsWith("http")) {
        const phone = contact.value.replace(/[^\d+]/g, "");
        return `https://wa.me/${phone.replace(/^\+/, "")}`;
    }
    return contact.value;
}

/** @param {{ personal: any, contacts?: any[] }} props */
export default function FooterSection({ personal, contacts = [] }) {
    const year = new Date().getFullYear();
    const platforms = ["github", "instagram", "whatsapp"];
    const socialLinks = platforms.map((platform) => (
        contacts.find((contact) => contact.platform === platform) || { platform }
    ));
    const institute = [personal?.faculty, personal?.university]
        .filter(Boolean)
        .join(" / ") || "Institusi belum diatur";
    const domicile = personal?.location || "Domisili belum diatur";

    return (
        <footer className="border-t border-white/[0.16] bg-[#0B0D0C] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl py-6 sm:py-8 lg:py-10">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end lg:gap-10">
                    <div className="border-l-2 border-[#FF3D00] pl-4">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">
                            Institute
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#F2F2EE] sm:text-base">
                            {institute}
                        </p>
                    </div>

                    <div className="border-l-2 border-white/[0.26] pl-4">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                            Domisili
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#F2F2EE] sm:text-base">
                            {domicile}
                        </p>
                    </div>

                    <div className="lg:justify-self-end">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                            Connect
                        </p>
                        <div className="mt-3 flex items-center gap-2.5">
                            {socialLinks.map((contact) => {
                                const Icon = iconMap[contact.platform];
                                const href = normalizeHref(contact);
                                const className = "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.22] bg-[#151817] text-[#E8EAE6] transition duration-200 hover:-translate-y-0.5 hover:border-[#FF3D00] hover:bg-[#FF3D00] hover:text-white";

                                if (!href) {
                                    return (
                                        <span
                                            key={contact.platform}
                                            title={contact.platform}
                                            aria-label={contact.platform}
                                            className={className}
                                        >
                                            <Icon className="h-[18px] w-[18px]" />
                                        </span>
                                    );
                                }

                                return (
                                    <a
                                        key={contact.id || contact.platform}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        title={contact.platform}
                                        aria-label={contact.platform}
                                        className={className}
                                    >
                                        <Icon className="h-[18px] w-[18px]" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/[0.12] pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                    {year} / {personal?.name || "Portofolio"}
                </div>
            </div>
        </footer>
    );
}
