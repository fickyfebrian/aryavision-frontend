import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Product } from '@/features/product/types';
import { formatDate, formatTime } from '@/utils/dateFormatter';

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const capitalizeString = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const exportRecommendationToPDF = (selectedProduct: Product, recommendations: Product[]) => {
  const doc = new jsPDF();
  const now = new Date();
  
  // 1. Judul Dokumen
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Hasil Rekomendasi Produk CCTV", 14, 20);
  
  // 2. Tanggal Export
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Dicetak pada: ${formatDate(now)} ${formatTime(now)}`, 14, 28);
  
  // 3. Informasi Produk Acuan
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("Produk Acuan", 14, 40);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Nama Produk : ${selectedProduct.name}`, 14, 48);
  doc.text(`Harga       : ${formatPrice(selectedProduct.price)}`, 14, 54);
  doc.text(`Rating      : ${selectedProduct.rating} / 5.0`, 14, 60);
  doc.text(`Terjual     : ${selectedProduct.soldCount}`, 14, 66);
  doc.text(`Cluster     : ${capitalizeString(selectedProduct.cluster)}`, 14, 72);
  
  // 4. Tabel Daftar Rekomendasi
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Daftar Rekomendasi", 14, 86);
  
  const tableData = recommendations.map((item, index) => [
    index + 1,
    item.name,
    formatPrice(item.price),
    `${item.rating}`,
    item.soldCount,
    capitalizeString(item.cluster)
  ]);
  
  autoTable(doc, {
    startY: 92,
    head: [['No', 'Nama Produk', 'Harga', 'Rating', 'Terjual', 'Cluster']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }, // Warna biru profesional
    styles: { fontSize: 9 },
  });
  
  // 5. Footer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  doc.setFontSize(8);
  doc.setTextColor(150);
  
  const footerText = "Laporan ini dihasilkan secara otomatis oleh Sistem Pendukung Keputusan AryaVision menggunakan metode Content-Based Filtering.";
  const splitFooter = doc.splitTextToSize(footerText, 180);
  doc.text(splitFooter, 14, finalY + 15);
  
  // 6. Simpan File (Penamaan otomatis)
  const safeName = selectedProduct.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = formatTime(now).replace(':', '-').substring(0, 5); // Format HH:mm -> HH-mm
  
  const fileName = `Recommendation_${safeName}_${dateStr}_${timeStr}.pdf`;
  doc.save(fileName);
};
