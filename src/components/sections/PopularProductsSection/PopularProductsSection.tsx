import Box from '@mui/material/Box';
import { Section } from '../../ui/Section';
import { AppContainer } from '../../ui/AppContainer';
import { SectionHeader } from '../SectionHeader';
import { POPULAR_PRODUCTS_DATA } from '../../../features/home';
import { ProductCard } from '../../../features/product/components';

const styles = {
  section: {
    bgcolor: 'grey.50',
  },
  gridContainer: {
    display: 'grid',
    gap: 3,
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
  },
};

export const PopularProductsSection = () => {
  return (
    <Section sx={styles.section}>
      <AppContainer>
        <SectionHeader 
          title="Produk CCTV Pilihan" 
          subtitle="Berbagai pilihan produk terbaik yang paling sering dicari oleh pengguna kami."
          align="center"
        />

        <Box sx={styles.gridContainer}>
          {POPULAR_PRODUCTS_DATA.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </Box>
      </AppContainer>
    </Section>
  );
};
