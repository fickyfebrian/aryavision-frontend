import { EmptyState } from '@/components/common';
import InboxIcon from '@mui/icons-material/Inbox';

export const RecommendationEmpty = () => {
  return (
    <EmptyState
      icon={<InboxIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
      title="Belum Ada Hasil Rekomendasi"
      description="Silakan isi form filter di atas untuk mendapatkan rekomendasi CCTV terbaik yang sesuai dengan kebutuhan Anda."
    />
  );
};
