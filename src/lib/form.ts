import { zodResolver } from "@hookform/resolvers/zod"
import type { FieldValues, Resolver } from "react-hook-form"

/**
 * A structural view of a Zod 4 schema that keeps the form input typed as
 * `FieldValues` so react-hook-form's `Control` generic resolves correctly.
 */
type FormSchema<T extends FieldValues> = {
  _zod: { input: FieldValues; output: T }
}

/**
 * Wraps `zodResolver` with an explicit output type so react-hook-form's
 * `Control` generic resolves correctly with Zod 4 schemas.
 */
export function zodFormResolver<T extends FieldValues>(
  schema: FormSchema<T>,
): Resolver<T> {
  return zodResolver(schema) as Resolver<T>
}
