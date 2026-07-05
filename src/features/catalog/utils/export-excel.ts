import * as xlsx from 'xlsx';
import type { Product } from '@/features/product/types';
import { formatDate, formatTime } from '@/utils/dateFormatter';

const capitalizeString = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const exportRecommendationToExcel = (selectedProduct: Product, recommendations: Product[]) => {
  const now = new Date();
  
  // Menyiapkan data array of arrays untuk Excel
  const excelData: any[][] = [];
  
  // 1. Header Informasi
  excelData.push(['Laporan Hasil Rekomendasi Produk CCTV']);
  excelData.push(['Dicetak pada:', `${formatDate(now)} ${formatTime(now)}`]);
  excelData.push([]);
  
  // 2. Data Produk Acuan
  excelData.push(['PRODUK ACUAN']);
  excelData.push(['Nama Produk', selectedProduct.name]);
  excelData.push(['Harga', selectedProduct.price]);
  excelData.push(['Rating', selectedProduct.rating]);
  excelData.push(['Terjual', selectedProduct.soldCount]);
  excelData.push(['Cluster', capitalizeString(selectedProduct.cluster)]);
  excelData.push([]);
  
  // 3. Tabel Daftar Rekomendasi
  excelData.push(['DAFTAR REKOMENDASI']);
  excelData.push(['No', 'Nama Produk', 'Harga', 'Rating', 'Terjual', 'Cluster']);
  
  recommendations.forEach((item, index) => {
    excelData.push([
      index + 1,
      item.name,
      item.price, // Biarkan sebagai angka (tidak di-format Rp) agar di Excel bisa diformat angka dan dikalkulasi
      item.rating,
      item.soldCount,
      capitalizeString(item.cluster)
    ]);
  });
  
  // 4. Footer
  excelData.push([]);
  excelData.push(['Laporan ini dihasilkan secara otomatis oleh Sistem Pendukung Keputusan AryaVision menggunakan metode Content-Based Filtering.']);

  // Buat worksheet
  const ws = xlsx.utils.aoa_to_sheet(excelData);
  
  // Mengatur lebar kolom agar rapi
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 50 }, // Nama Produk
    { wch: 15 }, // Harga
    { wch: 10 }, // Rating
    { wch: 10 }, // Terjual
    { wch: 15 }  // Cluster
  ];

  // Buat workbook dan tambahkan worksheet
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Rekomendasi');
  
  // 5. Simpan File (Penamaan otomatis)
  const safeName = selectedProduct.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = formatTime(now).replace(':', '-').substring(0, 5);
  
  const fileName = `Recommendation_${safeName}_${dateStr}_${timeStr}.xlsx`;
  xlsx.writeFile(wb, fileName);
};
