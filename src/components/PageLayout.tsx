import React from 'react';
import { ChevronRight, ArrowLeft, Phone, Calendar, ShieldCheck } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageLayoutProps {
  title: string;
  subtitle: string;
  categoryBadge?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
  onNavigateHome: () => void;
  onOpenBooking?: () => void;
  ctaText?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  categoryBadge = 'Waltair Travels Official',
  breadcrumbs,
  children,
  onNavigateHome,
  onOpenBooking,
  ctaText = 'Book This Ride Now',
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 pt-8 pb-12 sm:pb-16 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-cyan-400 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              Home
            </button>

            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-cyan-400 font-medium transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-cyan-400 font-semibold truncate max-w-xs">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Title and Action Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{categoryBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onOpenBooking && (
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{ctaText}</span>
                </button>
              )}

              <a
                href="tel:+919123456789"
                className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+91 91234 56789</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {children}
      </main>

      {/* Bottom Sticky Floating CTA Bar for mobile */}
      {onOpenBooking && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 text-white font-bold text-xs tracking-wider uppercase text-center shadow-md"
          >
            {ctaText}
          </button>
          <a
            href="tel:+919123456789"
            className="p-3 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 shrink-0"
            aria-label="Call Waltair Travels"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};
