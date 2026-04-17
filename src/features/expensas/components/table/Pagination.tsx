import styles from "../ExpensasDataTable.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  perPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalResults, perPage, onChange }: PaginationProps) {
  const from = totalResults === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = totalResults === 0 ? 0 : Math.min(currentPage * perPage, totalResults);

  const pages: number[] = [];
  const maxVisible = 3;
  for (let page = 1; page <= Math.min(maxVisible, totalPages); page += 1) {
    pages.push(page);
  }

  return (
    <div className={styles.paginationWrap}>
      <div className={styles.pagination} role="navigation" aria-label="Paginación">
        <span className={styles.summary}>
          Mostrando {from}-{to} de {totalResults} resultados
        </span>
        <div className={styles.paginationControls}>
          <button
            onClick={() => onChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ""}`}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonActive : ""}`}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {totalPages > maxVisible && <span className={styles.ellipsis}>…</span>}

          <button
            onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ""}`}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
