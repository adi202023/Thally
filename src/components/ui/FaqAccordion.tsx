"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: FaqItem[];
  title?: string;
}

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "How do I enable Smart Sync?",
    answer: "Go to Project Settings → Smart Sync, select your documentation sources and sync frequency, then click Enable Smart Sync. Requires the project:write scope.",
  },
  {
    question: "What repositories can Thally connect to?",
    answer: "Thally supports GitHub, GitLab, and Bitbucket repositories. Connect via Project Settings → Repository using a personal access token with the repo scope.",
  },
  {
    question: "How is documentation reviewed before publishing?",
    answer: "Every AI-generated proposal goes through a human review gate. A maintainer must explicitly approve or reject the proposal before it can be deployed to the live documentation portal.",
  },
  {
    question: "Can I customize sync frequency?",
    answer: "Yes. You can set the frequency to Manual, Hourly, Daily, or Weekly in Project Settings → Smart Sync. The default is Manual.",
  },
];

export function FaqAccordion({
  items = DEFAULT_ITEMS,
  title,
  className,
  ...props
}: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={cn("w-full mx-auto relative font-sans", className)} {...props}>
      {title && (
        <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground mb-3">
          {title}
        </h3>
      )}

      <ul className="w-full mx-auto list-none p-0 flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <li
              key={index}
              className={cn(
                "w-full relative transition-all duration-300 ease-in",
                "border-b border-border last:border-b-0",
                isActive ? "border-b border-border" : ""
              )}
            >
              <button
                className={cn(
                  "flex flex-row items-center justify-start w-full min-h-[56px] py-4 relative m-0 px-4 pl-12 sm:pl-14 cursor-pointer",
                  "border-l-[6px] md:border-l-[8px] transition-colors duration-200 text-left outline-none text-sm md:text-base border-none",
                  isActive
                    ? "border-l-foreground dark:border-l-white bg-muted/60 dark:bg-white/10 text-foreground font-semibold"
                    : "border-l-border dark:border-l-white/20 bg-transparent text-muted-foreground hover:border-l-foreground/60 dark:hover:border-l-white/60 hover:text-foreground hover:bg-muted/40 dark:hover:bg-white/5"
                )}
                style={{
                  borderLeftStyle: 'solid',
                  borderLeftWidth: '6px',
                  borderLeftColor: isActive ? 'currentColor' : undefined,
                }}
                onClick={() => toggleItem(index)}
                aria-expanded={isActive}
              >
                {/* Plus/Minus Icon */}
                <span
                  className={cn(
                    "absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 transition-all duration-200 leading-none select-none",
                    isActive
                      ? "text-[26px] sm:text-[32px] font-normal text-foreground"
                      : "text-[20px] sm:text-[24px] font-normal text-muted-foreground"
                  )}
                >
                  {isActive ? "−" : "+"}
                </span>

                <span className="pr-8 font-medium text-foreground">{item.question}</span>

                {/* Chevron */}
                <span
                  className={cn(
                    "absolute right-5 block w-2 h-2 border-t-[2.5px] border-r-[2.5px] transition-transform duration-200 ease-in-out",
                    isActive
                      ? "rotate-[-44deg] border-foreground"
                      : "rotate-[133deg] border-muted-foreground"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out w-full",
                  isActive
                    ? "grid-rows-[1fr] bg-muted/60 dark:bg-white/10 border-l-[6px]"
                    : "grid-rows-[0fr] bg-transparent border-l-[6px] border-l-transparent"
                )}
                style={{
                  borderLeftStyle: 'solid',
                  borderLeftWidth: '6px',
                  borderLeftColor: isActive ? 'currentColor' : 'transparent',
                }}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-row items-start justify-start w-full px-4 pl-12 sm:pl-14 pb-5 pt-1 text-xs sm:text-sm font-normal text-muted-foreground leading-relaxed">
                    <span className="opacity-95 text-foreground/90">{item.answer}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FaqAccordion;
