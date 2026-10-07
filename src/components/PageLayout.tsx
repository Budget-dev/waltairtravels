import React from 'react';
import { ChevronRight, Phone, Calendar, ShieldCheck } from 'lucide-react';

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
  heroImage?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  categoryBadge = 'Waltair Cabs Official',
  breadcrumbs,
  children,
  onNavigateHome,
  onOpenBooking,
  ctaText = 'Book This Ride Now',
  heroImage = '/hero-banner.png',
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 sm:pb-8">
      <div className="relative overflow-hidden border-b border-teal-900/40 bg-slate-950">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover object-center scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Golden-Hour%20Airport%20Taxi%20Arrival%20(1).png';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-teal-950/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        <div className="absolute -top-24 right-0 w-[32rem] h-[32rem] bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-10 sm:pb-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-300 mb-6 flex-wrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-white font-medium transition-colors cursor-pointer"
            >
              Home
            </button>

            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-white font-medium transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-teal-200 font-semibold truncate max-w-xs">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/15 border border-teal-300/30 text-teal-200 text-[11px] font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>{categoryBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                {subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-200">
                <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Commercial Chauffeurs</span>
                <span className="flex items-center gap-1.5 font-medium"><Phone className="w-4 h-4 text-teal-300" /> 24/7 Airport Standby</span>
                <span className="flex items-center gap-1.5 font-bold text-amber-300">★ 4.9/5 Rating (50,000+ Rides)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onOpenBooking && (
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-950/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{ctaText}</span>
                </button>
              )}

              <a
                href="tel:+919110510236"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-teal-300" />
                <span>+91 91105 10236</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {children}
      </main>
    </div>
  );
};
