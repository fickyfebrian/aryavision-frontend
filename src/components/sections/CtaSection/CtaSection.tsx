import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Section } from "../../ui/Section";
import { AppContainer } from "../../ui/AppContainer";
import { PrimaryButton } from "../../ui/PrimaryButton";

const styles = {
  section: {
    bgcolor: "primary.main",
    color: "primary.contrastText",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    maxWidth: "md",
    mx: "auto",
  },
  button: {
    bgcolor: "common.white",
    color: "primary.main",
    mt: 4,
    px: 4,
    py: 1.5,
    fontWeight: 600,
    "&:hover": {
      bgcolor: "grey.100",
    },
  },
};

interface CtaSectionProps {
  onCtaClick?: () => void;
}

export const CtaSection = ({ onCtaClick }: CtaSectionProps) => {
  return (
    <Section sx={styles.section}>
      <AppContainer>
        <Box sx={styles.container}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Siap Menemukan CCTV Terbaik Anda?
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
              opacity: 0.9,
              maxWidth: "sm",
            }}
          >
            Gunakan sistem rekomendasi cerdas kami sekarang dan dapatkan hasil
            analisis spesifikasi yang akurat dalam hitungan detik.
          </Typography>

          <PrimaryButton sx={styles.button} size="large" onClick={onCtaClick}>
            Mulai Cari Sekarang
          </PrimaryButton>
        </Box>
      </AppContainer>
    </Section>
  );
};
