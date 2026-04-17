import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import styles from "./FormFields.module.css";

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
    <div className={styles["np-field"]}>
      <label className={styles["np-label"]} htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        className={`${styles["np-input"]}${error ? ` ${styles["np-input--error"]}` : ""}`}
        {...rest}
      />
      {error && (
        <p className={styles["np-error-msg"]} role="alert">
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
    <div className={styles["np-field"]}>
      <label className={styles["np-label"]} htmlFor={fieldId}>
        {label}
      </label>
      <select
        id={fieldId}
        className={`${styles["np-select"]}${error ? ` ${styles["np-select--error"]}` : ""}`}
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
        <p className={styles["np-error-msg"]} role="alert">
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
    <label className={styles["np-toggle-row"]}>
      <div
        className={`${styles["np-toggle-track"]}${checked ? ` ${styles["np-toggle-track--on"]}` : ""}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === " " && onChange(!checked)}
      >
        <div
          className={`${styles["np-toggle-thumb"]}${checked ? ` ${styles["np-toggle-thumb--on"]}` : ""}`}
        />
      </div>
      <span className={styles["np-toggle-label"]}>{label}</span>
    </label>
  );
}
