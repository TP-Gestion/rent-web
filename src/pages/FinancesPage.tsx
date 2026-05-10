import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useBuildings } from '../hooks/useBuildings'
import type { Building } from '../service/propiedades'
import {
  crearGastoSchema,
  EXPENSE_CATEGORY_OPTIONS,
  EXPENSE_DURATION_OPTIONS,
  EXPENSE_FREQUENCY_OPTIONS,
  type ExpenseFormValues,
} from '../schemas/crearGastoSchema'
import { formatCurrency } from '../utils/propertyDetail'
import {
  ExpenseFormCard,
  ExpenseSummaryCard,
  ExpenseSuccessCard,
} from '../components/finances'
import './FinancesPage.css'
import { z } from 'zod'

const INITIAL_VALUES: ExpenseFormValues = {
  propertyId: '',
  category: 'SERVICIOS',
  frequency: 'UNICA',
  durationType: 'INDEFINIDA',
  durationMonths: '',
  amount: '',
  supplier: '',
  reference: '',
  notes: '',
}

function formatFrequencyLabel(value: ExpenseFormValues['frequency']): string {
  return EXPENSE_FREQUENCY_OPTIONS.find((option) => option.value === value)?.label ?? value
}

function formatDurationLabel(values: ExpenseFormValues): string {
  if (values.frequency === 'UNICA') return 'Una sola vez'
  if (values.durationType === 'INDEFINIDA') return 'Indefinida'
  if (values.durationMonths) return `${values.durationMonths} meses`
  return EXPENSE_DURATION_OPTIONS.find((option) => option.value === values.durationType)?.label ?? 'Pendiente'
}

function extractErrors(result: z.SafeParseReturnType<ExpenseFormValues, ExpenseFormValues>) {
  const errs: Partial<Record<keyof ExpenseFormValues, string>> = {}
  if (result.success) return errs

  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof ExpenseFormValues
    if (key && !errs[key]) errs[key] = issue.message
  })

  return errs
}

function getOptionLabel(value: string, options: { value: string; label: string }[]) {
  return options.find((option) => option.value === value)?.label ?? value
}

interface SavedExpense {
  buildingLabel: string
  categoryLabel: string
  frequencyLabel: string
  durationLabel: string
  amountLabel: string
}

export default function FinancesPage() {
  const navigate = useNavigate()
  const { data: buildingsData = [], isLoading, isError } = useBuildings()
  const [values, setValues] = useState<ExpenseFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormValues, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ExpenseFormValues, boolean>>>({})
  const [lastSavedExpense, setLastSavedExpense] = useState<SavedExpense | null>(null)

  const propertyOptions = useMemo(
    () =>
      buildingsData.map((building: Building) => ({
        value: String(building.id),
        label: `${building.name} · ${building.address}`,
      })),
    [buildingsData],
  )

  const selectedBuilding = useMemo(
    () => buildingsData.find((building) => String(building.id) === values.propertyId),
    [buildingsData, values.propertyId],
  )

  const canSubmit = crearGastoSchema.safeParse(values).success

  const propertyPlaceholder = isLoading
    ? 'Cargando edificios...'
    : propertyOptions.length > 0
      ? 'Seleccioná un edificio'
      : 'No hay edificios cargados'

  const selectedBuildingLabel = selectedBuilding
    ? `${selectedBuilding.name} · ${selectedBuilding.address}`
    : 'Pendiente'

  const categoryLabel = getOptionLabel(values.category, EXPENSE_CATEGORY_OPTIONS)
  const frequencyLabel = formatFrequencyLabel(values.frequency)
  const amountLabel = values.amount ? formatCurrency(Number(values.amount)) : 'Pendiente'
  const durationLabel = formatDurationLabel(values)

  const change = (field: keyof ExpenseFormValues, value: string) => {
    const next: ExpenseFormValues = {
      ...values,
      [field]: value,
      ...(field === 'frequency'
        ? value === 'UNICA'
          ? {
              durationType: 'INDEFINIDA',
              durationMonths: '',
            }
          : {
              durationType: 'INDEFINIDA',
              durationMonths: '',
            }
        : {}),
      ...(field === 'durationType' && value === 'INDEFINIDA'
        ? { durationMonths: '' }
        : {}),
    }
    setValues(next)

    if (touched[field]) {
      const result = crearGastoSchema.safeParse(next)
      const fieldErrors = extractErrors(result)
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }

  const blur = (field: keyof ExpenseFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const result = crearGastoSchema.safeParse(values)
    const fieldErrors = extractErrors(result)
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
  }

  const reset = () => {
    setValues(INITIAL_VALUES)
    setErrors({})
    setTouched({})
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = crearGastoSchema.safeParse(values)
    if (!result.success) {
      setErrors(extractErrors(result))
      const allTouched = Object.keys(values).reduce<Partial<Record<keyof ExpenseFormValues, boolean>>>(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      )
      setTouched(allTouched)
      return
    }

    setLastSavedExpense({
      buildingLabel: selectedBuildingLabel,
      categoryLabel,
      frequencyLabel,
      durationLabel,
      amountLabel,
    })
    reset()
  }

  return (
    <div className="fin-page">
      <div className="fin-page__hero">
        <div>
          <div className="fin-page__section-label">Administración financiera</div>
          <h1 className="fin-page__title">Carga de gastos</h1>
          <p className="fin-page__subtitle">
            Registrá gastos operativos o extraordinarios vinculados a un edificio con control visual y validación de campos en tiempo real.
          </p>
        </div>
        <div className="fin-page__period-chip">PERIODO ACTIVO · MARZO 2026</div>
      </div>

      {isError && (
        <div className="fin-feedback fin-feedback--error">No se pudieron cargar los edificios disponibles.</div>
      )}

      {lastSavedExpense && (
        <div className="fin-success-shell">
          <ExpenseSuccessCard
            buildingLabel={lastSavedExpense.buildingLabel}
            categoryLabel={lastSavedExpense.categoryLabel}
            frequencyLabel={lastSavedExpense.frequencyLabel}
            durationLabel={lastSavedExpense.durationLabel}
            amountLabel={lastSavedExpense.amountLabel}
            onCreateAnother={() => setLastSavedExpense(null)}
            onGoToExpensas={() => navigate('/')}
          />
        </div>
      )}

      <div className="fin-page__grid">
        <ExpenseFormCard
          values={values}
          errors={errors}
          propertyOptions={propertyOptions}
          categoryOptions={EXPENSE_CATEGORY_OPTIONS}
          propertyPlaceholder={propertyPlaceholder}
          onChange={change}
          onBlur={blur}
          onSubmit={handleSubmit}
          onReset={reset}
          canSubmit={canSubmit}
        />

        <ExpenseSummaryCard
          selectedBuilding={selectedBuilding}
          categoryLabel={categoryLabel}
          frequencyLabel={frequencyLabel}
          durationLabel={durationLabel}
          amountLabel={amountLabel}
        />
      </div>
    </div>
  )
}
