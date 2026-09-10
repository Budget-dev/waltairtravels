import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix semicolon issue
content = content.replace("() => setCurrentPage('booking');}", "() => setCurrentPage('booking')}")

# Fix invalid condition
content = content.replace("{currentPage === 'terms-and-conditions', 'booking' && (", "{currentPage === 'terms-and-conditions' && (")

with open('src/App.tsx', 'w') as f:
    f.write(content)

