import { motion, type HTMLMotionProps } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

export function Reveal({ delay = 0, y = 32, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <div className="label flex items-center gap-3 text-muted-foreground">
      {index && <span className="text-signal">{index}</span>}
      <span className="h-px w-8 bg-foreground/25" />
      <span>{children}</span>
    </div>
  );
}
