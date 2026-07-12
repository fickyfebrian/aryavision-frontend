import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Button, 
  Tabs, 
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ScienceIcon from '@mui/icons-material/Science';
import { labApi, type ProcessDatasetResponse } from './api/lab.api';

import { CleaningTab } from './components/lab/CleaningTab';
import { NormalizationTab } from './components/lab/NormalizationTab';
import { KMeansTab } from './components/lab/KMeansTab';
import { CBFTab } from './components/lab/CBFTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lab-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const LabPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataset, setDataset] = useState<ProcessDatasetResponse['data'] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const res = await labApi.processDataset(file);
      setDataset(res.data);
      setActiveTab(0);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Gagal memproses file CSV.");
    } finally {
      setLoading(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = () => {
    setDataset(null);
    setActiveTab(0);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScienceIcon fontSize="large" color="primary" />
            Lab Algoritma
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Sandbox pengujian independen. Unggah file CSV untuk menguji pipeline ML tanpa mengubah database utama.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <input
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {dataset ? (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearData}
            >
              Hapus Data Uji
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={handleUploadClick}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Import CSV Data Uji"}
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading && !dataset && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {!dataset && !loading && !error && (
        <Card sx={{ p: 8, textAlign: 'center', bgcolor: 'grey.50', border: '1px dashed', borderColor: 'grey.300' }}>
          <ScienceIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Sandbox Kosong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Silakan unggah dataset CSV (seperti dataset skripsi Anda) untuk memulai simulasi pembersihan, normalisasi, dan kalkulasi jarak.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={handleUploadClick}
          >
            Pilih File CSV
          </Button>
        </Card>
      )}

      {dataset && (
        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="1. Data Cleaning" />
              <Tab label="2. Normalisasi" />
              <Tab label="3. K-Means" />
              <Tab label="4. Kalkulator CBF" />
            </Tabs>
          </Box>
          
          <CustomTabPanel value={activeTab} index={0}>
            <CleaningTab 
              stats={dataset.stats} 
              raw_products={dataset.raw_products} 
              cleaned_products={dataset.cleaned_products} 
            />
          </CustomTabPanel>
          
          <CustomTabPanel value={activeTab} index={1}>
            <NormalizationTab 
              bounds={dataset.bounds} 
              cleaned_products={dataset.cleaned_products} 
              normalized_products={dataset.normalized_products} 
            />
          </CustomTabPanel>
          
          <CustomTabPanel value={activeTab} index={2}>
            <KMeansTab 
              clusters={dataset.clusters} 
              cleaned_products={dataset.cleaned_products} 
              evaluation={dataset.evaluation}
            />
          </CustomTabPanel>
          
          <CustomTabPanel value={activeTab} index={3}>
            <CBFTab 
              bounds={dataset.bounds} 
              cleaned_products={dataset.cleaned_products} 
            />
          </CustomTabPanel>
        </Card>
      )}
    </Box>
  );
};
