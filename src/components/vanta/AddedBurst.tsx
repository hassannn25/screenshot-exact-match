import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

/** Confirmation overlay shown on the Add to Cart button after a successful add. */
export function AddedBurst({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-success text-background"
        >
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="grid size-6 place-items-center rounded-full bg-background text-success"
          >
            <Check className="size-3.5" strokeWidth={3} />
          </motion.span>
          <motion.span initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            Added to bag
          </motion.span>
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-success"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </motion.span>
      )}
    </AnimatePresence>
  );
}
