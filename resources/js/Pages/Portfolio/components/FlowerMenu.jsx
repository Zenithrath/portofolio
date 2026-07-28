import { useState } from "react";

const MenuToggler = ({
    isOpen,
    onChange,
    backgroundColor,
    iconColor,
    animationDuration,
    togglerSize,
    iconSize,
}) => {
    const lineHeight = iconSize * 0.1;
    const lineWidth = iconSize * 0.8;
    const lineSpacing = iconSize * 0.25;

    return (
        <>
            <input
                id="menu-toggler"
                type="checkbox"
                checked={isOpen}
                onChange={onChange}
                className="absolute inset-0 z-10 m-auto cursor-pointer opacity-0"
                style={{ width: togglerSize, height: togglerSize }}
            />
            <label
                htmlFor="menu-toggler"
                className="absolute inset-0 z-20 m-auto flex cursor-pointer items-center justify-center rounded-full transition"
                style={{
                    backgroundColor,
                    color: iconColor,
                    transitionDuration: `${animationDuration}ms`,
                    width: togglerSize,
                    height: togglerSize,
                }}
            >
                <span
                    className="relative flex flex-col items-center justify-center"
                    style={{ width: iconSize, height: iconSize }}
                >
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className={`absolute bg-current transition ${
                                isOpen && i === 0
                                    ? "opacity-0"
                                    : isOpen
                                        ? `${i === 1 ? "rotate-45" : "-rotate-45"}`
                                        : ""
                            }`}
                            style={{
                                transitionDuration: `${animationDuration}ms`,
                                width: lineWidth,
                                height: lineHeight,
                                top: isOpen
                                    ? `calc(50% - ${lineHeight / 2}px)`
                                    : `calc(50% + ${(i - 1) * lineSpacing}px - ${lineHeight / 2}px)`,
                            }}
                        />
                    ))}
                </span>
            </label>
        </>
    );
};

const MenuItem = ({
    item,
    index,
    isOpen,
    iconColor,
    backgroundColor,
    animationDuration,
    itemCount,
    itemSize,
    iconSize,
    onClick,
}) => {
    const Icon = item.icon;
    return (
        <li
            className={`absolute inset-0 m-auto transition ${isOpen ? "opacity-100" : "opacity-0"}`}
            style={{
                width: itemSize,
                height: itemSize,
                transform: isOpen
                    ? `rotate(${(360 / itemCount) * index}deg) translateX(-${itemSize + 30}px)`
                    : "none",
                transitionDuration: `${animationDuration}ms`,
            }}
        >
            <button
                type="button"
                onClick={() => onClick?.(item.id)}
                className={`flex h-full w-full items-center justify-center rounded-full opacity-60 transition duration-100 ${
                    isOpen ? "pointer-events-auto" : "pointer-events-none"
                } group hover:scale-125 hover:opacity-100`}
                style={{
                    backgroundColor,
                    color: iconColor,
                    transform: `rotate(-${(360 / itemCount) * index}deg)`,
                    transitionDuration: `${animationDuration}ms`,
                }}
            >
                {Icon ? (
                    <Icon
                        className="transition-transform duration-200 group-hover:scale-125"
                        style={{ width: iconSize, height: iconSize }}
                    />
                ) : (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider transition-transform duration-200 group-hover:scale-125">
                        {item.label}
                    </span>
                )}
            </button>
        </li>
    );
};

export default function FlowerMenu({
    menuItems,
    iconColor = "white",
    backgroundColor = "rgba(255, 61, 0, 0.85)",
    animationDuration = 500,
    togglerSize = 44,
    onItemClick,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const itemCount = menuItems.length;
    const itemSize = togglerSize * 2;
    const iconSize = Math.max(24, Math.floor(togglerSize * 0.6));

    const handleClick = (id) => {
        onItemClick?.(id);
        setIsOpen(false);
    };

    return (
        <nav
            className="relative"
            style={{ width: togglerSize * 3, height: togglerSize * 3 }}
        >
            <MenuToggler
                isOpen={isOpen}
                onChange={() => setIsOpen(!isOpen)}
                backgroundColor={backgroundColor}
                iconColor={iconColor}
                animationDuration={animationDuration}
                togglerSize={togglerSize}
                iconSize={iconSize}
            />
            <ul className="absolute inset-0 m-0 h-full w-full list-none p-0">
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        item={item}
                        index={index}
                        isOpen={isOpen}
                        iconColor={iconColor}
                        backgroundColor={backgroundColor}
                        animationDuration={animationDuration}
                        itemCount={itemCount}
                        itemSize={itemSize}
                        iconSize={iconSize}
                        onClick={handleClick}
                    />
                ))}
            </ul>
        </nav>
    );
}
