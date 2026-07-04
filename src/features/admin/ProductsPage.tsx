import { useState, forwardRef } from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import { Plus, Edit2, Trash2 } from "lucide-react";
import { SearchInput } from "@/components/ui";

import type { Product } from "@/features/product/types";
import { ProductFormModal } from "./components/ProductFormModal";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ClusterBadge } from "@/features/product/components/ClusterBadge";

import { useAdminProducts } from "./hooks/use-admin-products";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./hooks/use-product-mutations";
import type { ProductFormValues } from "./schemas/product-form.schema";

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

export const ProductsPage = () => {
  const [page, setPage] = useState(1);

  // Toast State
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const showToast = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setToast({ open: true, message, severity });
  };
  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  // Active Filter States
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

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Queries and Mutations
  const { data: queryData, isLoading } = useAdminProducts({
    page,
    limit: 10,
    search: activeSearch || undefined,
    cluster: activeCluster,
    min_price: activeMinPrice,
    max_price: activeMaxPrice,
    min_rating: activeMinRating,
    max_rating: activeMaxRating,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const isActionLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const products = queryData?.items || [];
  const total = queryData?.total_pages || 0;

  const handleApplyFilter = () => {
    // Harga Validation
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

    // Cluster mapping
    let clusterId: number | undefined = undefined;
    if (draftCluster === "budget") clusterId = 0;
    if (draftCluster === "mid-range") clusterId = 1;
    if (draftCluster === "premium") clusterId = 2;

    // Rating mapping
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

    setActiveSearch(draftSearch);
    setActiveCluster(clusterId);
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    setActiveMinRating(minRating);
    setActiveMaxRating(maxRating);
    setPage(1);
  };

  const handleResetFilter = () => {
    setDraftSearch("");
    setDraftCluster("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftRating("Semua Rating");
    setPriceError("");

    setActiveSearch("");
    setActiveCluster(undefined);
    setActiveMinPrice(undefined);
    setActiveMaxPrice(undefined);
    setActiveMinRating(undefined);
    setActiveMaxRating(undefined);
    setPage(1);
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setFormOpen(true);
  };

  const handleOpenDelete = (p: Product) => {
    setProductToDelete(p);
    setDeleteOpen(true);
  };

  const handleSave = async (data: ProductFormValues) => {
    try {
      if (selectedProduct) {
        await updateMutation.mutateAsync({ id: selectedProduct.id, data });
        showToast("Produk berhasil diperbarui.", "success");
      } else {
        await createMutation.mutateAsync(data);
        showToast("Produk berhasil ditambahkan.", "success");
      }
      setFormOpen(false);
    } catch (err: any) {
      showToast(
        selectedProduct
          ? "Gagal memperbarui produk."
          : "Gagal menambahkan produk.",
        "error",
      );
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      showToast("Produk berhasil dihapus.", "success");
      setDeleteOpen(false);
    } catch (err: any) {
      showToast("Gagal menghapus produk.", "error");
    }
  };

  return (
    <Box>
      {/* Filters (Matching CatalogPage UX) */}
      <Card className="mb-6 shadow-sm border border-gray-200 mt-2">
        <Stack
          component="form"
          spacing={2}
          sx={{ p: { xs: 2, sm: 2.5 } }}
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleApplyFilter();
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: "center" }}
          >
            <Box sx={{ flexGrow: 1, width: "100%" }}>
              <SearchInput
                placeholder="Cari CCTV..."
                value={draftSearch}
                onChange={setDraftSearch}
                onClear={() => setDraftSearch("")}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleOpenAdd}
              sx={{
                height: 40,
                whiteSpace: "nowrap",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Add Product
            </Button>
          </Stack>

          <Divider sx={{ borderStyle: "dashed" }} />
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
              <FormControl size="small" sx={{ minWidth: 140, flex: { sm: 1 } }}>
                <InputLabel>Cluster</InputLabel>
                <Select
                  value={draftCluster}
                  label="Cluster"
                  onChange={(e) => setDraftCluster(e.target.value as string)}
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="budget">Budget</MenuItem>
                  <MenuItem value="mid-range">Mid-Range</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140, flex: { sm: 1 } }}>
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
                    inputComponent: NumericFormatCustom as any,
                  },
                }}
              />
            </Stack>
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
                sx={{ height: 40 }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
                sx={{ height: 40 }}
              >
                Terapkan Filter
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {/* Table */}
      <TableContainer component={Paper} className="shadow-sm border">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stats</TableCell>
              <TableCell>Cluster</TableCell>
              <TableCell>Terakhir Update</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" className="py-12">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  className="py-12 text-gray-500"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell>
                    <img
                      src={row.imageUrl}
                      alt={row.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  </TableCell>
                  <TableCell
                    className="max-w-[250px] truncate"
                    title={row.name}
                  >
                    <Typography variant="body2" className="font-medium">
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {formatCurrency(row.price)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      ⭐ {row.rating}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ display: "block" }}
                    >
                      Sold: {row.soldCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ClusterBadge cluster={row.cluster} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: "nowrap" }}>
                      {formatDate(row.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEdit(row)}
                    >
                      <Edit2 size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDelete(row)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {total > 1 && (
        <Box className="flex justify-center mt-6">
          <Pagination
            count={total}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}

      {/* Form Modal */}
      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSave}
        initialData={selectedProduct}
        loading={isActionLoading}
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus produk ini?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={isActionLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isActionLoading}
          >
            {isActionLoading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
