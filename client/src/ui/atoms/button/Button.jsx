import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "../../../styles/theme";
import clsx from "clsx";

const basicButtonTheme = "font-semibold w-max px-3 py-1.5 cursor-pointer rounded";
const iconSize = 18;

const slideIcon = {
  initial: { width: 0, opacity: 0, x: 8 },
  animate: { width: 18, opacity: 1, x: 0 },
  exit:    { width: 0, opacity: 0, x: 8 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const slideText = {
  initial: { width: 0, opacity: 0, x: -8 },
  animate: { width: "auto", opacity: 1, x: 0 },
  exit:    { width: 0, opacity: 0, x: -8 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const Button = ({
  variant = "primary",
  icon,
  children,
  onClick,
  transition = "default",
}) => {
  const classNames = theme.button[variant];
  const [hovered, setHovered] = useState(false);

  if (!variant || !children) return null;

  const isText = transition === "text";
  const isIcon = transition === "icon";

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={clsx(classNames, basicButtonTheme)}
    >
      <span className="flex items-center gap-1 overflow-hidden">

        {icon && (
          <AnimatePresence initial={false}>
            {isText && hovered && (
              <motion.span
                key="icon-text"
                className="flex items-center overflow-hidden"
                initial={slideIcon.initial}
                animate={slideIcon.animate}
                exit={slideIcon.exit}
                transition={slideIcon.transition}
              >
                {React.cloneElement(icon, { size: iconSize })}
              </motion.span>
            )}

            {isIcon && (
              <motion.span key="icon-icon" className="flex items-center">
                {React.cloneElement(icon, { size: iconSize })}
              </motion.span>
            )}

            {!isText && !isIcon && (
              <motion.span key="icon-default" className="flex items-center">
                {React.cloneElement(icon, { size: iconSize })}
              </motion.span>
            )}
          </AnimatePresence>
        )}

        <AnimatePresence initial={false}>
          {isText && (
            <motion.span key="text-text">
              {children}
            </motion.span>
          )}

          {isIcon && hovered && (
            <motion.span
              key="text-icon"
              className="overflow-hidden whitespace-nowrap"
              initial={slideText.initial}
              animate={slideText.animate}
              exit={slideText.exit}
              transition={slideText.transition}
            >
              {children}
            </motion.span>
          )}

          {!isText && !isIcon && (
            <motion.span key="text-default">
              {children}
            </motion.span>
          )}
        </AnimatePresence>

      </span>
    </motion.button>
  );
};

export default Button;

export const IconButton = (props) => <Button {...props} transition="icon" />;

export const TextButton = (props) => <Button {...props} transition="text" />;
