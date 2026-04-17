import styles from "../ExpensasPage.module.css";

interface HeaderButtonProps {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

export default function HeaderButton({ label, primary, onClick }: HeaderButtonProps) {
  return (
    <button onClick={onClick} className={`${styles.headerButton} ${primary ? styles.headerButtonPrimary : ""}`}>
      {label}
    </button>
  );
}
