import React, { useState, useEffect } from 'react';
import { Clock, Timer, CheckCircle2, Calendar, Radio, ArrowRight, Zap } from 'lucide-react';

interface TripCountdownTimerProps {
  travelDate: string;
  pickupTime: string;
  confirmedAt?: string | number | Date;
  driverName?: string;
  vehicleModel?: string;
}

export const TripCountdownTimer: React.FC<TripCountdownTimerProps> = ({
  travelDate,
  pickupTime,
  confirmedAt,
  driverName,
  vehicleModel
}) => {
  const [viewMode, setViewMode] = useState<'until_trip' | 'since_confirmed'>('until_trip');
  const [now, setNow] = useState<number>(Date.now());

  // Fixed confirmation timestamp fallback
  const [bookingConfirmedTime] = useState<number>(() => {
    if (confirmedAt) {
      const parsed = new Date(confirmedAt).getTime();
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return Date.now();
  });

  // Calculate target trip timestamp
  const getTargetTripTime = (): number => {
    try {
      if (!travelDate) return Date.now() + 3600 * 1000; // default 1 hr

      let datePart = travelDate.trim();
      let timePart = (pickupTime || '10:00').trim();

      // Normalize 12hr format like "10:30 am" or "02:45 PM"
      let hours = 10;
      let minutes = 0;

      const isPM = /pm/i.test(timePart);
      const isAM = /am/i.test(timePart);
      const cleanTime = timePart.replace(/am|pm/gi, '').trim();
      const parts = cleanTime.split(':');

      if (parts.length >= 1) {
        hours = parseInt(parts[0], 10) || 0;
        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
      }
      if (parts.length >= 2) {
        minutes = parseInt(parts[1], 10) || 0;
      }

      const [yearStr, monthStr, dayStr] = datePart.split('-');
      if (yearStr && monthStr && dayStr) {
        const target = new Date(
          parseInt(yearStr, 10),
          parseInt(monthStr, 10) - 1,
          parseInt(dayStr, 10),
          hours,
          minutes,
          0,
          0
        );
        return target.getTime();
      }

      // If parsing fails, create safe target
      const parsedDate = new Date(`${datePart} ${cleanTime}`);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.getTime();
      }
    } catch {
      // ignore parsing error
    }
    return Date.now() + 3600 * 1000;
  };

  const targetTripTime = getTargetTripTime();

  // Tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time remaining until trip
  const diffRemaining = Math.max(0, targetTripTime - now);
  const isTripTimeArrived = targetTripTime <= now;

  const remDays = Math.floor(diffRemaining / (1000 * 60 * 60 * 24));
  const remHours = Math.floor((diffRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const remMinutes = Math.floor((diffRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const remSeconds = Math.floor((diffRemaining % (1000 * 60)) / 1000);

  // Time elapsed since confirmation
  const diffElapsed = Math.max(0, now - bookingConfirmedTime);
  const elpHours = Math.floor(diffElapsed / (1000 * 60 * 60));
  const elpMinutes = Math.floor((diffElapsed % (1000 * 60 * 60)) / (1000 * 60));
  const elpSeconds = Math.floor((diffElapsed % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#003840] rounded-2xl p-4 text-white border border-teal-500/30 shadow-xl overflow-hidden relative">
      
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
            {viewMode === 'until_trip' ? (
              <Timer className="w-4 h-4 animate-pulse" />
            ) : (
              <Clock className="w-4 h-4 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              <span>{viewMode === 'until_trip' ? 'Trip Countdown' : 'Confirmation Tracker'}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {viewMode === 'until_trip' 
                ? (isTripTimeArrived ? 'Scheduled time reached' : 'Live time remaining until pickup') 
                : 'Time elapsed since ride confirmed'}
            </div>
          </div>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('until_trip')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'until_trip'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Until Trip
          </button>
          <button
            type="button"
            onClick={() => setViewMode('since_confirmed')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'since_confirmed'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Since Confirmed
          </button>
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="py-3 relative z-10">
        {viewMode === 'until_trip' ? (
          isTripTimeArrived ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3.5 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                                <span>Scheduled Pickup Time Reached!</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Your chauffeur {driverName ? <strong>{driverName}</strong> : ''} is on standby at your pickup point with OTP verification.
              </p>
              <div className="text-[10px] text-teal-400 font-mono pt-1">
                Elapsed since booking: {pad(elpHours)}h {pad(elpMinutes)}m {pad(elpSeconds)}s
              </div>
            </div>
          ) : (
            <div>
              {/* 4 Unit Box Grid */}
              <div className="grid grid-cols-4 gap-2">
                {/* Days */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 text-center shadow-inner group hover:border-teal-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white group-hover:text-teal-300 transition-colors">
                    {pad(remDays)}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                    Days
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 text-center shadow-inner group hover:border-teal-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white group-hover:text-teal-300 transition-colors">
                    {pad(remHours)}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                    Hours
                  </div>
                </div>

                {/* Minutes */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2.5 text-center shadow-inner group hover:border-teal-500/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white group-hover:text-teal-300 transition-colors">
                    {pad(remMinutes)}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                    Mins
                  </div>
                </div>

                {/* Seconds with glowing live ring */}
                <div className="bg-teal-950/60 border border-teal-500/50 rounded-xl p-2.5 text-center shadow-inner relative overflow-hidden">
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-teal-300">
                    {pad(remSeconds)}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider font-bold text-teal-400/90 mt-0.5 flex items-center justify-center gap-1">
                    <span>Secs</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Target Datetime summary subtitle */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-teal-400" />
                  <span>Pickup: <strong className="text-slate-200">{travelDate}</strong> at <strong className="text-slate-200">{pickupTime}</strong></span>
                </div>
                <div className="text-teal-400/90 font-medium hidden sm:block">
                  Confirmed {elpMinutes > 0 ? `${elpMinutes}m ` : ''}{elpSeconds}s ago
                </div>
              </div>
            </div>
          )
        ) : (
          /* Mode B: Time Elapsed since booking confirmation */
          <div className="bg-slate-900/90 border border-cyan-800/40 rounded-xl p-3 text-center space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Confirmation Stopwatch</span>
            </div>

            {/* Stopwatch Big Display */}
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-cyan-300 py-1">
              <span>{pad(elpHours)}</span>
              <span className="text-slate-500 animate-pulse">:</span>
              <span>{pad(elpMinutes)}</span>
              <span className="text-slate-500 animate-pulse">:</span>
              <span className="text-white">{pad(elpSeconds)}</span>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-2 border-t border-slate-800/80 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Booking Confirmed • Chauffeur details coordinated directly via WhatsApp</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Mini Status Bar */}
      <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-slate-300">Live GPS Dispatch Sync</span>
        </div>
        <span className="text-slate-400">
          {vehicleModel ? vehicleModel : 'AC Cab'} • Zero Delay Guarantee
        </span>
      </div>

    </div>
  );
};
