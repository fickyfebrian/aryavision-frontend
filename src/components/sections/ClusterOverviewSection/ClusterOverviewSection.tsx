import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
import { Section } from '../../ui/Section';
import { AppContainer } from '../../ui/AppContainer';
import { SectionHeader } from '../SectionHeader';
import { CLUSTER_OVERVIEW_DATA } from '../../../features/home';
import { ClusterBadge } from '../../../features/product/components';
import type { ProductCluster } from '../../../features/product/types';

const styles = {
  gridContainer: {
    display: 'grid',
    gap: { xs: 3, md: 4 },
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
    },
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '16px',
    transition: (theme: Theme) => theme.transitions.create(['box-shadow', 'border-color']),
    '&:hover': {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadows.sm as per UI Constitution
      borderColor: 'primary.main',
    },
  },
  cardContent: {
    p: { xs: 3, md: 4 },
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flexGrow: 1,
    '&:last-child': {
      paddingBottom: { xs: 3, md: 4 },
    },
  },
};

export const ClusterOverviewSection = () => {
  return (
    <Section sx={{ bgcolor: 'background.paper' }}>
      <AppContainer>
        <SectionHeader 
          title="Kategori Produk" 
          subtitle="Tiga kategori utama untuk mempermudah Anda dalam menentukan pilihan sesuai kebutuhan spesifik."
          align="center"
        />

        <Box sx={styles.gridContainer}>
          {CLUSTER_OVERVIEW_DATA.map((item) => (
            <Card key={item.id} sx={styles.card}>
              <CardContent sx={styles.cardContent}>
                <Box>
                  <ClusterBadge cluster={item.cluster as ProductCluster} />
                </Box>
                <Typography variant="h6" component="h3">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </AppContainer>
    </Section>
  );
};
