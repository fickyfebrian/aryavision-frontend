import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Section } from "../../ui/Section";
import { AppContainer } from "../../ui/AppContainer";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { HeroIllustration } from "./HeroIllustration";
import {
  HERO_HEADLINE,
  HERO_PRIMARY_CTA,
  HERO_SUBHEADLINE,
} from "../../../features/home/constants";

export interface HeroSectionProps {
  onPrimaryClick?: () => void;
}

export const HeroSection = ({ onPrimaryClick }: HeroSectionProps) => {
  return (
    <Section sx={{ py: { xs: 6, md: 10, lg: 12 } }}>
      <AppContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          {/* Teks Content (Kiri) */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Stack spacing={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  color="text.primary"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    lineHeight: 1.2,
                  }}
                >
                  {HERO_HEADLINE}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    lineHeight: 1.6,
                    maxWidth: { xs: "100%", md: "90%" },
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  {HERO_SUBHEADLINE}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
              >
                <PrimaryButton size="large" onClick={onPrimaryClick}>
                  {HERO_PRIMARY_CTA}
                </PrimaryButton>
              </Stack>
            </Stack>
          </Box>

          {/* Ilustrasi (Kanan) */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <HeroIllustration />
          </Box>
        </Box>
      </AppContainer>
    </Section>
  );
};
