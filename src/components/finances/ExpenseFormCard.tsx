import type { FormEvent } from 'react'
import { InputField, SelectField } from '../formFields/FormFields'
import {
  EXPENSE_DURATION_OPTIONS,
  EXPENSE_FREQUENCY_OPTIONS,
  type ExpenseFormValues,
} from '../../schemas/crearGastoSchema'

interface Option {
  value: string
  label: string
}

interface ExpenseFormCardProps {
  values: ExpenseFormValues
  errors: Partial<Record<keyof ExpenseFormValues, string>>
  propertyOptions: Option[]
  categoryOptions: Option[]
  propertyPlaceholder: string
  onChange: (field: keyof ExpenseFormValues, value: string) => void
  onBlur: (field: keyof ExpenseFormValues) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onReset: () => void
  canSubmit: boolean
}

function FrequencySelector({
  value,
  onChange,
}: {
  value: ExpenseFormValues['frequency']
  onChange: (value: ExpenseFormValues['frequency']) => void
}) {
  return (
    <div className="fin-frequency">
      <div className="fin-frequency__label">Frecuencia del gasto *</div>
      <div className="fin-frequency__segmented">
        {EXPENSE_FREQUENCY_OPTIONS.map((option) => {
          const isActive = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              className={`fin-frequency__option${isActive ? ' fin-frequency__option--active' : ''}`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TextAreaField({
  label,
  value,
  error,
  placeholder,
  onChange,
  onBlur,
}: {
  label: string
  value: string
  error?: string
  placeholder?: string
  onChange: (value: string) => void
  onBlur: () => void
}) {
  const fieldId = label.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className="fin-field">
      <label className="fin-label" htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        id={fieldId}
        className={`fin-textarea${error ? ' fin-textarea--error' : ''}`}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        rows={4}
      />
      {error && <p className="fin-error-msg">{error}</p>}
    </div>
  )
}

export default function ExpenseFormCard({
  values,
  errors,
  propertyOptions,
  categoryOptions,
  propertyPlaceholder,
  onChange,
  onBlur,
  onSubmit,
  onReset,
  canSubmit,
}: ExpenseFormCardProps) {
  return (
    <div className="fin-card">
      <div className="fin-card__header">
        <div>
          <div className="fin-card__eyebrow">Registro contable</div>
          <h2 className="fin-card__title">Carga de gasto</h2>
          <p className="fin-card__subtitle">
            Asigná un gasto a una propiedad y dejalo listo para su control mensual.
          </p>
        </div>
      </div>

      <form className="fin-form" onSubmit={onSubmit} noValidate>
        <div className="fin-grid-2">
          <SelectField
            label="Propiedad *"
            placeholder={propertyPlaceholder}
            options={propertyOptions}
            value={values.propertyId}
            onChange={(event) => onChange('propertyId', event.target.value)}
            onBlur={() => onBlur('propertyId')}
            error={errors.propertyId}
          />
          <SelectField
            label="Categoría *"
            placeholder="Seleccioná una categoría"
            options={categoryOptions}
            value={values.category}
            onChange={(event) => onChange('category', event.target.value)}
            onBlur={() => onBlur('category')}
            error={errors.category}
          />
        </div>

        <FrequencySelector
          value={values.frequency}
          onChange={(nextFrequency) => onChange('frequency', nextFrequency)}
        />

        {values.frequency === 'MENSUAL' ? (
          <>
            <div className="fin-grid-2 fin-grid-2--amount">
            <SelectField
              label="Duración *"
              placeholder="Seleccioná una duración"
              options={EXPENSE_DURATION_OPTIONS}
              value={values.durationType}
              onChange={(event) => onChange('durationType', event.target.value)}
              onBlur={() => onBlur('durationType')}
              error={errors.durationType}
            />
            {values.durationType === 'MESES' ? (
              <InputField
                label="Cantidad de meses *"
                placeholder="12"
                type="number"
                min="1"
                step="1"
                value={values.durationMonths}
                onChange={(event) => onChange('durationMonths', event.target.value)}
                onBlur={() => onBlur('durationMonths')}
                error={errors.durationMonths}
              />
            ) : (
              <div />
            )}
            </div>
            {values.durationType !== 'MESES' && (
              <p className="fin-inline-note">
                El gasto mensual se mantendrá activo de forma indefinida.
              </p>
            )}
          </>
        ) : null}

        <div className="fin-grid-2">
          <InputField
            label="Proveedor"
            placeholder="Ej: Servicios Urbanos S.A."
            value={values.supplier}
            onChange={(event) => onChange('supplier', event.target.value)}
            onBlur={() => onBlur('supplier')}
            error={errors.supplier}
          />
          <InputField
            label="Referencia / N° comprobante"
            placeholder="Factura, recibo o referencia interna"
            value={values.reference}
            onChange={(event) => onChange('reference', event.target.value)}
            onBlur={() => onBlur('reference')}
            error={errors.reference}
          />
        </div>

        <div className="fin-grid-2 fin-grid-2--amount">
          <InputField
            label="Monto *"
            placeholder="0"
            type="number"
            min="1"
            value={values.amount}
            onChange={(event) => onChange('amount', event.target.value)}
            onBlur={() => onBlur('amount')}
            error={errors.amount}
          />
          <div className="fin-form__hint">
            El monto se guarda en moneda local y queda asociado a la propiedad seleccionada.
          </div>
        </div>

        <TextAreaField
          label="Observaciones"
          placeholder="Notas internas, prorrateos o aclaraciones del gasto"
          value={values.notes}
          onChange={(value) => onChange('notes', value)}
          onBlur={() => onBlur('notes')}
          error={errors.notes}
        />

        <div className="fin-actions">
          <button type="button" className="fin-btn fin-btn--secondary" onClick={onReset}>
            Limpiar
          </button>
          <button type="submit" className="fin-btn fin-btn--primary" disabled={!canSubmit}>
            Guardar gasto
          </button>
        </div>
      </form>
    </div>
  )
}
