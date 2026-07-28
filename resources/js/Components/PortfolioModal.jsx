import React, { Fragment } from "react";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";

export default function PortfolioModal({
    show = false,
    onClose = () => {},
    title,
    children,
    maxWidth = "4xl",
}) {
    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        "3xl": "sm:max-w-3xl",
        "4xl": "sm:max-w-4xl",
        "5xl": "sm:max-w-5xl",
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-150">
            <Dialog
                as="div"
                className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto px-4 py-10"
                onClose={onClose}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                </TransitionChild>

                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 translate-y-4 scale-[0.98]"
                    enterTo="opacity-100 translate-y-0 scale-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0 scale-100"
                    leaveTo="opacity-0 translate-y-4 scale-[0.98]"
                >
                    <DialogPanel
                        className={[
                            "relative w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] text-[#F5F5F5] shadow-[0_30px_90px_rgba(0,0,0,0.6)]",
                            maxWidthClass,
                        ].join(" ")}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2A] px-5 py-4">
                            <div className="min-w-0">
                                <div className="font-['Syne'] text-lg sm:text-xl font-extrabold text-white truncate">
                                    {title}
                                </div>
                                <div className="mt-1 text-xs font-mono text-[#888888]">
                                    ESC / klik luar untuk menutup
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-[#FF3D00]/60 transition"
                                aria-label="Close"
                            >
                                X
                            </button>
                        </div>

                        <div className="px-5 py-5">{children}</div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
