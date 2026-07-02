import React, { useState, useEffect, useCallback, forwardRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Divider,
} from "@mui/material";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { AppContainer, SearchInput } from "@/components/ui";
import { EmptyState, ErrorState } from "@/components/common";
import { ProductGrid } from "../ProductGrid";
import { ProductCard } from "@/features/product";
import { ProductGridSkeleton } from "../ProductGridSkeleton";
import {
  RecommendationResult,
  RecommendationSkeleton,
  RecommendationEmpty,
} from "@/features/recommendation/components";
import { useNavigate, useLocation } from "react-router-dom";
import { productService } from "@/services/product.service";
import type { Product } from "@/features/product/types";

const SESSION_KEY = "aryavision_recommendation_state";

const getSavedState = () => {
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.formattedValue,
            },
          });
        }}
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp "
        allowNegative={false}
      />
    );
  },
);

export const CatalogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // API States
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortParam, setSortParam] = useState("created_at-desc");

  // Active Filter States (Used for API Request)
  const [activeSearch, setActiveSearch] = useState("");
  const [activeCluster, setActiveCluster] = useState<number | undefined>();
  const [activeMinPrice, setActiveMinPrice] = useState<number | undefined>();
  const [activeMaxPrice, setActiveMaxPrice] = useState<number | undefined>();
  const [activeMinRating, setActiveMinRating] = useState<number | undefined>();
  const [activeMaxRating, setActiveMaxRating] = useState<number | undefined>();

  // Draft Filter States
  const [draftSearch, setDraftSearch] = useState("");
  const [draftCluster, setDraftCluster] = useState("");
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  const [draftRating, setDraftRating] = useState("Semua Rating");
  const [priceError, setPriceError] = useState("");

  // Recommendation States
  const [referenceProductId, setReferenceProductId] = useState<string | null>(
    () => getSavedState()?.referenceProductId || null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    () => getSavedState()?.selectedProduct || null,
  );
  const [recommendations, setRecommendations] = useState<Product[]>(
    () => getSavedState()?.recommendations || [],
  );
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sort, order] = sortParam.split("-");

      const data = await productService.getProducts({
        page,
        limit,
        search: activeSearch || undefined,
        cluster: activeCluster,
        min_price: activeMinPrice,
        max_price: activeMaxPrice,
        min_rating: activeMinRating,
        max_rating: activeMaxRating,
        sort,
        order: order as "asc" | "desc",
      });
      setProducts(data.items);
      setTotalPages(data.total_pages);
      setTotalItems(data.total);
    } catch {
      setError(
        "Terjadi kesalahan saat memuat katalog produk. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    activeSearch,
    sortParam,
    activeCluster,
    activeMinPrice,
    activeMaxPrice,
    activeMinRating,
    activeMaxRating,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleApplyFilter = () => {
    // Validasi Harga
    let minPrice: number | undefined = undefined;
    let maxPrice: number | undefined = undefined;

    if (draftMinPrice) {
      const val = parseInt(draftMinPrice.replace(/\D/g, ""));
      if (!isNaN(val)) minPrice = val;
    }

    if (draftMaxPrice) {
      const val = parseInt(draftMaxPrice.replace(/\D/g, ""));
      if (!isNaN(val)) maxPrice = val;
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      setPriceError("Min > Max");
      return;
    }
    setPriceError("");

    // Mapping Cluster
    let clusterId: number | undefined = undefined;
    if (draftCluster === "budget") clusterId = 0;
    if (draftCluster === "mid-range") clusterId = 1;
    if (draftCluster === "premium") clusterId = 2;

    // Mapping Rating
    let minRating: number | undefined = undefined;
    let maxRating: number | undefined = undefined;

    if (draftRating === "★★★★★") {
      minRating = 5;
      maxRating = 5;
    } else if (draftRating === "★★★★☆") {
      minRating = 4;
      maxRating = 5;
    } else if (draftRating === "★★★☆☆") {
      minRating = 3;
      maxRating = 4;
    } else if (draftRating === "★★☆☆☆") {
      minRating = 2;
      maxRating = 3;
    } else if (draftRating === "★☆☆☆☆") {
      minRating = 1;
      maxRating = 2;
    }

    // Sync draft states to active states
    setActiveSearch(draftSearch);
    setActiveCluster(clusterId);
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    setActiveMinRating(minRating);
    setActiveMaxRating(maxRating);
    setPage(1);
  };

  const handleResetFilter = () => {
    // Clear drafts
    setDraftSearch("");
    setDraftCluster("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftRating("Semua Rating");
    setPriceError("");

    // Clear active
    setActiveSearch("");
    setActiveCluster(undefined);
    setActiveMinPrice(undefined);
    setActiveMaxPrice(undefined);
    setActiveMinRating(undefined);
    setActiveMaxRating(undefined);

    setSortParam("created_at-desc");
    setPage(1);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = useCallback(
    (product: Product) => {
      navigate(`/product/${product.id}`);
    },
    [navigate],
  );

  const handleClearReference = useCallback(() => {
    setReferenceProductId(null);
    setSelectedProduct(null);
    setRecommendations([]);
    sessionStorage.removeItem(SESSION_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectReference = useCallback(
    async (product: Product) => {
      if (referenceProductId === product.id) {
        handleClearReference();
        return;
      }
      setReferenceProductId(product.id);
      setIsRecLoading(true);
      setRecError(null);
      try {
        const { selectedProduct: apiSelected, recommendations: apiRecs } =
          await productService.getRecommendations(product.id);
        const newRecs = apiRecs.slice(0, 3);
        setSelectedProduct(apiSelected);
        setRecommendations(newRecs);

        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            referenceProductId: product.id,
            selectedProduct: apiSelected,
            recommendations: newRecs,
          }),
        );
      } catch {
        setRecError("Gagal memuat rekomendasi. Silakan coba lagi.");
      } finally {
        setIsRecLoading(false);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [referenceProductId, handleClearReference],
  );

  useEffect(() => {
    const stateRefId = location.state?.referenceProductId;
    if (stateRefId) {
      navigate(location.pathname, { replace: true, state: {} });
      if (referenceProductId !== stateRefId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleSelectReference({ id: stateRefId } as Product);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.referenceProductId]);

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <AppContainer>
        {/* Header Area */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold" }}
            gutterBottom
          >
            Katalog CCTV
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Temukan berbagai pilihan CCTV terbaik sesuai dengan kebutuhan dan
            anggaran Anda.
          </Typography>

          {/* Filters Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2,
              borderColor: "grey.200",
              bgcolor: "background.paper",
            }}
          >
            <Stack
              component="form"
              spacing={2}
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleApplyFilter();
              }}
            >
              {/* Search - full width */}
              <SearchInput
                placeholder="Cari CCTV..."
                value={draftSearch}
                onChange={setDraftSearch}
                onClear={() => setDraftSearch("")}
              />

              <Divider sx={{ borderStyle: "dashed" }} />

              {/* Filter fields */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ flexGrow: 1, flexWrap: "wrap", rowGap: 1.5 }}
                >
                  <FormControl
                    size="small"
                    sx={{ minWidth: 140, flex: { sm: 1 } }}
                  >
                    <InputLabel>Cluster</InputLabel>
                    <Select
                      value={draftCluster}
                      label="Cluster"
                      onChange={(e) =>
                        setDraftCluster(e.target.value as string)
                      }
                    >
                      <MenuItem value="">Semua</MenuItem>
                      <MenuItem value="budget">Budget</MenuItem>
                      <MenuItem value="mid-range">Mid-Range</MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: 140, flex: { sm: 1 } }}
                  >
                    <InputLabel>Rating</InputLabel>
                    <Select
                      value={draftRating}
                      label="Rating"
                      onChange={(e) => setDraftRating(e.target.value as string)}
                    >
                      <MenuItem value="Semua Rating">Semua Rating</MenuItem>
                      <MenuItem value="★★★★★">⭐ 5+</MenuItem>
                      <MenuItem value="★★★★☆">⭐ 4+</MenuItem>
                      <MenuItem value="★★★☆☆">⭐ 3+</MenuItem>
                      <MenuItem value="★★☆☆☆">⭐ 2+</MenuItem>
                      <MenuItem value="★☆☆☆☆">⭐ 1+</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    name="minPrice"
                    value={draftMinPrice}
                    onChange={(e) => setDraftMinPrice(e.target.value)}
                    label="Harga Minimum"
                    size="small"
                    sx={{ minWidth: 150, flex: { sm: 1 } }}
                    error={!!priceError}
                    slotProps={{
                      input: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        inputComponent: NumericFormatCustom as any,
                      },
                    }}
                  />

                  <TextField
                    name="maxPrice"
                    value={draftMaxPrice}
                    onChange={(e) => setDraftMaxPrice(e.target.value)}
                    label="Harga Maksimum"
                    size="small"
                    sx={{ minWidth: 150, flex: { sm: 1 } }}
                    error={!!priceError}
                    helperText={priceError || " "}
                    slotProps={{
                      input: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        inputComponent: NumericFormatCustom as any,
                      },
                    }}
                  />
                </Stack>

                {/* Actions */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: { xs: "stretch", md: "flex-end" },
                    "& > *": { flex: { xs: 1, md: "0 0 auto" } },
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleResetFilter}
                    sx={{ height: 40, whiteSpace: "nowrap" }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disableElevation
                    sx={{ height: 40, whiteSpace: "nowrap", minWidth: 140 }}
                  >
                    Terapkan Filter
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Recommendation Section */}
        {referenceProductId && (
          <Box
            sx={{
              mb: 6,
              p: 3,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Rekomendasi Untuk Anda
              </Typography>
              <Button
                size="small"
                color="error"
                variant="text"
                onClick={handleClearReference}
              >
                Bersihkan Acuan
              </Button>
            </Box>

            {selectedProduct && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
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
                onRetry={() =>
                  handleSelectReference({ id: referenceProductId } as Product)
                }
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
        )}
        {/* Content Area */}
        <Grid container spacing={4}>
          {/* Product Grid */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                mb: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {totalItems > 0
                  ? `Menampilkan ${(page - 1) * limit + 1} - ${Math.min(page * limit, totalItems)} dari ${totalItems} produk`
                  : "Tidak ada produk untuk ditampilkan"}
              </Typography>
            </Box>

            {isLoading ? (
              <ProductGridSkeleton />
            ) : error ? (
              <ErrorState
                title="Gagal Memuat Produk"
                description={error}
                onRetry={fetchProducts}
              />
            ) : products.length === 0 ? (
              <EmptyState
                title="Produk Tidak Ditemukan"
                description="Kami tidak dapat menemukan produk yang sesuai dengan pencarian atau filter Anda."
              />
            ) : (
              <>
                <ProductGrid
                  products={products}
                  onProductClick={handleProductClick}
                  onSelectReference={handleSelectReference}
                  referenceProductId={referenceProductId}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{ mt: 6, display: "flex", justifyContent: "center" }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </AppContainer>
    </Box>
  );
};
