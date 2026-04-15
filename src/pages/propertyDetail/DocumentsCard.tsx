import DownloadIcon from "../../components/DownloadIcon";

const DOCS = [
  { name: "Contrato de alquiler", size: "2.4 MB", icon: "📄" },
  { name: "Reglamento de convivencia", size: "840 KB", icon: "📋" },
];

export default function DocumentsCard() {
  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Documentación</h2>
      <div className="pd-docs__list">
        {DOCS.map((doc) => (
          <div key={doc.name} className="pd-docs__item">
            <span className="pd-docs__icon">{doc.icon}</span>
            <div className="pd-docs__info">
              <p className="pd-docs__name">{doc.name}</p>
              <p className="pd-docs__size">{doc.size}</p>
            </div>
            <button
              className="pd-icon-btn"
              title={`Descargar ${doc.name}`}
              type="button"
            >
              <DownloadIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
