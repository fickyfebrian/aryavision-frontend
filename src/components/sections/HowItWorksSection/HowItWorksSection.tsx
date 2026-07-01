import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Section } from '../../ui/Section';
import { AppContainer } from '../../ui/AppContainer';
import { SectionHeader } from '../SectionHeader';
import { FeatureCard } from '../FeatureCard';
import { HOW_IT_WORKS_DATA, HOW_IT_WORKS_SECTION_TITLE } from '../../../features/home';

const styles = {
  section: {
    bgcolor: 'grey.50',
  },
  gridWrapper: {
    position: 'relative',
  },
  connectorLine: {
    display: { xs: 'none', md: 'block' },
    position: 'absolute',
    top: { md: 104 }, // Roughly aligned with the center of the 56x56 icon box inside FeatureCard (padding 32 + 28)
    left: '16%',
    right: '16%',
    height: '2px',
    borderTop: '2px dashed',
    borderColor: 'divider',
    zIndex: 0,
  },
  gridContainer: {
    display: 'grid',
    gap: { xs: 3, md: 4 },
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
    },
    position: 'relative',
    zIndex: 1,
  },
  cardWrapper: {
    position: 'relative',
    height: '100%',
  },
  watermark: {
    position: 'absolute',
    top: -16,
    right: 16,
    fontSize: '6rem',
    fontWeight: 900,
    color: 'text.disabled',
    opacity: 0.1,
    lineHeight: 1,
    pointerEvents: 'none',
    zIndex: 2,
  },
};

export const HowItWorksSection = () => {
  return (
    <Section sx={styles.section}>
      <AppContainer>
        <SectionHeader title={HOW_IT_WORKS_SECTION_TITLE} align="center" />

        <Box sx={styles.gridWrapper}>
          <Box sx={styles.connectorLine} />
          
          <Box sx={styles.gridContainer}>
            {HOW_IT_WORKS_DATA.map((step, index) => (
              <Box key={step.id} sx={styles.cardWrapper}>
                <Typography sx={styles.watermark}>
                  0{index + 1}
                </Typography>
                <FeatureCard
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </AppContainer>
    </Section>
  );
};
