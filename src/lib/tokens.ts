/**
 * ============================================================================
 * CONECTAPRO DESIGN TOKENS
 * ============================================================================
 * Centralized design token repository for the ConectaPro PWA.
 * Strictly typed and mapped to CSS variables for dynamic theme switching.
 */

import { RolUsuario, EstadoOrden } from '@/types';

export type AuthRole = RolUsuario;
export type OrdenEstado = EstadoOrden;

export const tokens = {
  colors: {
    // Raw Palette
    indigo: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
    rose: {
      400: '#FB7185',
      500: '#F43F5E',
      600: '#E11D48',
    },
    zinc: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
      950: '#09090B',
    },
    // Raw Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#F43F5E',
      info: '#4338CA',
    },
    // Semantic Reference Mappings (CSS variables)
    semantic: {
      brand: {
        primary: 'var(--brand-primary)',
        accent: 'var(--brand-accent)',
      },
      text: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        inverse: 'var(--text-inverse)',
      },
      bg: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        dark: 'var(--bg-dark)',
      },
      border: {
        default: 'var(--border-default)',
        subtle: 'var(--border-subtle)',
        strong: 'var(--border-strong)',
      },
      status: {
        success: 'var(--status-success)',
        warning: 'var(--status-warning)',
        error: 'var(--status-error)',
        info: 'var(--status-info)',
      },
    },
  },

  typography: {
    fontFamily: {
      sans: 'var(--font-outfit), system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
    lineHeight: {
      tight: '1.2',
      snug: '1.4',
      normal: '1.6',
      relaxed: '1.8',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    toast: 50,
    tooltip: 60,
  },

  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    easing: {
      default: 'cubic-bezier(0.16, 1, 0.3, 1)',
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
    },
  },
} as const;

export type DesignTokens = typeof tokens;

/**
 * Helper function to retrieve the dynamic tailwind color classes for a given order status.
 */
export function getOrdenColor(estado: OrdenEstado) {
  switch (estado) {
    case 'pendiente':
      return {
        bg: 'bg-[var(--orden-pendiente-bg)]',
        text: 'text-[var(--orden-pendiente-text)]',
        border: 'border-[var(--orden-pendiente-border)]',
        badge: 'bg-[var(--orden-pendiente-bg)] text-[var(--orden-pendiente-text)] border-[var(--orden-pendiente-border)] border',
      };
    case 'en_proceso':
      return {
        bg: 'bg-[var(--orden-en-proceso-bg)]',
        text: 'text-[var(--orden-en-proceso-text)]',
        border: 'border-[var(--orden-en-proceso-border)]',
        badge: 'bg-[var(--orden-en-proceso-bg)] text-[var(--orden-en-proceso-text)] border-[var(--orden-en-proceso-border)] border',
      };
    case 'completada':
      return {
        bg: 'bg-[var(--orden-completada-bg)]',
        text: 'text-[var(--orden-completada-text)]',
        border: 'border-[var(--orden-completada-border)]',
        badge: 'bg-[var(--orden-completada-bg)] text-[var(--orden-completada-text)] border-[var(--orden-completada-border)] border',
      };
    case 'cancelada':
      return {
        bg: 'bg-[var(--orden-cancelada-bg)]',
        text: 'text-[var(--orden-cancelada-text)]',
        border: 'border-[var(--orden-cancelada-border)]',
        badge: 'bg-[var(--orden-cancelada-bg)] text-[var(--orden-cancelada-text)] border-[var(--orden-cancelada-border)] border',
      };
  }
}

/**
 * Helper function to retrieve the dynamic tailwind color classes for a given user role.
 */
export function getRolColor(rol: AuthRole) {
  switch (rol) {
    case 'cliente':
      return {
        bg: 'bg-[var(--badge-cliente-bg)]',
        text: 'text-[var(--badge-cliente-text)]',
        border: 'border-[var(--badge-cliente-border)]',
        badge: 'bg-[var(--badge-cliente-bg)] text-[var(--badge-cliente-text)] border-[var(--badge-cliente-border)] border',
      };
    case 'profesional':
      return {
        bg: 'bg-[var(--badge-profesional-bg)]',
        text: 'text-[var(--badge-profesional-text)]',
        border: 'border-[var(--badge-profesional-border)]',
        badge: 'bg-[var(--badge-profesional-bg)] text-[var(--badge-profesional-text)] border-[var(--badge-profesional-border)] border',
      };
    case 'admin':
      return {
        bg: 'bg-[var(--badge-admin-bg)]',
        text: 'text-[var(--badge-admin-text)]',
        border: 'border-[var(--badge-admin-border)]',
        badge: 'bg-[var(--badge-admin-bg)] text-[var(--badge-admin-text)] border-[var(--badge-admin-border)] border',
      };
  }
}
