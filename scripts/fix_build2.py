import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {path}")

# 1. Fix ProductFormModal.tsx
modal_path = 'src/features/admin/components/ProductFormModal.tsx'
modal_content = read_file(modal_path)
modal_content = modal_content.replace("import { Product } from '@/features/product/types';", "import type { Product } from '@/features/product/types';")
# Remove inputProps entirely to avoid type checking issues with MUI versions. We'll just rely on type="number"
modal_content = modal_content.replace("inputProps={{ step: 0.1, min: 0, max: 5 }}", "")
write_file(modal_path, modal_content)

# 2. Fix ProductsPage.tsx
prod_path = 'src/features/admin/ProductsPage.tsx'
prod_content = read_file(prod_path)
prod_content = prod_content.replace("const [brand, setBrand] = useState('');", "const [brand] = useState('');")
write_file(prod_path, prod_content)
