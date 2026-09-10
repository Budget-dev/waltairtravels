import re

with open('src/pages/BookingPage.tsx', 'r') as f:
    content = f.read()

# Replace the specific div structure with a page structure
content = content.replace(
    '<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">',
    '<div className="w-full max-w-3xl mx-auto py-6 sm:py-12 px-4 sm:px-6 min-h-[85vh] animate-in fade-in duration-200">'
)

content = content.replace(
    '<div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]">',
    '<div className="bg-white w-full rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col">'
)

# Remove the close button which uses onClose
content = re.sub(
    r'<button\s*onClick=\{onClose\}\s*className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"\s*aria-label="Close"\s*>\s*<X className="w-5 h-5" />\s*</button>',
    '',
    content
)

# If there's an onClose in props, rename it to onNavigateHome or similar, but since we are replacing it, let's just make it onNavigateHome
content = content.replace('onClose,', 'onNavigateHome,')
content = content.replace('onClose: () => void;', 'onNavigateHome: () => void;')
content = content.replace('onClose()', 'onNavigateHome()')

with open('src/pages/BookingPage.tsx', 'w') as f:
    f.write(content)

