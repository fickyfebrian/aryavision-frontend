import Box from '@mui/material/Box';
import { Section } from '../../ui/Section';
import { AppContainer } from '../../ui/AppContainer';
import { SectionHeader } from '../SectionHeader';
import { FeatureCard } from '../FeatureCard';
import { BENEFITS_DATA, BENEFITS_SECTION_TITLE } from '../../../features/home';

const styles = {
  gridContainer: {
    display: 'grid',
    gap: { xs: 3, md: 4 },
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
  },
};

export const BenefitsSection = () => {
  return (
    <Section>
      <AppContainer>
        <SectionHeader title={BENEFITS_SECTION_TITLE} align="center" />
        
        <Box sx={styles.gridContainer}>
          {BENEFITS_DATA.map((benefit) => (
            <FeatureCard
              key={benefit.id}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              variant="bordered"
            />
          ))}
        </Box>
      </AppContainer>
    </Section>
  );
};
