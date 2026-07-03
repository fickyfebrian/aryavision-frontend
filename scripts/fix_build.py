import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {path}")

# 1. Fix ProductFormModal.tsx (remove Grid and use Tailwind)
modal_path = 'src/features/admin/components/ProductFormModal.tsx'
modal_content = read_file(modal_path)
modal_content = modal_content.replace("import Grid from '@mui/material/Grid';", "import Typography from '@mui/material/Typography';")

# Replace Grid structures with div flex/grid
modal_content = modal_content.replace('<Grid container spacing={3}>', '<div className="grid grid-cols-1 md:grid-cols-12 gap-4">')
modal_content = modal_content.replace('</Grid>', '</div>')

modal_content = modal_content.replace('<Grid item xs={12}>', '<div className="col-span-1 md:col-span-12">')
modal_content = modal_content.replace('<Grid item xs={12} sm={6}>', '<div className="col-span-1 md:col-span-6">')
modal_content = modal_content.replace('<Grid item xs={12} sm={4}>', '<div className="col-span-1 md:col-span-4">')

write_file(modal_path, modal_content)

# 2. Fix DashboardPage.tsx (remove Grid and use Tailwind)
dash_path = 'src/features/admin/DashboardPage.tsx'
dash_content = read_file(dash_path)
dash_content = dash_content.replace("import Grid from '@mui/material/Grid';", "")
dash_content = dash_content.replace('<Grid container spacing={3}>', '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">')
dash_content = dash_content.replace('<Grid item xs={12} sm={6} md={4} key={i}>', '<div key={i}>')
dash_content = dash_content.replace('</Grid>', '</div>')
write_file(dash_path, dash_content)

# 3. Fix ProductsPage.tsx
prod_path = 'src/features/admin/ProductsPage.tsx'
prod_content = read_file(prod_path)

# Fix type imports
prod_content = prod_content.replace("import { Product } from '@/features/product/types';", "import type { Product } from '@/features/product/types';")
prod_content = prod_content.replace("import { Plus, Edit2, Trash2, Search, Filter }", "import { Plus, Edit2, Trash2, Search }")

# Fix react-hot-toast (maybe it's in components/common/Toast or something, but I can just use alert or console if toast isn't available, wait let's check package.json later. The project must have a toast library since user asked for it. Wait, I will use alert for now just to make it compile if it really fails, or let's use the UI components.)
# Actually, let's just see if react-hot-toast is in package.json.
import json
with open('package.json', 'r') as f:
    pkg = json.load(f)
    if 'react-hot-toast' not in pkg.get('dependencies', {}):
        print("react-hot-toast not found. Replacing with alert.")
        prod_content = prod_content.replace("import toast from 'react-hot-toast';", "const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };")
    else:
        print("react-hot-toast found!")

# Fix InputProps
prod_content = prod_content.replace("InputProps={{", "slotProps={{ input: {")
prod_content = prod_content.replace("            }}", "            } }}")
# Ensure the endAdornment doesn't break
prod_content = prod_content.replace("endAdornment:", "endAdornment:")

# Fix Typography display
prod_content = prod_content.replace('<Typography variant="caption" display="block">', '<Typography variant="caption" sx={{ display: \'block\' }}>')
prod_content = prod_content.replace('<Typography variant="caption" display="block" color="textSecondary">', '<Typography variant="caption" color="textSecondary" sx={{ display: \'block\' }}>')

write_file(prod_path, prod_content)

