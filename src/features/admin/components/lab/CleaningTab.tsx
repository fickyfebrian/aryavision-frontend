import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface CleaningTabProps {
  stats: {
    total_before: number;
    duplicate_removed: number;
    price_removed: number;
    rating_removed: number;
    sold_removed: number;
    total_after: number;
  };
  raw_products: any[];
  cleaned_products: any[];
}

export const CleaningTab: React.FC<CleaningTabProps> = ({
  stats,
  raw_products,
  cleaned_products,
}) => {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header Info */}
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#64748b" }}
          gutterBottom
        >
          TAHAP 1: PEMBERSIHAN DATA (DATA CLEANING)
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: "80%" }}
        >
          Sebelum dataset diolah lebih lanjut, website mengidentifikasi record
          yang <strong>tidak lengkap (null) atau bernilai 0</strong> pada
          atribut utama (Harga, Rating, Popularitas). Data yang tidak memenuhi
          syarat akan dibersihkan agar seluruh proses perhitungan selanjutnya
          (baik K-Means maupun CBF) tidak bias.
        </Typography>
      </Box>

      {/* Stats Cards & Rules */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textAlign: "center",
                  borderColor: "grey.300",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    DATASET MENTAH
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mt: 1, color: "#1e293b" }}
                  >
                    {stats.total_before}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    kamera CCTV
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textAlign: "center",
                  borderColor: "success.main",
                  bgcolor: "success.50",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "success.main" }}
                  >
                    LOLOS FILTER
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mt: 1, color: "success.main" }}
                  >
                    {stats.total_after}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    siap diproses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textAlign: "center",
                  borderColor: "error.main",
                  bgcolor: "error.50",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "error.main" }}
                  >
                    DIBERSIHKAN
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mt: 1, color: "error.main" }}
                  >
                    {stats.duplicate_removed +
                      stats.price_removed +
                      stats.rating_removed +
                      stats.sold_removed}
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    row bermasalah
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: "warning.main",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "warning.dark",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>⚠️</span> Aturan Preprocessing Skripsi:
              </Typography>
              <Box
                component="ul"
                sx={{
                  mt: 1,
                  pl: 2,
                  "& li": {
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    mb: 0.5,
                  },
                }}
              >
                <li>
                  Jika <strong>Rating</strong> kosong (tanpa review konsumen),
                  hapus record.
                </li>
                <li>
                  Jika jumlah <strong>Terjual (Popularitas)</strong> tidak valid
                  / bernilai kosong, hapus record.
                </li>
                <li>
                  Konversi format teks (misal: "Rp 1.499.002", "100+ terjual")
                  menjadi murni format data numerik integer.
                </li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Comparison */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "grey.200",
                bgcolor: "grey.50",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>📁</span> DATASET SEBELUM CLEANING
              </Typography>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  border: "1px solid",
                  borderColor: "warning.main",
                  color: "warning.main",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                Ada Baris Null/Dirty
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: 500, overflow: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      JUDUL KAMERA CCTV
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      RATING
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      HARGA
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      POPULARITAS (TERJUAL)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {raw_products.slice(0, 50).map((row, index) => {
                    const isRatingNull =
                      row.rating == null || isNaN(row.rating);
                    const isPriceNull = row.price == null || isNaN(row.price);
                    const isSoldNull = row.sold == null || isNaN(row.sold);
                    return (
                      <TableRow key={index} hover>
                        <TableCell
                          sx={{
                            fontSize: "0.75rem",
                            maxWidth: 180,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.product_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {isRatingNull ? (
                            <Typography
                              variant="caption"
                              sx={{ color: "error.main", fontWeight: "bold" }}
                            >
                              KOSONG
                            </Typography>
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              ★ {row.rating}
                              {row.rating === 0 && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    color: "error.main",
                                    fontWeight: "bold",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  (KOSONG)
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {isPriceNull ? (
                            <Typography
                              variant="caption"
                              sx={{ color: "error.main", fontWeight: "bold" }}
                            >
                              KOSONG
                            </Typography>
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              Rp {Number(row.price).toLocaleString("id-ID")}
                              {row.price === 0 && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    color: "error.main",
                                    fontWeight: "bold",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  (KOSONG)
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {isSoldNull ? (
                            <Typography
                              variant="caption"
                              sx={{ color: "error.main", fontWeight: "bold" }}
                            >
                              KOSONG
                            </Typography>
                          ) : (
                            <Box
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {row.sold} unit
                              {row.sold === 0 && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    color: "error.main",
                                    fontWeight: "bold",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  KOSONG
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "grey.200",
                bgcolor: "grey.50",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>✨</span> DATASET SETELAH CLEANING
              </Typography>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  border: "1px solid",
                  borderColor: "success.main",
                  color: "success.main",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                Semua Data Bersih & Numerik
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: 500, overflow: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      JUDUL KAMERA CCTV
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      RATING
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      HARGA NUMERIK
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      }}
                    >
                      TERJUAL NUMERIK
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cleaned_products.slice(0, 50).map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.product_name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem" }}>
                        ★ {row.rating}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          color: "primary.main",
                          fontWeight: 500,
                        }}
                      >
                        {row.price}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
                        {row.sold}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                p: 1.5,
                textAlign: "center",
                borderTop: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Sistem katalog hanya memuat produk yang lolos pada saringan data
                cleaning di atas.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
