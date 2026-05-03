import { useState, useRef, useEffect } from "react";
import "./MultiSelect.css";

export interface MultiSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  badge?: React.ReactNode;
}

interface Props {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hasError?: boolean;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccioná...",
  hasError,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggle = (val: string) => {
    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val],
    );
  };

  const triggerLabel =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? (options.find((o) => o.value === value[0])?.label ?? value[0])
        : `${value.length} períodos seleccionados`;

  return (
    <div
      ref={containerRef}
      className={`ms-container${hasError ? " ms-container--error" : ""}`}
    >
      <button
        type="button"
        className={`ms-trigger${open ? " ms-trigger--open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={
            value.length === 0 ? "ms-trigger__placeholder" : "ms-trigger__value"
          }
        >
          {triggerLabel}
        </span>
        <span
          className={`ms-trigger__arrow${open ? " ms-trigger__arrow--open" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="ms-dropdown">
          {options.length === 0 && (
            <div className="ms-dropdown__empty">Sin opciones disponibles</div>
          )}
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`ms-option${opt.disabled ? " ms-option--disabled" : ""}${isSelected ? " ms-option--selected" : ""}`}
              >
                <input
                  type="checkbox"
                  className="ms-option__check"
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => {
                    if (!opt.disabled) toggle(opt.value);
                  }}
                />
                <div className="ms-option__content">
                  <span className="ms-option__label">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="ms-option__sublabel">{opt.sublabel}</span>
                  )}
                </div>
                {opt.badge}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
