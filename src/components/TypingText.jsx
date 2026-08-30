import { motion } from "framer-motion";

export default function TypingText({
  text,
  className = "",
  delay = 0,
  speed = 0.04,
}) {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  };

  const letter = {
    hidden: {
      opacity: 0,
      y: 8,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letter}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}