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
import { PictureAsPdf, TableView } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import type { Product } from "@/features/product/types";
import { useCatalogProducts } from "../../hooks/use-catalog-products";
import { useCatalogRecommendations } from "../../hooks/use-catalog-recommendations";
import { exportRecommendationToPDF } from "../../utils/export-pdf";
import { exportRecommendationToExcel } from "../../utils/export-excel";

const SESSION_KEY = "aryavision_recommendation_state";

const getSavedReferenceId = () => {
  const saved = sessionStorage.getItem(SESSION_KEY);
  return saved || null;
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

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
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
    () => getSavedReferenceId(),
  );

  // --- REACT QUERY FETCHING ---
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useCatalogProducts({
    page,
    limit,
    search: activeSearch,
    cluster: activeCluster,
    minPrice: activeMinPrice,
    maxPrice: activeMaxPrice,
    minRating: activeMinRating,
    maxRating: activeMaxRating,
    sortParam,
  });

  const products = productsData?.items || [];
  const totalPages = productsData?.total_pages || 1;
  const totalItems = productsData?.total || 0;

  const {
    data: recData,
    isLoading: isRecLoading,
    isError: isRecError,
    refetch: refetchRecs,
  } = useCatalogRecommendations(referenceProductId);

  const selectedProduct = recData?.selectedProduct || null;
  const recommendations = recData?.recommendations?.slice(0, 3) || [];

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

  // Handler untuk mengubah jumlah item per halaman (Page Size)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
    setPage(1); // Reset ke halaman pertama setiap kali ukuran halaman berubah
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
    sessionStorage.removeItem(SESSION_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectReference = useCallback(
    (product: Product) => {
      const idStr = String(product.id);
      if (referenceProductId === idStr) {
        handleClearReference();
        return;
      }
      setReferenceProductId(idStr);
      sessionStorage.setItem(SESSION_KEY, idStr);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [referenceProductId, handleClearReference],
  );

  useEffect(() => {
    const stateRefId = location.state?.referenceProductId;
    if (stateRefId) {
      navigate(location.pathname, { replace: true, state: {} });
      const idStr = String(stateRefId);
      if (referenceProductId !== idStr) {
        // Mock product object with just ID to trigger selection
        handleSelectReference({ id: stateRefId } as unknown as Product);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [
    location.state?.referenceProductId,
    navigate,
    location.pathname,
    referenceProductId,
    handleSelectReference,
  ]);

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
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Rekomendasi Untuk Anda
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ flexWrap: "wrap" }}
              >
                {selectedProduct && recommendations.length > 0 && (
                  <>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      startIcon={<PictureAsPdf />}
                      disableElevation
                      onClick={() =>
                        exportRecommendationToPDF(
                          selectedProduct,
                          recommendations,
                        )
                      }
                    >
                      Export PDF
                    </Button>
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      startIcon={<TableView />}
                      disableElevation
                      onClick={() =>
                        exportRecommendationToExcel(
                          selectedProduct,
                          recommendations,
                        )
                      }
                    >
                      Export Excel
                    </Button>
                  </>
                )}
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={handleClearReference}
                >
                  Bersihkan Acuan
                </Button>
              </Stack>
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
            ) : isRecError ? (
              <ErrorState
                title="Gagal Memuat Rekomendasi"
                description={"Terjadi kesalahan saat memuat rekomendasi."}
                onRetry={() => refetchRecs()}
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
                  ? limit === 10000
                    ? `Menampilkan ${totalItems} dari ${totalItems} produk`
                    : `Menampilkan ${(page - 1) * limit + 1} - ${Math.min(page * limit, totalItems)} dari ${totalItems} produk`
                  : "Tidak ada produk untuk ditampilkan"}
              </Typography>

              {/* Pemilih Ukuran Halaman (Page Size) */}
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={limit}
                  onChange={handleLimitChange}
                  displayEmpty
                  sx={{ fontSize: "0.875rem", bgcolor: "background.paper" }}
                >
                  <MenuItem value={10}>10 per halaman</MenuItem>
                  <MenuItem value={20}>20 per halaman</MenuItem>
                  <MenuItem value={30}>30 per halaman</MenuItem>
                  <MenuItem value={40}>40 per halaman</MenuItem>
                  <MenuItem value={50}>50 per halaman</MenuItem>
                  <MenuItem value={100}>100 per halaman</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {isProductsLoading ? (
              <ProductGridSkeleton />
            ) : isProductsError ? (
              <ErrorState
                title="Gagal Memuat Produk"
                description={
                  "Terjadi kesalahan saat memuat katalog produk. Silakan coba lagi."
                }
                onRetry={() => refetchProducts()}
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
