export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "-";
  
  try {
    let normalized = dateString;
    // Jika format date naive (tanpa Z atau offset zona waktu), kita anggap sebagai UTC
    const hasTimezone = normalized.endsWith('Z') || /(?:\+|-)\d{2}:\d{2}$/.test(normalized);
    if (!hasTimezone) {
      normalized += 'Z';
    }

    return new Date(normalized).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "-";
  }
};
