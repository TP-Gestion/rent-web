interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  totalResults: number
  perPage?: number
  onChange: (page: number) => void
}

export default function DataTablePagination({ currentPage, totalPages, totalResults, perPage = 10, onChange }: DataTablePaginationProps) {
  const from = (currentPage - 1) * perPage + 1
  const to = Math.min(currentPage * perPage, totalResults)

  const pages: number[] = []
  const maxVisible = 3
  for (let i = 1; i <= Math.min(maxVisible, totalPages); i += 1) {
    pages.push(i)
  }

  return (
    <div className="data-table__pagination-wrap">
      <div className="pagination" role="navigation" aria-label="Paginación">
        <span className="pagination__summary">
          Mostrando {from}-{to} de {totalResults} resultados
        </span>
        <div className="pagination__controls">
          <button
            onClick={() => onChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`pagination__button${currentPage === 1 ? ' pagination__button--disabled' : ''}`}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`pagination__button${page === currentPage ? ' pagination__button--active' : ''}`}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          {totalPages > maxVisible && <span className="pagination__ellipsis">…</span>}

          <button
            onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`pagination__button${currentPage === totalPages ? ' pagination__button--disabled' : ''}`}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
