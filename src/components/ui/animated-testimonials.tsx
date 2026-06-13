"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  stats?: { label: string; value: string }[];
  tags?: string[];
  review?: {
    text: string;
    author: string;
    role: string;
    stars: number;
  };
  ctaText?: string;
  ctaLink?: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    setRotations(
      testimonials.map(() => Math.floor(Math.random() * 21) - 10)
    );
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="max-w-sm md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-10">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 lg:gap-24">
        <div>
          <div className="relative h-72 sm:h-[400px] md:h-[480px] lg:h-[520px] xl:h-[560px] w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotations[index] || 0,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : rotations[index] || 0,
                    zIndex: isActive(index)
                      ? 10
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotations[index] || 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={600}
                    height={600}
                    draggable={false}
                    priority={index === 0}
                    className="h-full w-full rounded-3xl object-cover object-center shadow-xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-2 lg:py-4 md:max-lg:py-1">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="flex flex-col flex-grow"
          >
            <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">
              {testimonials[active].designation}
            </span>
            <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black text-zinc-900 dark:text-zinc-50 mt-1 leading-tight">
              {testimonials[active].name}
            </h3>

            {/* Tags de Especialidades */}
            {testimonials[active].tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {testimonials[active].tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm lg:text-base text-zinc-650 dark:text-zinc-350 leading-relaxed mt-4 md:max-lg:mt-3">
              {testimonials[active].quote}
            </p>

            {/* Panel de estadísticas */}
            {testimonials[active].stats && (
              <div className="mt-5 pt-5 md:max-lg:mt-3.5 md:max-lg:pt-3.5 border-t border-zinc-200/50 dark:border-zinc-800/60 grid grid-cols-2 gap-3.5 md:max-lg:gap-2.5">
                {testimonials[active].stats.map((stat, i) => (
                  <div key={i} className="bg-zinc-50/60 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-850/40 p-3.5 md:max-lg:p-2.5 rounded-2xl">
                    <span className="block text-xl lg:text-2xl font-black text-indigo-650 dark:text-indigo-400">
                      {stat.value}
                    </span>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-0.5 block uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Testimonio Real Destacado (Social Proof) */}
            {testimonials[active].review && (
              <div className="mt-5 md:max-lg:mt-3.5 p-4 md:max-lg:p-3 rounded-2xl bg-zinc-50 border border-zinc-200/50 dark:bg-zinc-950/20 dark:border-zinc-850/40 relative overflow-hidden">
                <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                  {[...Array(testimonials[active].review.stars)].map((_, idx) => (
                    <svg
                      key={idx}
                      className="w-3.5 h-3.5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 ml-1">5.0</span>
                </div>
                <p className="text-xs lg:text-sm text-zinc-655 dark:text-zinc-300 italic leading-relaxed">
                  &ldquo;{testimonials[active].review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-2.5 pt-2.5 md:max-lg:mt-2 md:max-lg:pt-2 border-t border-zinc-200/50 dark:border-zinc-800/40">
                  <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                    {testimonials[active].review.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                      {testimonials[active].review.author}
                    </span>
                    <span className="block text-[10px] text-zinc-500 dark:text-zinc-400">
                      {testimonials[active].review.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Acción Directa (CTA) */}
            {testimonials[active].ctaText && (
              <div className="mt-5 md:max-lg:mt-3.5">
                <a
                  href={testimonials[active].ctaLink}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-650/10 hover:shadow-indigo-650/20 active:scale-98 transform duration-150 gap-2"
                >
                  {testimonials[active].ctaText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </motion.div>

          <div className="flex gap-4 pt-8 lg:pt-6 md:max-lg:pt-4">
            <button
              onClick={handlePrev}
              className="h-11 w-11 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center group/button transition-colors border border-zinc-200/45 dark:border-zinc-700/40 shadow-sm"
              aria-label="Testimonial anterior"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-800 dark:text-zinc-200 group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-11 w-11 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center group/button transition-colors border border-zinc-200/45 dark:border-zinc-700/40 shadow-sm"
              aria-label="Siguiente testimonial"
            >
              <ArrowRight className="h-5 w-5 text-zinc-800 dark:text-zinc-200 group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
