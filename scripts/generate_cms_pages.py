import os
import re

base_dir = "cms-admin-v2"

# Configuration for new endpoints
entities = [
    {
        "id": "product",
        "ids": "products",
        "apiName": "ProductsApi",
        "title": "Product",
        "titles": "Products",
        "fields": [
            ("title", "text"), ("slug", "text"), ("description", "textarea"), 
            ("features", "text"), ("image_url", "text"), ("status", "select")
        ]
    },
    {
        "id": "service",
        "ids": "services",
        "apiName": "ServicesApi",
        "title": "Service",
        "titles": "Services",
        "fields": [
            ("title", "text"), ("slug", "text"), ("description", "textarea"), 
            ("benefits", "text"), ("icon_url", "text"), ("status", "select")
        ]
    },
    {
        "id": "industry",
        "ids": "industries",
        "apiName": "IndustriesApi",
        "title": "Industry",
        "titles": "Industries",
        "fields": [
            ("name", "text"), ("slug", "text"), ("description", "textarea"), 
            ("image_url", "text"), ("status", "select")
        ]
    },
    {
        "id": "rd",
        "ids": "rd",
        "apiName": "RDApi",
        "title": "R&D Project",
        "titles": "R&D",
        "fields": [
            ("project_name", "text"), ("slug", "text"), ("summary", "textarea"), 
            ("details", "textarea"), ("status", "select")
        ]
    }
]

# Dashboard HTML template
def generate_list_html(ent):
    with open(os.path.join(base_dir, "dashboard.html"), "r", encoding="utf-8") as f:
        html = f.read()
    
    html = html.replace('dashboard.js', f'{ent["id"]}-list.js')
    html = html.replace('Blogs', ent['titles'])
    html = html.replace('Blog', ent['title'])
    html = html.replace('blog-new.html', f'{ent["id"]}-form.html')
    html = html.replace('id="blog-list"', f'id="{ent["id"]}-list"')
    
    return html

# Form HTML template
def generate_form_html(ent):
    with open(os.path.join(base_dir, "blog-new.html"), "r", encoding="utf-8") as f:
        html = f.read()
        
    html = html.replace('blog-form.js', f'{ent["id"]}-form.js')
    html = html.replace('Create New Blog Post', f'Create New {ent["title"]}')
    html = html.replace('dashboard.html', f'{ent["id"]}-list.html')
    
    # We will just replace the form inner HTML
    form_fields_html = ""
    for field, type in ent["fields"]:
        if type == "text":
            form_fields_html += f'''
            <div class="form-group">
                <label class="form-label">{field.title().replace('_', ' ')}</label>
                <input type="text" id="{field}" class="form-input" required>
            </div>'''
        elif type == "textarea":
            form_fields_html += f'''
            <div class="form-group">
                <label class="form-label">{field.title().replace('_', ' ')}</label>
                <textarea id="{field}" class="form-input" rows="4"></textarea>
            </div>'''
        elif type == "select":
            form_fields_html += f'''
            <div class="form-group">
                <label class="form-label">Status</label>
                <select id="status" class="form-input">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>'''
    
    # Simple regex to replace the form group contents
    html = re.sub(r'<div class="grid grid-cols-3 gap-lg">.*?<div class="form-actions">', 
                  f'<div class="grid grid-cols-1 gap-lg"><div class="card p-xl"><div class="form-grid">{form_fields_html}</div></div></div>\n<div class="form-actions">', 
                  html, flags=re.DOTALL)
    
    return html

# List JS template
def generate_list_js(ent):
    return f'''
(function () {{
    'use strict';
    if (!Auth.requireAuth()) return;

    let items = [];
    const listEl = document.getElementById('{ent["id"]}-list');
    const loadingEl = document.getElementById('loading-screen');
    const mainEl = document.getElementById('main-content');

    async function init() {{
        try {{
            items = await {ent["apiName"]}.getAll();
            render();
        }} catch (e) {{
            console.error(e);
        }}
    }}

    function render() {{
        loadingEl.classList.add('hidden');
        mainEl.classList.remove('hidden');
        listEl.innerHTML = '';
        
        items.forEach(item => {{
            const row = document.createElement('div');
            row.className = 'blog-row p-md border-b';
            row.innerHTML = `
                <div>
                    <h3 class="title font-bold">${{item.title || item.name || item.project_name}}</h3>
                    <p class="meta text-sm text-gray-500">${{item.slug}} | Status: ${{item.status}}</p>
                </div>
                <div class="actions ml-auto">
                    <a href="{ent["id"]}-form.html?id=${{item.id}}" class="action-btn edit">Edit</a>
                    <button class="action-btn delete" onclick="deleteItem(${{item.id}})">Delete</button>
                </div>
            `;
            listEl.appendChild(row);
        }});
    }}

    window.deleteItem = async function(id) {{
        if(confirm('Are you sure?')) {{
            await {ent["apiName"]}.delete(id);
            init();
        }}
    }}

    init();
}})();
'''

# Form JS template
def generate_form_js(ent):
    field_ids = [f[0] for f in ent["fields"]]
    get_vals = ", ".join([f"{f}: document.getElementById('{f}').value" for f in field_ids])
    set_vals = "\n".join([f"            if(document.getElementById('{f}')) document.getElementById('{f}').value = item.{f} || '';" for f in field_ids])
    
    return f'''
(function () {{
    'use strict';
    if (!Auth.requireAuth()) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const form = document.getElementById('blog-form');
    const cancelBtn = document.getElementById('cancel-btn');

    cancelBtn.addEventListener('click', () => window.location.href = '{ent["id"]}-list.html');

    async function init() {{
        if (id) {{
            const item = await {ent["apiName"]}.getById(id);
{set_vals}
        }}
    }}

    form.addEventListener('submit', async (e) => {{
        e.preventDefault();
        const data = {{
            {get_vals}
        }};
        
        try {{
            if (id) {{
                await {ent["apiName"]}.update(id, data);
            }} else {{
                await {ent["apiName"]}.create(data);
            }}
            window.location.href = '{ent["id"]}-list.html';
        }} catch (err) {{
            alert(err.message);
        }}
    }});

    init();
}})();
'''

for ent in entities:
    # Write HTML files
    with open(os.path.join(base_dir, f'{ent["id"]}-list.html'), "w", encoding="utf-8") as f:
        f.write(generate_list_html(ent))
    
    with open(os.path.join(base_dir, f'{ent["id"]}-form.html'), "w", encoding="utf-8") as f:
        f.write(generate_form_html(ent))
        
    # Write JS files
    with open(os.path.join(base_dir, "js", f'{ent["id"]}-list.js'), "w", encoding="utf-8") as f:
        f.write(generate_list_js(ent))
        
    with open(os.path.join(base_dir, "js", f'{ent["id"]}-form.js'), "w", encoding="utf-8") as f:
        f.write(generate_form_js(ent))

print("Generated all files!")
