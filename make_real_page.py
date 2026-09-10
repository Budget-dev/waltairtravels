import re

with open('src/pages/BookingPage.tsx', 'r') as f:
    content = f.read()

# Change the outermost wrappers to be a standard page wrapper
# Remove:
# <div className="w-full max-w-3xl mx-auto py-6 sm:py-12 px-4 sm:px-6 min-h-[85vh] animate-in fade-in duration-200">
#   <div className="bg-white w-full rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col">
#     {/* Modal Header */}
#     <div className="bg-gradient-to-r from-slate-900 via-[#005a66] to-slate-900 text-white p-4 sm:p-5 relative shrink-0">

# Replace with:
page_header = """
<div className="animate-in fade-in duration-200 bg-slate-50 min-h-screen pb-12">
  {/* Page Header */}
  <div className="bg-slate-900 text-white border-b border-cyan-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-wider mb-2">
            <Car className="w-5 h-5" />
            <span>Waltair Express Booking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {step === 4 ? '🎉 Booking Confirmed!' : 'Complete Your Reservation'}
          </h1>
        </div>
        
        {/* Stepper indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm border border-slate-700">
            <span className={`px-3 py-1.5 rounded-lg transition-colors ${step >= 1 ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : ''}`}>
              1. Trip & Route
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className={`px-3 py-1.5 rounded-lg transition-colors ${step >= 2 ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : ''}`}>
              2. Select Cab
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className={`px-3 py-1.5 rounded-lg transition-colors ${step >= 3 ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : ''}`}>
              3. Passenger & Fare
            </span>
          </div>
        )}
      </div>
    </div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Content */}
      <div className="lg:col-span-8 flex flex-col gap-6">
"""

# Pattern to replace everything up to the Stepper closing bracket
pattern_header = re.compile(
    r'<div className="w-full max-w-3xl mx-auto py-6 sm:py-12 px-4 sm:px-6 min-h-\[85vh\] animate-in fade-in duration-200">\s*<div className="bg-white w-full rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col">\s*\{/\* Modal Header \*/\}\s*<div className="bg-gradient-to-r from-slate-900 via-\[#005a66\] to-slate-900 text-white p-4 sm:p-5 relative shrink-0">.*?\{/\* Stepper indicator \*/\}.*?\)\}\s*</div>',
    re.DOTALL
)

content = pattern_header.sub(page_header, content)


# Now, wrap the "Summary card" into the right column (lg:col-span-4)
# We need to extract the summary card.
pattern_summary = re.compile(r'\{/\* Pinned Summary Card at Top \(Always visible without scrolling\) \*/\}\s*\{step < 4 && \(\s*<div\s*id="booking-summary-top-card".*?</div>\s*</div>\s*\)\}', re.DOTALL)

summary_match = pattern_summary.search(content)
if summary_match:
    summary_code = summary_match.group(0)
    # Remove it from the original spot
    content = content.replace(summary_code, '')
    
    # We want the summary to appear on the right side.
    # We can inject it at the end of the form column (lg:col-span-8) closing, but wait, JSX needs one parent for the 2 columns.
    # The current code closes the two outermost divs at the very bottom.
    
    # Let's adjust the summary code styling so it fits a sidebar panel perfectly instead of a top bar.
    sidebar_summary = summary_code.replace('id="booking-summary-top-card"', 'id="booking-summary-sidebar"')
    sidebar_summary = sidebar_summary.replace('bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/90 px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-xs shrink-0 z-10', 'bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24')
    sidebar_summary = sidebar_summary.replace('flex flex-col sm:flex-row sm:items-center justify-between gap-2', 'flex flex-col gap-5')
    sidebar_summary = sidebar_summary.replace('border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-1.5 sm:pt-0 sm:pl-3', 'border-t border-slate-100 pt-4')
    
    # Let's remove the `{/* Modal Content */}` wrapper since we already wrapped in `lg:col-span-8`
    content = content.replace('{/* Modal Content */}\n        <div className="p-4 sm:p-6 flex-1">', '')
    
    # At the end of the file, we have:
    #         </div>
    #       </div>
    #     </div>
    #   );
    
    # Let's replace the last 3 closing divs with the sidebar layout closings.
    # The 8-col ends, then we add the 4-col sidebar, then close the grid and outer container.
    
    # To do this safely, we will replace the return closing.
    # Replace: 
    #       </div>
    #     </div>
    #   );
    # With:
    #       </div>
    #       {/* Right Column: Sidebar */}
    #       <div className="lg:col-span-4 hidden lg:block">
    #          {sidebar_summary}
    #       </div>
    #     </div> {/* End Grid */}
    #   </div> {/* End Page Container */}
    # </div> {/* End Background Wrapper */}
    # );
    
    # But wait, mobile needs the summary too! 
    # We should render the summary in BOTH places: top for mobile (lg:hidden), right for desktop.
    mobile_summary = summary_code.replace('id="booking-summary-top-card"', 'id="booking-summary-mobile"')
    mobile_summary = mobile_summary.replace('bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/90 px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-xs shrink-0 z-10', 'bg-white shadow-sm border border-slate-200 rounded-2xl p-4 mb-4 lg:hidden')

    
    end_pattern = re.compile(r'\s*</form>\s*\)\}\s*\{/\* STEP 4: SUCCESS CONFIRMATION SLIP \*/\}.*?</div>\s*</div>\s*\)\;\s*\}\s*$', re.DOTALL)
    
    # The end of the file is tricky. Let's just find the last two `</div>\n    </div>\n  );`
    content = re.sub(r'</div>\s*</div>\s*\)\;\s*\}\s*$', f"""
      </div>
      
      {{/* Right Column: Sidebar (Desktop only) */}}
      <div className="lg:col-span-4 hidden lg:block">
        {sidebar_summary}
      </div>
      
    </div>
  </div>
</div>
  );
}}
""", content)

    # Insert mobile summary right after lg:col-span-8 opens
    content = content.replace('<div className="lg:col-span-8 flex flex-col gap-6">\n', f'<div className="lg:col-span-8 flex flex-col gap-6">\n{mobile_summary}\n')


# Change "Modal" texts to "Page"
content = content.replace('{/* Modal Content */}', '')
content = content.replace('{/* Modal Header */}', '')

with open('src/pages/BookingPage.tsx', 'w') as f:
    f.write(content)

