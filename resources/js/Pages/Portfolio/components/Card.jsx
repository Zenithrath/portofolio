import React from "react";

export default function Card({ children, className = "", ...props }) {
    return (
        <div
            {...props}
            className={`group rounded-[12px] overflow-hidden transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}
