export const parseDatetimeLocal = (dtStr?: string | null): Date | null => {
  // dtStr esperado: "YYYY-MM-DDTHH:mm" (input type="datetime-local")
  if (!dtStr) return null;
  const d = new Date(dtStr);
  return isNaN(d.getTime()) ? null : d; // crea Date en zona local y convierte a instante UTC
};


// Convierte un ISO string o Date a "YYYY-MM-DDTHH:mm" (input type="datetime-local")
export const toDatetimeLocal = (iso?: string | Date | null): string => {
  if (!iso) return "";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};
