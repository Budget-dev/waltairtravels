import re

with open('src/pages/BookingPage.tsx', 'r') as f:
    content = f.read()

# First, extract the summary block from the backup to recreate the sidebar
with open('/tmp/booking_page_backup.tsx', 'r') as f:
    backup_content = f.read()

pattern_summary = re.compile(r'\{/\* Pinned Summary Card at Top \(Always visible without scrolling\) \*/\}\s*\{step < 4 && \(\s*<div\s*id="booking-summary-top-card".*?</div>\s*</div>\s*\)\}', re.DOTALL)
summary_match = pattern_summary.search(backup_content)
if summary_match:
    summary_code = summary_match.group(0)
    sidebar_summary = summary_code.replace('id="booking-summary-top-card"', 'id="booking-summary-sidebar"')
    sidebar_summary = sidebar_summary.replace('bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/90 px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-xs shrink-0 z-10', 'bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24')
    sidebar_summary = sidebar_summary.replace('flex flex-col sm:flex-row sm:items-center justify-between gap-2', 'flex flex-col gap-5')
    sidebar_summary = sidebar_summary.replace('border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-1.5 sm:pt-0 sm:pl-3', 'border-t border-slate-100 pt-4')
else:
    sidebar_summary = ""

# The current file ends with:
#         </div>
#       </div>
#     </div>
#   );
# };
# We need to replace the last `</div></div></div>);};` with the proper closing structure.

def replace_end(match):
    return f"""
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
"""

content = re.sub(r'</div>\s*</div>\s*</div>\s*\)\;\s*\}\s*;?\s*$', replace_end, content)

with open('src/pages/BookingPage.tsx', 'w') as f:
    f.write(content)

