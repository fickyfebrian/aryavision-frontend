const fs = require('fs');
let content = fs.readFileSync('src/features/catalog/components/CatalogPage/CatalogPage.tsx', 'utf-8');

// 1. Add selectedProduct state
content = content.replace(
  'const [recommendations, setRecommendations] = useState<Product[]>([]);',
  'const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);\n  const [recommendations, setRecommendations] = useState<Product[]>([]);'
);

// 2. Add filter states
content = content.replace(
  'const [sortParam, setSortParam] = useState(\'created_at-desc\');',
  'const [sortParam, setSortParam] = useState(\'created_at-desc\');\n  const [cluster, setCluster] = useState(\'\');\n  const [budget, setBudget] = useState(\'\');\n  const [ratingFilter, setRatingFilter] = useState(\'\');'
);

// 3. handleSelectReference update
content = content.replace(
  'const handleSelectReference = useCallback(async (product: Product) => {',
  `const handleSelectReference = useCallback(async (product: Product) => {
    if (referenceProductId === product.id) {
      setReferenceProductId(null);
      setSelectedProduct(null);
      setRecommendations([]);
      return;
    }`
);

content = content.replace(
  'const recs = await productService.getRecommendations(product.id);',
  'const { selectedProduct: apiSelected, recommendations: apiRecs } = await productService.getRecommendations(product.id);'
);
content = content.replace(
  'setRecommendations(recs);',
  'setSelectedProduct(apiSelected);\n      setRecommendations(apiRecs.slice(0, 3));'
);

// 4. Reset filter
content = content.replace(
  'const handleSearch = (value: string) => {',
  `const handleResetFilter = () => {
    setSearch('');
    setCluster('');
    setBudget('');
    setRatingFilter('');
    setSortParam('created_at-desc');
    setPage(1);
  };

  const handleSearch = (value: string) => {`
);

// 5. Replace header area filters
const filterReplacement = `          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, width: '100%', maxWidth: { md: 300 } }}>
              <SearchInput 
                placeholder="Cari CCTV..." 
                value={search}
                onChange={handleSearch}
                onClear={() => handleSearch('')}
              />
            </Box>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', flexWrap: 'wrap', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Cluster</InputLabel>
                <Select value={cluster} label="Cluster" onChange={(e) => { setCluster(e.target.value); setPage(1); }}>
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="budget">Budget</MenuItem>
                  <MenuItem value="mid-range">Mid-Range</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Budget/Harga</InputLabel>
                <Select value={budget} label="Budget/Harga" onChange={(e) => { setBudget(e.target.value); setPage(1); }}>
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="<500k">&lt; Rp 500.000</MenuItem>
                  <MenuItem value="500k-1m">Rp 500rb - 1Jt</MenuItem>
                  <MenuItem value=">1m">&gt; Rp 1.000.000</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rating</InputLabel>
                <Select value={ratingFilter} label="Rating" onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}>
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value=">4">4 Bintang +</MenuItem>
                  <MenuItem value=">4.5">4.5 Bintang +</MenuItem>
                </Select>
              </FormControl>
              
              <Button variant="outlined" onClick={handleResetFilter} sx={{ height: 40 }}>
                Reset Filter
              </Button>
            </Stack>
          </Stack>`;

content = content.replace(
  /<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>[\s\S]*?<\/Stack>\s*<\/Stack>/m,
  filterReplacement
);

// 6. Recommendation section selectedProduct UI
const recSectionReplacement = `        {/* Recommendation Section */}
        {referenceProductId && (
          <Box sx={{ mb: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Sistem Pendukung Keputusan
            </Typography>
            
            {selectedProduct && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Produk Acuan
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ProductCard 
                      product={selectedProduct}
                      onClick={handleProductClick}
                      onSelectReference={handleSelectReference}
                      isReference={true}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {isRecLoading ? (
              <RecommendationSkeleton />
            ) : recError ? (
              <ErrorState 
                title="Gagal Memuat Rekomendasi" 
                description={recError} 
                onRetry={() => handleSelectReference({ id: referenceProductId } as Product)} 
              />
            ) : recommendations.length === 0 ? (
              <RecommendationEmpty />
            ) : (
              <RecommendationResult 
                products={recommendations} 
                onProductClick={handleProductClick}
                onSelectReference={handleSelectReference}
              />
            )}
          </Box>
        )}`;

content = content.replace(
  /{\/\* Recommendation Section \*\/}[\s\S]*?{\/\* Content Area \*\/}/m,
  recSectionReplacement + '\n        {/* Content Area */}'
);

// 7. Remove Sidebar completely
content = content.replace(
  /{\/\* Sidebar \(Desktop\) \*\/}[\s\S]*?{\/\* Product Grid \*\/}/m,
  '\n          {/* Product Grid */}'
);

// Grid size changed from xs=12 md=9 to xs=12 since sidebar is gone
content = content.replace(
  '<Grid size={{ xs: 12, md: 9 }}>',
  '<Grid size={{ xs: 12 }}>'
);

// Remove mobile drawer
content = content.replace(
  /{\/\* Mobile Drawer Filter \*\/}[\s\S]*?<\/Box>/m,
  '</Box>'
);

// Update ProductGrid in CatalogPage to pass referenceProductId
content = content.replace(
  /<ProductGrid \s*products={products} \s*onProductClick={handleProductClick}\s*onSelectReference={handleSelectReference}\s*\/>/m,
  `<ProductGrid 
                  products={products} 
                  onProductClick={handleProductClick}
                  onSelectReference={handleSelectReference}
                  referenceProductId={referenceProductId}
                />`
);

// Replace import FilterSidebar
content = content.replace(
  "import { FilterSidebar } from '../FilterSidebar';\n",
  ""
);

content = content.replace(/<Grid item/g, '<Grid size');

fs.writeFileSync('src/features/catalog/components/CatalogPage/CatalogPage.tsx', content);
