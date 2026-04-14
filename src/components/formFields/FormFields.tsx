import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import "./FormFields.css";

interface FieldProps {
  label: string;
  error?: string;
}

interface InputFieldProps
  extends FieldProps,
    InputHTMLAttributes<HTMLInputElement> {}

export function InputField({ label, error, id, ...rest }: InputFieldProps) {
  const fieldId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="np-field">
      <label className="np-label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        className={`np-input${error ? " np-input--error" : ""}`}
        {...rest}
      />
      {error && (
        <p className="np-error-msg" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps
  extends FieldProps,
    SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  error,
  options,
  placeholder,
  id,
  ...rest
}: SelectFieldProps) {
  const fieldId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="np-field">
      <label className="np-label" htmlFor={fieldId}>
        {label}
      </label>
      <select
        id={fieldId}
        className={`np-select${error ? " np-select--error" : ""}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="np-error-msg" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="np-toggle-row">
      <div
        className={`np-toggle-track${checked ? " np-toggle-track--on" : ""}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === " " && onChange(!checked)}
      >
        <div
          className={`np-toggle-thumb${checked ? " np-toggle-thumb--on" : ""}`}
        />
      </div>
      <span className="np-toggle-label">{label}</span>
    </label>
  );
}
