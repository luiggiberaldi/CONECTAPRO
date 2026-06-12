'use client';

import React, { useState } from 'react';
import { tokens, getOrdenColor, getRolColor } from '@/lib/tokens';

export default function TokensPreview() {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'elevation'>('colors');

  // Only render during development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-bg-base text-text-primary p-6 md:p-10 border border-border-default rounded-3xl shadow-lg mt-8">
      {/* Header */}
      <header className="mb-8 border-b border-border-default pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-4 w-4 rounded-full bg-brand-primary animate-pulse" />
          <h1 className="text-3xl font-black tracking-tight font-sans">
            ConectaPro <span className="text-brand-accent">Design Tokens</span>
          </h1>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Visual assurance utility for the ConectaPro Design System. This dashboard renders raw and semantic tokens directly compiled from CSS Custom Properties, Tailwind Configuration, and TypeScript exports.
        </p>
      </header>

      {/* Tabs */}
      <nav className="flex gap-2 mb-8 bg-bg-surface p-1 rounded-2xl border border-border-subtle max-w-md">
        {(['colors', 'typography', 'spacing', 'elevation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-normal ${
              activeTab === tab
                ? 'bg-brand-primary text-text-inverse shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-base'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="space-y-12">
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <section className="space-y-10 animate-slide-in">
            {/* Raw Colors */}
            <div>
              <h2 className="text-lg font-bold border-b border-border-subtle pb-2 mb-6">1. Raw Palette Scales</h2>
              <div className="space-y-6">
                {/* Indigo */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Indigo (Primary)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
                    {Object.entries(tokens.colors.indigo).map(([stop, hex]) => (
                      <div key={stop} className="flex flex-col gap-1.5">
                        <div
                          className="h-16 w-full rounded-xl border border-border-subtle shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <div className="px-1">
                          <p className="text-[10px] font-bold">indigo-{stop}</p>
                          <p className="text-[9px] text-text-muted uppercase">{hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rose */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Rose (Accent)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {Object.entries(tokens.colors.rose).map(([stop, hex]) => (
                      <div key={stop} className="flex flex-col gap-1.5">
                        <div
                          className="h-16 w-full rounded-xl border border-border-subtle shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <div className="px-1">
                          <p className="text-[10px] font-bold">rose-{stop}</p>
                          <p className="text-[9px] text-text-muted uppercase">{hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zinc */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Zinc (Neutral Base)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-11 gap-3">
                    {Object.entries(tokens.colors.zinc).map(([stop, hex]) => (
                      <div key={stop} className="flex flex-col gap-1.5">
                        <div
                          className="h-16 w-full rounded-xl border border-border-subtle shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <div className="px-1">
                          <p className="text-[10px] font-bold">zinc-{stop}</p>
                          <p className="text-[9px] text-text-muted uppercase">{hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Semantic Mappings */}
            <div>
              <h2 className="text-lg font-bold border-b border-border-subtle pb-2 mb-6">2. Semantic Color Mappings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Brand */}
                <div className="bg-bg-surface p-4 rounded-2xl border border-border-default shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Brand Colors</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-bg-base rounded-xl">
                      <div className="h-8 w-8 rounded-lg bg-brand-primary" />
                      <div>
                        <p className="text-xs font-bold">brand.primary</p>
                        <p className="text-[10px] text-text-muted">Indigo 700 / 500</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-bg-base rounded-xl">
                      <div className="h-8 w-8 rounded-lg bg-brand-accent" />
                      <div>
                        <p className="text-xs font-bold">brand.accent</p>
                        <p className="text-[10px] text-text-muted">Rose 500 / 400</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="bg-bg-surface p-4 rounded-2xl border border-border-default shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Text Colors</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-bg-base rounded-xl">
                      <span className="text-xs font-bold text-text-primary">text.primary</span>
                      <span className="text-[10px] text-text-muted font-mono">var</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-bg-base rounded-xl">
                      <span className="text-xs font-bold text-text-secondary">text.secondary</span>
                      <span className="text-[10px] text-text-muted font-mono">var</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-bg-base rounded-xl">
                      <span className="text-xs font-bold text-text-muted">text.muted</span>
                      <span className="text-[10px] text-text-muted font-mono">var</span>
                    </div>
                  </div>
                </div>

                {/* Backgrounds */}
                <div className="bg-bg-surface p-4 rounded-2xl border border-border-default shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Backgrounds</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-bg-base border border-border-default rounded-xl">
                      <div className="h-6 w-6 rounded bg-bg-base border border-border-strong" />
                      <span className="text-xs font-bold">bg.base</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-bg-base border border-border-default rounded-xl">
                      <div className="h-6 w-6 rounded bg-bg-surface border border-border-default" />
                      <span className="text-xs font-bold">bg.surface</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-bg-base border border-border-default rounded-xl">
                      <div className="h-6 w-6 rounded bg-bg-elevated shadow-sm border border-border-subtle" />
                      <span className="text-xs font-bold">bg.elevated</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-bg-surface p-4 rounded-2xl border border-border-default shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Statuses</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-status-success rounded-lg text-xs font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full bg-status-success" />
                      status.success
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-status-warning rounded-lg text-xs font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full bg-status-warning" />
                      status.warning
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-status-error rounded-lg text-xs font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full bg-status-error" />
                      status.error
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges and Helper Preview */}
            <div>
              <h2 className="text-lg font-bold border-b border-border-subtle pb-2 mb-6">3. Helper Functions & Role Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Roles Badges */}
                <div className="bg-bg-surface p-5 rounded-2xl border border-border-default shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">getRolColor() Preview</h3>
                  <div className="flex flex-col gap-2">
                    {(['cliente', 'profesional', 'admin'] as const).map((role) => {
                      const colors = getRolColor(role);
                      return (
                        <div key={role} className="flex justify-between items-center p-2.5 bg-bg-base rounded-xl">
                          <span className="text-xs capitalize font-medium">{role}</span>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${colors.badge}`}>
                            {role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Status Badges */}
                <div className="bg-bg-surface p-5 rounded-2xl border border-border-default shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">getOrdenColor() Preview</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {(['pendiente', 'en_proceso', 'completada', 'cancelada'] as const).map((status) => {
                      const colors = getOrdenColor(status);
                      return (
                        <div key={status} className="flex justify-between items-center p-2 bg-bg-base rounded-xl">
                          <span className="text-xs capitalize font-medium">{status.replace('_', ' ')}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors.badge}`}>
                            {status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <section className="space-y-8 animate-slide-in">
            <h2 className="text-lg font-bold border-b border-border-subtle pb-2 mb-6">Typography Token Scale</h2>
            <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="flex border-b border-border-subtle pb-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  <div className="w-24">Token Size</div>
                  <div className="w-24">Equivalent</div>
                  <div className="flex-1">Render Preview</div>
                </div>

                {Object.entries(tokens.typography.fontSize).map(([size, value]) => (
                  <div key={size} className="flex items-center py-2 border-b border-border-subtle/50 text-sm">
                    <div className="w-24 font-bold text-brand-primary">font-size-{size}</div>
                    <div className="w-24 text-text-secondary text-xs">{value}</div>
                    <div className="flex-1 truncate" style={{ fontSize: value }}>
                      ConectaPro Venezuela — {size}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Spacing Tab */}
        {activeTab === 'spacing' && (
          <section className="space-y-8 animate-slide-in">
            <h2 className="text-lg font-bold border-b border-border-subtle pb-2 mb-6">Spacing Tokens (4px Grid Scale)</h2>
            <div className="bg-bg-surface p-6 rounded-2xl border border-border-default shadow-sm space-y-4">
              {Object.entries(tokens.spacing).map(([token, val]) => (
                <div key={token} className="flex items-center gap-4 text-xs">
                  <div className="w-16 font-bold text-brand-primary">space-{token}</div>
                  <div className="w-16 text-text-muted">{val}</div>
                  <div className="flex-1 bg-bg-base h-6 rounded-lg overflow-hidden border border-border-subtle">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-l-md transition-all duration-normal"
                      style={{ width: val }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Elevation Tab */}
        {activeTab === 'elevation' && (
          <section className="space-y-10 animate-slide-in">
            <div>
              <h2 className="text-lg font-bold border-b border-border-subtle pb-2 mb-6">Elevation & Shadows</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['sm', 'md', 'lg'] as const).map((shadow) => (
                  <div
                    key={shadow}
                    className={`bg-bg-surface p-6 rounded-2xl border border-border-default flex flex-col justify-between h-40 transition-all duration-normal shadow-${shadow}`}
                  >
                    <p className="text-xs font-bold text-brand-primary">shadow-{shadow}</p>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-text-primary">ConectaPro Elevación</h4>
                      <p className="text-[10px] text-text-muted">Optimizada para modo light y dark.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold border-b border-border-subtle pb-2 mb-6">Border Radius Scales</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 text-center">
                {Object.entries(tokens.borderRadius).map(([radius, value]) => (
                  <div key={radius} className="space-y-2">
                    <div
                      className="aspect-square bg-brand-primary/10 border-2 border-dashed border-brand-primary flex items-center justify-center font-bold text-xs"
                      style={{ borderRadius: value }}
                    >
                      {radius}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold">rounded-{radius}</p>
                      <p className="text-[9px] text-text-muted">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
