import { useMutation, useQueryClient } from "@tanstack/react-query"
import { issueInvoice } from "../service/invoice"
import type { ApiResponse } from "../service/client"
import type { IssueInvoiceRequest } from "../types/invoice"

export function useIssueInvoice() {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse<void>, Error, IssueInvoiceRequest>({
    mutationFn: (body: IssueInvoiceRequest) => issueInvoice(body),
    onSuccess: (_data, variables) => {
      const propertyId = String(variables.propertyId)

      queryClient.invalidateQueries({
        queryKey: ["propiedad-detalle", propertyId],
      })
      queryClient.invalidateQueries({ queryKey: ["facturas", propertyId] })
      queryClient.invalidateQueries({ queryKey: ["propiedades"] })
    },
  })
}

export default useIssueInvoice