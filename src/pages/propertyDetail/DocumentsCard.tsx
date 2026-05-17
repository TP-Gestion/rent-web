import DownloadIcon from "../../components/DownloadIcon";
import {
  downloadRentalContract,
  updateRentalContract,
} from "../../service/propiedades";
import { useQueryClient } from "@tanstack/react-query";
import {
  MAX_UPLOAD_BYTES,
  ALLOWED_CONTRACT_MIME,
} from "../../config/fileLimits";
import { useState, useRef, type ChangeEvent } from "react";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

interface Props {
  propertyId: string;
  activeContractId?: number | null;
  hasContract?: boolean;
  activeContractAmount?: number | null;
  activeContractDueDate?: string | null;
}

export default function DocumentsCard({
  propertyId,
  activeContractId,
  hasContract,
  activeContractAmount,
  activeContractDueDate,
}: Props) {
  const hasRecord = !!activeContractId;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDownloadContract = async () => {
    if (!activeContractId) return;
    try {
      const blob = await downloadRentalContract(
        propertyId,
        String(activeContractId),
      );
      downloadBlob(blob, `Contrato-${propertyId}.pdf`);
    } catch (e) {}
  };

  const handleSelectFile = async (file?: File | null) => {
    setUploadError(null);
    if (!file) return;
    if (file.type !== ALLOWED_CONTRACT_MIME) {
      setUploadError("El contrato debe ser un PDF");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(
        `El archivo supera el límite de ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB`,
      );
      return;
    }
    if (!activeContractId) {
      setUploadError("No se encontró el contrato para adjuntar el archivo.");
      return;
    }
    console.log("Uploading file:", file);
    try {
      setUploading(true);
      await updateRentalContract(activeContractId, {
        amount: activeContractAmount ?? 0,
        dueDate: activeContractDueDate ?? "",
        contract: file ?? undefined,
      } as any);
      queryClient.invalidateQueries({
        queryKey: ["propiedad-detalle", propertyId],
      });
      queryClient.invalidateQueries({ queryKey: ["propiedades"] });
    } catch (err) {
      setUploadError("No se pudo subir el contrato. Intentá nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleSelectFile(f);
  };
  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Documentación</h2>
      <div className="pd-docs__list">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={onFileInputChange}
        />
        {hasContract ? (
          <>
            <div className="pd-docs__item">
              <span className="pd-docs__icon">📄</span>
              <div className="pd-docs__info">
                <p className="pd-docs__name">Contrato de alquiler</p>
                <p className="pd-docs__size">Contrato activo</p>
              </div>
              <div className="pd-docs__actions">
                <button
                  className="pd-icon-btn"
                  title={`Descargar Contrato de alquiler`}
                  type="button"
                  onClick={handleDownloadContract}
                >
                  <DownloadIcon />
                </button>

                <button
                  className="pd-icon-btn pd-icon-btn--edit"
                  title="Editar contrato"
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : hasRecord ? (
          <div className="pd-docs__upload">
            <div className="pd-docs__upload-actions">
              <button
                className="pd-btn pd-btn--secondary pd-docs__upload-btn"
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Subiendo..." : "Subir contrato"}
              </button>
              {uploadError && (
                <p className="pd-field__error pd-docs__upload-error">
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
