import { useState, useRef, useEffect } from "react";
import "./SelectOrCreate.css";

export interface SelectOrCreateItem {
  id: number;
  primaryLabel: string;
  secondaryLabel?: string;
}

interface SelectOrCreateProps {
  items: SelectOrCreateItem[];
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClear: () => void;
  onCreateNew: () => void;
  searchPlaceholder?: string;
  createLabel?: string;
  emptyLabel?: string;
  error?: string;
}

export function SelectOrCreate({
  items,
  isLoading,
  selectedId,
  onSelect,
  onClear,
  onCreateNew,
  searchPlaceholder = "Buscar...",
  createLabel = "Crear nuevo",
  emptyLabel = "No se encontraron resultados",
  error,
}: SelectOrCreateProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((i) => i.id === selectedId) ?? null;

  const filtered = query.trim()
    ? items.filter(
        (i) =>
          i.primaryLabel.toLowerCase().includes(query.toLowerCase()) ||
          i.secondaryLabel?.toLowerCase().includes(query.toLowerCase()),
      )
    : items;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: number) => {
    onSelect(id);
    setQuery("");
    setIsOpen(false);
  };

  if (selectedItem) {
    return (
      <div className="soc-selected">
        <div className="soc-selected__info">
          <span className="soc-selected__primary">
            {selectedItem.primaryLabel}
          </span>
          {selectedItem.secondaryLabel && (
            <span className="soc-selected__secondary">
              {selectedItem.secondaryLabel}
            </span>
          )}
        </div>
        <button type="button" className="soc-selected__clear" onClick={onClear}>
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div
      className={`soc-container${error ? " soc-container--error" : ""}`}
      ref={containerRef}
    >
      <input
        type="text"
        className="soc-input"
        placeholder={searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="soc-dropdown">
          {isLoading ? (
            <div className="soc-dropdown__msg">Cargando...</div>
          ) : (
            <>
              {filtered.length === 0 && (
                <div className="soc-dropdown__msg">{emptyLabel}</div>
              )}
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="soc-dropdown__item"
                  onMouseDown={() => handleSelect(item.id)}
                >
                  <span className="soc-dropdown__item-primary">
                    {item.primaryLabel}
                  </span>
                  {item.secondaryLabel && (
                    <span className="soc-dropdown__item-secondary">
                      {item.secondaryLabel}
                    </span>
                  )}
                </button>
              ))}
              <button
                type="button"
                className="soc-dropdown__create"
                onMouseDown={() => {
                  setIsOpen(false);
                  onCreateNew();
                }}
              >
                + {createLabel}
              </button>
            </>
          )}
        </div>
      )}
      {error && <p className="soc-error">{error}</p>}
    </div>
  );
}
