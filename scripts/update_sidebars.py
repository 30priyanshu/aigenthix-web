import os
import glob
import re

base_dir = 'cms-admin-v2'
html_files = glob.glob(os.path.join(base_dir, '*.html'))

old_sidebar = r'<li><a href="dashboard\.html" class="btn btn-ghost" style="width: 100%; justify-content: flex-start;">Blogs</a></li>\s*<li><a href="#" class="btn btn-ghost" style="width: 100%; justify-content: flex-start; color: var\(--color-text-muted\);">Products \(Coming Soon\)</a></li>\s*<li><a href="#" class="btn btn-ghost" style="width: 100%; justify-content: flex-start; color: var\(--color-text-muted\);">Services \(Coming Soon\)</a></li>\s*<li><a href="#" class="btn btn-ghost" style="width: 100%; justify-content: flex-start; color: var\(--color-text-muted\);">Industries \(Coming Soon\)</a></li>\s*<li><a href="#" class="btn btn-ghost" style="width: 100%; justify-content: flex-start; color: var\(--color-text-muted\);">R&D \(Coming Soon\)</a></li>'

new_sidebar = '''<li><a href="dashboard.html" class="btn btn-ghost" style="width: 100%; justify-content: flex-start;">Blogs</a></li>
                    <li><a href="product-list.html" class="btn btn-ghost" style="width: 100%; justify-content: flex-start;">Products</a></li>
                    <li><a href="service-list.html" class="btn btn-ghost" style="width: 100%; justify-content: flex-start;">Services</a></li>
                    <li><a href="industry-list.html" class="btn btn-ghost" style="width: 100%; justify-content: flex-start;">Industries</a></li>
                    <li><a href="rd-list.html" class="btn btn-ghost" style="width: 100%; justify-content: flex-start;">R&D</a></li>'''

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(old_sidebar, new_sidebar, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
