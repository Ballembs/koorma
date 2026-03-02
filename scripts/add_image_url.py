import re

filepath = 'src/content/consonants.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find each object definition
pattern = r'(\{ id: "([^"]+)", [^}]+)(\})'

def replace_func(match):
    prefix = match.group(1)
    id_val = match.group(2)
    suffix = match.group(3)
    if 'imageUrl' in prefix:
        return match.group(0)
    return f'{prefix}, imageUrl: "/images/anchors/{id_val}.png" {suffix}'

new_content = re.sub(pattern, replace_func, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated consonants.ts')
