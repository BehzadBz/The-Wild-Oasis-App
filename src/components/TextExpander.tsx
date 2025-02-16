"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type TextExpanderProps = {
  children: string;
};

function TextExpander({ children }: TextExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setMaxHeight(textRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <span className="relative inline-block w-full">
      <motion.div
        ref={textRef}
        style={{ overflow: "hidden" }}
        animate={{ maxHeight: isExpanded ? maxHeight : 60 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="block"
      >
        {children}{" "}
      </motion.div>
      <button
        className="text-primary-700 border-b border-primary-700 leading-3 pb-1 ml-1 mt-2 block"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </span>
  );
}

export default TextExpander;
