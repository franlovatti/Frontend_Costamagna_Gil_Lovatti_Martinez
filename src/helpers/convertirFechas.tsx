export const parseDatetimeLocal = (dtStr?: string | null): Date | null => {
  // dtStr esperado: "YYYY-MM-DDTHH:mm" (input type="datetime-local")
  if (!dtStr) return null;
  const d = new Date(dtStr);
  return isNaN(d.getTime()) ? null : d; // crea Date en zona local
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

/**
 * Parsea cualquier tipo de fecha (string ISO, string local, Date, null, undefined)
 * y retorna un Date normalizado
 */
export const parseFecha = (fecha: string | Date | null | undefined): Date | null => {
  if (!fecha) return null;
  
  if (fecha instanceof Date) {
    return isNaN(fecha.getTime()) ? null : fecha;
  }
  
  if (typeof fecha === 'string') {
    const parsed = new Date(fecha);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  return null;
};

/**
 * Formatea una fecha a string legible (ej: "28/02/2026")
 */
export const formatFecha = (
  fecha: string | Date | null | undefined,
  locale: string = 'es-AR'
): string => {
  const date = parseFecha(fecha);
  if (!date) return '-';
  return date.toLocaleDateString(locale);
};

/**
 * Formatea una fecha y hora (ej: "28/02/2026, 14:30")
 */
export const formatFechaHora = (
  fecha: string | Date | null | undefined,
  locale: string = 'es-AR'
): string => {
  const date = parseFecha(fecha);
  if (!date) return '-';
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Retorna el string de fecha de Javascript (ej: "Fri Feb 28 2026")
 * Útil para agrupar partidos por fecha
 */
export const getFechaString = (
  fecha: string | Date | null | undefined
): string => {
  const date = parseFecha(fecha);
  if (!date) return '';
  return date.toDateString();
};

/**
 * Compara dos fechas: retorna número negativo si fecha1 < fecha2,
 * positivo si fecha1 > fecha2, 0 si son iguales
 */
export const compararFechas = (
  fecha1: string | Date | null | undefined,
  fecha2: string | Date | null | undefined
): number => {
  const date1 = parseFecha(fecha1);
  const date2 = parseFecha(fecha2);
  
  if (!date1 || !date2) return 0;
  
  return date1.getTime() - date2.getTime();
};

/**
 * Verifica si una fecha está entre dos fechas (inclusive)
 */
export const estaEntreFechas = (
  fecha: string | Date | null | undefined,
  inicio: string | Date | null | undefined,
  fin: string | Date | null | undefined
): boolean => {
  const fechaDate = parseFecha(fecha);
  const inicioDate = parseFecha(inicio);
  const finDate = parseFecha(fin);
  
  if (!fechaDate || !inicioDate || !finDate) return false;
  
  return fechaDate >= inicioDate && fechaDate <= finDate;
};

/**
 * Calcula cuántos días faltan para una fecha
 * Retorna positivo si es futura, negativo si ya pasó
 */
export const diasHasta = (fecha: string | Date | null | undefined): number => {
  const fechaDate = parseFecha(fecha);
  if (!fechaDate) return 0;
  
  const ahora = new Date();
  const diferencia = fechaDate.getTime() - ahora.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

/**
 * Verifica si una fecha ya pasó
 */
export const yaOcurrió = (fecha: string | Date | null | undefined): boolean => {
  const fechaDate = parseFecha(fecha);
  if (!fechaDate) return false;
  
  return fechaDate < new Date();
};

/**
 * Verifica si estamos dentro de un período de tiempo
 */
export const estaAbiertoPeriodo = (
  inicio: string | Date | null | undefined,
  fin: string | Date | null | undefined
): boolean => {
  const ahora = new Date();
  const inicioDate = parseFecha(inicio);
  const finDate = parseFecha(fin);
  
  if (!inicioDate || !finDate) return false;
  
  return ahora >= inicioDate && ahora <= finDate;
};
