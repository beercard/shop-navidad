import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Revisá los datos ingresados.', code: 'VALIDATION_ERROR', issues: error.issues.map(({ path, message }) => ({ path: path.join('.'), message })) }, { status: 400 });
  }
  console.error(error);
  return NextResponse.json({ error: 'No pudimos completar la operación. Intentá de nuevo.', code: 'INTERNAL_ERROR' }, { status: 500 });
}

export function serviceUnavailable() {
  return NextResponse.json({ error: 'La campaña no está disponible en este momento.', code: 'SERVICE_UNAVAILABLE' }, { status: 503 });
}
