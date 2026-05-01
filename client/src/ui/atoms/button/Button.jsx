import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "../../../styles/theme";
import clsx from "clsx";

const BASIC_BUTTON_CLASS = "font-semibold w-max px-3 py-1.5 cursor-pointer rounded";
const ICON_SIZE = 18;

const SLIDE_ICON = {
  initial: { width: 0, opacity: 0, x: 8 },
  animate: { width: 18, opacity: 1, x: 0 },
  exit: { width: 0, opacity: 0, x: 8 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const SLIDE_TEXT = {
  initial: { width: 0, opacity: 0, x: -8 },
  animate: { width: "auto", opacity: 1, x: 0 },
  exit: { width: 0, opacity: 0, x: -8 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const Button = ({
  variant = "primary",
  icon,
  children,
  onClick,
  transition = "default",
  className,
}) => {
  const MotionButton = motion.button;
  const MotionSpan = motion.span;
  const classNames = theme.button[variant];
  const [hovered, setHovered] = useState(false);

  if (!variant || !children) return null;

  const isText = transition === "text";
  const isIcon = transition === "icon";

  return (
    <MotionButton
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={clsx(classNames, BASIC_BUTTON_CLASS, className)}
    >
      <span className="flex items-center gap-1 overflow-hidden">
        {icon && (
          <AnimatePresence initial={false}>
            {isText && hovered && (
              <MotionSpan
                key="icon-text"
                className="flex items-center overflow-hidden"
                {...SLIDE_ICON}
              >
                {React.cloneElement(icon, { size: ICON_SIZE })}
              </MotionSpan>
            )}
            {isIcon && (
              <MotionSpan key="icon-icon" className="flex items-center">
                {React.cloneElement(icon, { size: ICON_SIZE })}
              </MotionSpan>
            )}
            {!isText && !isIcon && (
              <MotionSpan key="icon-default" className="flex items-center">
                {React.cloneElement(icon, { size: ICON_SIZE })}
              </MotionSpan>
            )}
          </AnimatePresence>
        )}

        <AnimatePresence initial={false}>
          {isText && <MotionSpan key="text-text">{children}</MotionSpan>}
          {isIcon && hovered && (
            <MotionSpan
              key="text-icon"
              className="overflow-hidden whitespace-nowrap"
              {...SLIDE_TEXT}
            >
              {children}
            </MotionSpan>
          )}
          {!isText && !isIcon && (
            <MotionSpan key="text-default">{children}</MotionSpan>
          )}
        </AnimatePresence>
      </span>
    </MotionButton>
  );
};

export default Button;

export const IconButton = (props) => <Button {...props} transition="icon" />;
export const TextButton = (props) => <Button {...props} transition="text" />;
