import { ShieldCheck, Clock, Layers, BrainCircuit } from 'lucide-react';
import type { HomeBenefit, HowItWorksStep, ClusterOverviewItem } from '../types';

export const BENEFITS_DATA: HomeBenefit[] = [
  {
    id: 'benefit-1',
    title: 'Sesuai Kebutuhan Spesifik',
    description: 'Membantu Anda memilih CCTV yang paling cocok dengan kebutuhan spesifik dan anggaran yang Anda miliki.',
    icon: <ShieldCheck size={28} />,
  },
  {
    id: 'benefit-2',
    title: 'Hemat Waktu Pencarian',
    description: 'Tidak perlu menelusuri ratusan opsi secara manual. Sistem menyaring pilihan terbaik dalam hitungan detik.',
    icon: <Clock size={28} />,
  },
  {
    id: 'benefit-3',
    title: 'Kategori Otomatis Akurat',
    description: 'Seluruh produk telah dikelompokkan secara otomatis berdasarkan spesifikasinya untuk akurasi rekomendasi.',
    icon: <Layers size={28} />,
  },
  {
    id: 'benefit-4',
    title: 'Alternatif Serupa Cerdas',
    description: 'Dapatkan deretan rekomendasi produk alternatif yang memiliki fitur dan kemampuan sangat serupa.',
    icon: <BrainCircuit size={28} />,
  },
];

export const HOW_IT_WORKS_DATA: HowItWorksStep[] = [
  {
    id: 'step-1',
    title: '1. Pilih Produk CCTV',
    description: 'Mulai dengan menjelajahi katalog dan pilih satu produk referensi yang menarik perhatian Anda.',
    icon: <Layers size={28} />,
  },
  {
    id: 'step-2',
    title: '2. Sistem Menganalisis',
    description: 'Sistem mengelompokkan dan membandingkan fitur produk menggunakan metode K-Means & Content-Based Filtering.',
    icon: <BrainCircuit size={28} />,
  },
  {
    id: 'step-3',
    title: '3. Lihat Rekomendasi',
    description: 'Dapatkan daftar produk alternatif yang paling relevan dengan pilihan awal Anda.',
    icon: <ShieldCheck size={28} />,
  },
];

export const CLUSTER_OVERVIEW_DATA: ClusterOverviewItem[] = [
  {
    id: 'cluster-budget',
    cluster: 'budget',
    title: 'Budget',
    description: 'Pilihan ekonomis untuk kebutuhan rumah dan penggunaan dasar.',
  },
  {
    id: 'cluster-mid',
    cluster: 'mid-range',
    title: 'Mid Range',
    description: 'Performa seimbang dengan fitur yang lebih lengkap untuk toko atau kantor.',
  },
  {
    id: 'cluster-premium',
    cluster: 'premium',
    title: 'Premium',
    description: 'Produk dengan spesifikasi tinggi untuk kebutuhan pengawasan profesional.',
  },
];
