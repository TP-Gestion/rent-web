import DownloadIcon from "./DownloadIcon";
import { PROPERTY_DOCUMENTS } from "../../mocks/propertyDocuments";

export default function DocumentsCard() {
  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Documentación</h2>
      <div className="pd-docs__list">
        {PROPERTY_DOCUMENTS.map((doc) => (
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
