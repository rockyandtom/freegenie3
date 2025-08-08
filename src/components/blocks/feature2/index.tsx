"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import Icon from "@/components/icon";
import { Section as SectionType } from "@/types/blocks/section";

const DURATION = 5000;

export default function Feature2({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const [currentAccordion, setCurrentAccordion] = useState("1");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAccordion((prev) => {
        const next = parseInt(prev) + 1;
        return next > 3 ? "1" : next.toString();
      });
    }, DURATION);

    return () => clearInterval(interval);
  }, [currentAccordion]);

  return (
    <section id={section.name} className="py-20">
      <div className="container">
        <div className="mx-auto grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            {section.label && (
              <Badge variant="outline" className="mb-4">
                {section.label}
              </Badge>
            )}
            <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
              {section.title}
            </h2>
            <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
              {section.description}
            </p>
            <Accordion
              type="single"
              value={currentAccordion}
              onValueChange={(value) => {
                setCurrentAccordion(value);
              }}
            >
              {section.items?.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={(i + 1).toString()}
                  className="border-b-0 border-secondary"
                >
                  <AccordionTrigger className="text-left data-[state=closed]:text-muted-foreground">
                    <div className="flex items-center justify-between gap-2">
                      {item.icon && (
                        <p className="flex size-9 items-center justify-center rounded-lg bg-muted">
                          <Icon
                            name={item.icon}
                            className="size-5 shrink-0 lg:size-6"
                          />
                        </p>
                      )}
                      <span className="font-medium lg:text-lg">
                        {item.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground lg:text-base">
                    {item.description}
                    <div className="mt-8 h-px bg-muted">
                      <div
                        className="h-px animate-progress bg-primary"
                        style={{
                          animationDuration: `${DURATION}ms`,
                        }}
                      ></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="flex items-start justify-center lg:items-center">
            {/* Fixed video display for 2.mp4 */}
            <div className="relative w-full">
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border/20 bg-gradient-to-br from-muted/50 to-muted/20 shadow-2xl backdrop-blur-sm">
                <video
                  src="/imgs/features/2.mp4"
                  className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/20 to-primary/30 blur-lg opacity-50"></div>
              <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary/60 blur-sm"></div>
              <div className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-purple-500/40 blur-md"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
