import re
import os
import glob
base = os.path.dirname(__file__)
route_dir = os.path.join(base, 'routes')
paths = []
for fp in glob.glob(os.path.join(route_dir, '*.js')):
    name = os.path.basename(fp)
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()
    for m in re.finditer(r"router\.(get|post|put|delete|patch)\s*\(\s*['\"]([^'\"]*)['\"]", text):
        paths.append((name, m.group(1).upper(), m.group(2)))
with open(os.path.join(base, 'server.js'), 'r', encoding='utf-8') as f:
    server = f.read()
prefix_map = {}
for m in re.finditer(r"app\.use\(\s*['\"](/api/v1/[^'\"]*)['\"]\s*,\s*require\(\s*['\"]\.\/routes\/([^'\"]*)['\"]", server):
    prefix_map[m.group(2) + '.js'] = m.group(1)
for name, method, path in sorted(paths, key=lambda x: (prefix_map.get(x[0], ''), x[0], x[2])):
    prefix = prefix_map.get(name, '/api/v1/' + name.replace('.js', ''))
    if path.startswith('/'):
        print(f'{method} {prefix.rstrip('/')}{path}')
    else:
        print(f'{method} {prefix.rstrip('/')}/{path}')
print('\nEXTRA ROUTES:')
for m in re.finditer(r"app\.(get|post|put|delete|patch)\s*\(\s*['\"]([^'\"]*)", server):
    print(f'{m.group(1).upper()} {m.group(2)}')
