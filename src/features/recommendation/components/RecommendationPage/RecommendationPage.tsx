import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AppContainer, Section } from '@/components/ui';
import { RecommendationFilter } from '../RecommendationFilter';
import { RecommendationResult } from '../RecommendationResult';
import { RecommendationSkeleton } from '../RecommendationSkeleton';
import { RecommendationEmpty } from '../RecommendationEmpty';
import { POPULAR_PRODUCTS_DATA } from '@/features/home/data';

export const RecommendationPage = () => {
  // Mock state to toggle between states for presentational purposes
  const [viewState] = useState<'empty' | 'loading' | 'results'>('results');

  const dummyResults = [...POPULAR_PRODUCTS_DATA, ...POPULAR_PRODUCTS_DATA].map((p, i) => ({
    ...p,
    id: `${p.id}-${i}`
  })).slice(0, 4);

  return (
    <Section sx={{ py: 6 }}>
      <AppContainer>
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Sistem Rekomendasi
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Temukan CCTV yang paling tepat untuk kebutuhan Anda dengan menjawab beberapa pertanyaan sederhana di bawah ini.
          </Typography>
        </Box>

        {/* Filter Form */}
        <RecommendationFilter />

        {/* Results Area */}
        {viewState === 'empty' && <RecommendationEmpty />}
        {viewState === 'loading' && <RecommendationSkeleton />}
        {viewState === 'results' && <RecommendationResult products={dummyResults} />}
      </AppContainer>
    </Section>
  );
};
