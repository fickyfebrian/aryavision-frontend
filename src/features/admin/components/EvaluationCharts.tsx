import React from 'react';
import { Box, Card, Typography, Grid, Skeleton } from '@mui/material';
import { Info } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useMLEvaluation } from '../hooks/use-ml-evaluation';

// Custom Tooltip for Elbow
const ElbowTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'white', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Klaster (K): {label}</Typography>
        <Typography variant="body2" sx={{ color: '#2563eb' }}>
          Inertia: {payload[0].value.toFixed(2)}
        </Typography>
      </Box>
    );
  }
  return null;
};

// Custom Tooltip for Silhouette
const SilhouetteTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'white', p: 1.5, border: '1px solid #e2e8f0', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Klaster (K): {label}</Typography>
        <Typography variant="body2" sx={{ color: '#16a34a' }}>
          Silhouette Score: {payload[0].value.toFixed(4)}
        </Typography>
      </Box>
    );
  }
  return null;
};

export const EvaluationCharts: React.FC<{ dynamicData?: any, isLabMode?: boolean }> = ({ dynamicData, isLabMode = false }) => {
  const { data: globalData, isLoading: globalLoading, error: globalError } = useMLEvaluation();

  // If in Lab mode, use dynamicData and ignore global fetching
  const isLoading = isLabMode ? false : globalLoading;
  const error = isLabMode ? (!dynamicData ? new Error("Data evaluasi gagal dihitung.") : null) : globalError;
  const data = isLabMode ? dynamicData : globalData;

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="rectangular" height={250} sx={{ mt: 2, borderRadius: 1 }} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="rectangular" height={250} sx={{ mt: 2, borderRadius: 1 }} />
          </Card>
        </Grid>
      </Grid>
    );
  }

  if (error || !data) {
    return (
      <Card sx={{ p: 4, mt: 4, textAlign: 'center', bgcolor: 'grey.50', border: '1px dashed', borderColor: 'grey.300' }}>
        <Info size={40} className="mx-auto text-gray-400 mb-2" />
        <Typography variant="subtitle1" color="text.secondary">
          Data evaluasi model tidak tersedia.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pastikan model telah dilatih (Retrain Model) melalui menu Lab Algoritma.
        </Typography>
      </Card>
    );
  }

  const { recommended_k, elbow, silhouette } = data;

  return (
    <Card variant="outlined" sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#4f46e5' }}>
        <span>📈</span> JUSTIFIKASI ILMIAH PENENTUAN KLASTER (EVALUASI MODEL)
        {isLabMode && (
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4338ca', marginLeft: '8px' }}>
            Data Uji (Dinamis)
          </span>
        )}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'justify' }}>
        Penentuan jumlah klaster aktual dalam sistem ini tidak hanya bergantung mutlak pada nilai matematis, melainkan menggunakan pendekatan <strong>Hybrid (Matematis & Efisiensi Alur Bisnis)</strong>. Grafik di bawah memetakan titik optimal matematis berdasarkan Silhouette Score dan metode Elbow. 
        <br /><br />
        Namun, sistem secara praktis menetapkan <strong>K=3 (Budget, Mid Range, Premium)</strong> untuk memecahkan masalah utama toko: <strong>memangkas siklus konsultasi manual yang berulang-ulang</strong>. Pembagian 3 klaster ini mengadopsi model psikologi konsumen <em>"Good, Better, Best"</em>. Tujuannya agar pelanggan awam dapat secara mandiri dan cepat menemukan produk yang sesuai dengan daya belinya tanpa harus melalui proses tanya-jawab panjang dengan Admin. Dengan K=3, saat pelanggan menghubungi Admin via WhatsApp, alur yang terjadi langsung menuju proses negosiasi (deal) atau transaksi.
      </Typography>

      <Grid container spacing={4}>
        {/* Grafik Elbow */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2, bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#334155' }}>
              Metode Elbow (Inertia vs K)
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
              Mencari "titik siku" di mana penurunan jarak dalam klaster (Inertia) mulai melandai.
            </Typography>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={elbow} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="k" 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    tickFormatter={(val) => val > 1000 ? `${(val/1000).toFixed(0)}k` : val}
                  />
                  <Tooltip content={<ElbowTooltip />} />
                  <ReferenceLine 
                    x={recommended_k} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    label={{ position: 'top', value: `K=${recommended_k}`, fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inertia" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>

        {/* Grafik Silhouette */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2, bgcolor: '#f0fdf4' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#334155' }}>
              Metode Silhouette Score
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
              Mencari nilai tertinggi (mendekati 1) yang mengindikasikan separasi klaster paling baik.
            </Typography>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={silhouette} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="k" 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => val.toFixed(2)}
                  />
                  <Tooltip content={<SilhouetteTooltip />} />
                  <ReferenceLine 
                    x={recommended_k} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    label={{ position: 'top', value: `K=${recommended_k}`, fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#16a34a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};
