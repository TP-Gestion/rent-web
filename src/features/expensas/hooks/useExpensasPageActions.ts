export function useExpensasPageActions() {
  const handleExportar = () => {
    alert("Exportando reporte de Marzo 2026...");
  };

  const handleGenerarLiquidacion = () => {
    alert("Generando liquidación...");
  };

  const handleVerInforme = () => {
    alert("Abriendo informe de morosidad...");
  };

  const handleConfigurar = () => {
    alert("Abriendo configuración de alertas...");
  };

  const handleSendReminders = () => {
    alert("Enviando recordatorios a 14 inquilinos...");
  };

  const handleReconcileBank = () => {
    alert("Iniciando conciliación bancaria...");
  };

  return {
    handleConfigurar,
    handleExportar,
    handleGenerarLiquidacion,
    handleReconcileBank,
    handleSendReminders,
    handleVerInforme,
  };
}
