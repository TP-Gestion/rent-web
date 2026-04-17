import { useEffect, useMemo, useState } from "react";
import z from "zod";
import {
  createPropertySchema,
  FormValues,
} from "../schemas/createPropertySchema";
import { useCreateProperty } from "./useCreateProperty";

export const TIPO_OPTIONS = [
  { value: "departamento", label: "Departamento" },
  { value: "casa", label: "Casa" },
  { value: "oficina", label: "Oficina" },
  { value: "local", label: "Local comercial" },
];

const INITIAL_VALUES: FormValues = {
  direccion: "",
  edificio: "",
  piso: "",
  superficie: "",
  ambientes: "",
  montoAlquiler: "",
  expensas: "",
  tipoUnidad: "",
  enAlquiler: false,
  nombreInquilino: "",
  apellidoInquilino: "",
  correoInquilino: "",
  telefonoInquilino: "",
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type TouchedMap = Partial<Record<keyof FormValues, boolean>>;

const isExistingPropertyError = (
  data?: { errors: { code: string }[] } | undefined,
) => data?.errors?.some((e) => e.code === "PROP001");

function extractErrors(result: z.SafeParseReturnType<FormValues, FormValues>) {
  const errs: FormErrors = {};
  if (result.success) return errs;

  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof FormValues;
    if (key && !errs[key]) errs[key] = issue.message;
  });

  return errs;
}

export function useAddPropertyForm() {
  const mutation = useCreateProperty();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedMap>({});

  const isValid = useMemo(
    () => createPropertySchema.safeParse(values).success,
    [values],
  );

  useEffect(() => {
    if (!mutation.isSuccess || !isExistingPropertyError(mutation.data)) return;

    const msg = "Revisa este campo.";
    setErrors((prev) => ({ ...prev, edificio: msg, piso: msg }));
    setTouched((prev) => ({ ...prev, edificio: true, piso: true }));
  }, [mutation.isSuccess, mutation.data]);

  const handleChange = (field: keyof FormValues, value: string | boolean) => {
    const next = { ...values, [field]: value };
    setValues(next);

    if (!touched[field]) return;

    const result = createPropertySchema.safeParse(next);
    const nextErrors = extractErrors(result);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const result = createPropertySchema.safeParse(values);
    const nextErrors = extractErrors(result);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createPropertySchema.safeParse(values);
    if (!result.success) {
      const nextErrors = extractErrors(result);
      setErrors(nextErrors);

      const allTouched = Object.keys(values).reduce<TouchedMap>(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      );
      setTouched(allTouched);
      return;
    }

    const { enAlquiler, montoAlquiler, expensas, ambientes, ...rest } =
      result.data;

    mutation.mutate({
      ...rest,
      ambientes: Number(ambientes),
      ...(montoAlquiler ? { montoAlquiler: Number(montoAlquiler) } : {}),
      ...(expensas ? { expensas: Number(expensas) } : {}),
      ...(!enAlquiler
        ? {
            nombreInquilino: undefined,
            apellidoInquilino: undefined,
            correoInquilino: undefined,
            telefonoInquilino: undefined,
          }
        : {}),
    });
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
    mutation.reset();
  };

  return {
    mutation,
    values,
    errors,
    isValid,
    TIPO_OPTIONS,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  };
}
