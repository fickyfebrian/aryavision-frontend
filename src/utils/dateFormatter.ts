/**
 * Memformat tanggal menjadi string yang konsisten.
 * Contoh output: "Jumat, 4 Juli 2026"
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Memformat waktu menjadi string yang konsisten.
 * Contoh output: "11:25:45"
 */
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Memformat tanggal dan waktu secara lengkap.
 * Contoh output: "4 Juli 2026, 11:25:45 WIB"
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = formatTime(d);
  
  return `${dateStr}, ${timeStr} WIB`;
};
