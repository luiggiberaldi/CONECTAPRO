"use client";

import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function ProfesionesSection() {
  const testimonials = [
    {
      quote:
        "Nuestros plomeros verificados resuelven cualquier filtración, atasco, reparación de tuberías o instalación de grifería en tiempo récord. Servicio técnico de confianza para tu hogar o comercio.",
      name: "Servicios de Plomería",
      designation: "Filtraciones, destapes e instalaciones",
      src: "/images/plomero.png",
      stats: [
        { value: "45 min", label: "Respuesta Promedio" },
        { value: "100%", label: "Pago Directo sin Comisión" }
      ],
      tags: ["Filtraciones", "Destapes urgentes", "Reparación de tuberías", "Grifería", "Bombas de agua"],
      review: {
        text: "El técnico llegó súper rápido para resolver un destape en mi baño. Muy ordenado y profesional.",
        author: "María Alejandra G.",
        role: "Cliente en Chacao",
        stars: 5
      },
      ctaText: "Buscar Plomeros Disponibles",
      ctaLink: "/buscar?servicio=plomeria"
    },
    {
      quote:
        "Enfermeros dedicados al cuidado de adultos mayores, administración de tratamientos, curas y asistencia postoperatoria. Cuidado de la salud y bienestar en la comodidad de tu hogar.",
      name: "Servicios de Enfermería",
      designation: "Asistencia médica y cuidados a domicilio",
      src: "/images/enfermero.png",
      stats: [
        { value: "24/7", label: "Disponibilidad de Guardia" },
        { value: "Colegiado", label: "Personal Certificado" }
      ],
      tags: ["Adulto mayor", "Curaciones a domicilio", "Tratamientos", "Asistencia postoperatoria", "Guardias 24h"],
      review: {
        text: "Excelente atención para mi abuelo después de su operación. La enfermera fue muy atenta, cariñosa y profesional.",
        author: "José Luis M.",
        role: "Cliente en Baruta",
        stars: 5
      },
      ctaText: "Buscar Enfermeros Disponibles",
      ctaLink: "/buscar?servicio=enfermeria"
    },
    {
      quote:
        "Expertos electricistas listos para diagnosticar fallas de iluminación, cortocircuitos, reparaciones de tableros e instalaciones eléctricas generales de forma 100% segura.",
      name: "Servicios de Electricidad",
      designation: "Cortocircuitos, cableado y mantenimiento",
      src: "/images/electricista.png",
      stats: [
        { value: "Urgencias", label: "Atención Inmediata" },
        { value: "Certificados", label: "Garantía de Seguridad" }
      ],
      tags: ["Cortocircuitos", "Tableros eléctricos", "Iluminación LED", "Acometidas", "Mantenimiento preventivo"],
      review: {
        text: "Resolvió un cortocircuito en el tablero principal en menos de una hora. Servicio 100% seguro y recomendado.",
        author: "Patricia R.",
        role: "Cliente en El Hatillo",
        stars: 5
      },
      ctaText: "Buscar Electricistas Disponibles",
      ctaLink: "/buscar?servicio=electricidad"
    },
  ];

  return (
    <section className="w-full py-16 mt-16 border-t border-zinc-200/50 dark:border-zinc-800/50">
      <div className="max-w-3xl mx-auto text-center mb-10 px-4">
        <span className="text-xs font-bold tracking-widest text-indigo-650 dark:text-indigo-400 uppercase">
          Especialidades
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50">
          Servicios Profesionales a tu Disposición
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg mx-auto">
          Conecta directamente con profesionales calificados y valorados por la comunidad en las áreas de mayor demanda.
        </p>
      </div>

      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </section>
  );
}
