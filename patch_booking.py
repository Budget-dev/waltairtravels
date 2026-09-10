import re

with open('src/pages/BookingPage.tsx', 'r') as f:
    content = f.read()

# Replace BookingModal with BookingPage
content = content.replace('BookingModalProps', 'BookingPageProps')
content = content.replace('BookingModal: React.FC', 'BookingPage: React.FC')

# Remove isOpen and change the overlay to a page layout
# Find the start of the return statement
# Before:
#   if (!isOpen || !initialData) return null;
#   
#   // Fare calculations...
# ...
#   return (
#     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
#       {/* Backdrop */}
#       <div 
#         className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
#         onClick={onClose}
#       />
#       
#       <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] sm:h-[85vh] flex overflow-hidden flex-col animate-in zoom-in-95 duration-200">

# First, handle the isOpen
content = re.sub(r'if \(!isOpen \|\| !initialData\)', 'if (!initialData)', content)
# We might need to handle isOpen from the props list, but for now we can just ignore it or remove it. Let's remove isOpen completely.
content = re.sub(r'isOpen,\n\s*', '', content)
content = re.sub(r'isOpen: boolean;\n\s*', '', content)

# Now, replace the modal wrapper
modal_wrapper_pattern = r'<div className="fixed inset-0 z-50 flex items-center justify-center p-4(?: sm:p-6)?">\s*(?:\{/\* Backdrop \*/\}\s*)?<div\s*className="absolute inset-0 bg-[^"]+"\s*onClick=\{onClose\}\s*/>\s*<div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-\[90vh\] sm:h-\[85vh\] flex overflow-hidden flex-col[^"]*">'

page_wrapper = """<div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200 w-full flex overflow-hidden flex-col min-h-[75vh]">"""

content = re.sub(modal_wrapper_pattern, page_wrapper, content, count=1)

# Fix relative imports because it was moved from components to pages
content = content.replace("from '../types'", "from '../types'")
content = content.replace("from '../firebase'", "from '../firebase'")
content = content.replace("from './GooglePlacesAutocompleteInput'", "from '../components/GooglePlacesAutocompleteInput'")
content = content.replace("from './TripCountdownTimer'", "from '../components/TripCountdownTimer'")
content = content.replace("from '../hooks/", "from '../hooks/")
content = content.replace("from '../data/", "from '../data/")

with open('src/pages/BookingPage.tsx', 'w') as f:
    f.write(content)
