/// <reference types="google.maps" />
import { useEffect, useRef } from "react";

type MapaLocalidadProps = {
  onSelect: (place: google.maps.places.PlaceResult) => void;
  localidad: boolean;
  placeholder?: string;
  className?: string;
  valor?: string;
};

export default function MapaLocalidad({ onSelect, className, placeholder, localidad, valor }: MapaLocalidadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof google === "undefined" || !inputRef.current) return;

    let options: google.maps.places.AutocompleteOptions;

    if (localidad) {
      options = {
      types: ["(cities)"],
      componentRestrictions: { country: "ar" },
    }} else {
      options = {
      types: ["address"],
      componentRestrictions: { country: "ar" },
    }}

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);
    const listener: google.maps.MapsEventListener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace(); // PlaceResult
      onSelect(place);
    });

    return () => listener.remove();
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      name="localidad"
      value={valor}
      placeholder={placeholder ?? "Buscar ciudad o localidad"}
      className={`form-control ${className ?? ""}`}
    />
  );
}