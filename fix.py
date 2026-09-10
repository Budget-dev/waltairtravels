import os
import re
import glob

for filepath in glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix broken imports like `,\n  ,\n` or empty `,`
    # Actually just remove empty lines with a comma
    content = re.sub(r',\s*\n\s*,', ',\n', content)
    content = re.sub(r'^\s*,\s*\n', '', content, flags=re.MULTILINE)

    # Fix broken JSX: `< className="..." />` -> ``
    content = re.sub(r'<\s+className="[^"]*"\s*/>\s*\n', '', content)
    content = re.sub(r'<\s+className="[^"]*"\s*/>', '', content)

    # Fix broken arrays like `{ id: 'services', label: 'Our Services', icon:  },`
    content = re.sub(r'icon:\s+[\}],', 'icon: undefined },', content)
    content = re.sub(r'icon:\s+\}', 'icon: undefined }', content)

    with open(filepath, 'w') as f:
        f.write(content)
