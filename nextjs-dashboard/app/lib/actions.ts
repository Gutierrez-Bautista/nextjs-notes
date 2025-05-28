'use server'

import { z } from 'zod'
import postgres from 'postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Seleccione un cliente'
  }),
  amount: z.coerce.number({ invalid_type_error: 'Ingrese un número' }).gt(0, { message: 'Ingrese un monto mayor a 0' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Seleccione un estado para la factura'
  }),
  date: z.string()
})

const CreateInvoiceFormSchema = InvoiceSchema.omit({
  id: true,
  date: true
})

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const safeData = CreateInvoiceFormSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  if (safeData.error) {
    return {
      errors: safeData.error.flatten().fieldErrors,
      message: 'Capos faltantes, no se puede crear la factura',
    }
  }

  const { customerId, amount, status } = safeData.data

  const amountInCents = amount * 100

  const [date] = new Date().toISOString().split('T')

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
  } catch {
    return {
      message: 'Fallo al cargar en la Base de Datos, intentelo más tarde'
    }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const safeData = CreateInvoiceFormSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  if (safeData.error) {
    return {
      errors: safeData.error.flatten().fieldErrors,
      message: 'Campos faltantes'
    }
  }

  const { customerId, amount, status } = safeData.data

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch {
    return {
      message: 'Error al actualizar la factura, intentelo más tarde',
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch {
    throw new Error("No se pudo eliminar la factura, intentelo más tarde")
  }

  revalidatePath('/dashboard/invoices');
}
