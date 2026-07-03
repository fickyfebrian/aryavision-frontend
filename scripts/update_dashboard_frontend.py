import os
import re

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {path}")

# 1. Update src/services/product.service.ts
service_path = 'src/services/product.service.ts'
with open(service_path, 'r', encoding='utf-8') as f:
    service_content = f.read()

stats_interface = """export interface DashboardStats {
  total_products: number;
  total_brands: number;
  budget_cluster: number;
  mid_range_cluster: number;
  premium_cluster: number;
}
"""

if "export interface DashboardStats" not in service_content:
    service_content = service_content.replace("export interface GetProductsParams", stats_interface + "\nexport interface GetProductsParams")

stats_method = """
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  },

  // CMS Endpoints"""

if "getDashboardStats:" not in service_content:
    service_content = service_content.replace("  // CMS Endpoints", stats_method)

write_file(service_path, service_content)

# 2. Update src/features/admin/DashboardPage.tsx
dashboard_path = 'src/features/admin/DashboardPage.tsx'
with open(dashboard_path, 'r', encoding='utf-8') as f:
    dashboard_content = f.read()

old_fetch = """        const res = await productService.getProducts({ limit: 99999 });
        const items = res.items;

        const brands = new Set(items.map((p) => p.brand).filter(Boolean));

        setStats({
          total: items.length,
          brand: brands.size,
          budget: items.filter((p) => p.cluster === "budget").length,
          midRange: items.filter((p) => p.cluster === "mid-range").length,
          premium: items.filter((p) => p.cluster === "premium").length,
        });"""

new_fetch = """        const res = await productService.getDashboardStats();
        setStats({
          total: res.total_products,
          brand: res.total_brands,
          budget: res.budget_cluster,
          midRange: res.mid_range_cluster,
          premium: res.premium_cluster,
        });"""

if "await productService.getProducts({ limit: 99999 })" in dashboard_content:
    dashboard_content = dashboard_content.replace(old_fetch, new_fetch)
    write_file(dashboard_path, dashboard_content)
