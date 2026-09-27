"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PlusIcon } from "@/components/ui/icons";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface Props {
  items: AccordionItem[];
  /** ids open on first paint */
  defaultOpen?: string[];
}

function Panel({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Keep --panel-height in sync with the real content box, so the panel stays
  // correct when the copy reflows (resize, font swap, dynamic text).
  useEffect(() => {
    const el = content.current;
    const box = panel.current;
    if (!el || !box) return;
    const sync = () => box.style.setProperty("--panel-height", `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={panel} className={styles.panel} id={`panel-${id}`} role="region" aria-hidden={!open}>
      <div ref={content} className={`${styles.content} rte`}>
        {children}
      </div>
    </div>
  );
}

export function Accordion({ items, defaultOpen = [] }: Props) {
  const [open, setOpen] = useState<string[]>(defaultOpen);

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((v) => v !== id) : [...current, id],
    );

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div className={styles.item} key={item.id} data-open={isOpen}>
            <button
              type="button"
              className={styles.summary}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
            >
              {item.title}
              <PlusIcon size={12} />
            </button>
            <Panel id={item.id} open={isOpen}>
              {item.content}
            </Panel>
          </div>
        );
      })}
    </div>
  );
}
