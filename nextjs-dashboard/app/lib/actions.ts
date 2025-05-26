'use server'

import { z } from 'zod'
import postgres from 'postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.preprocess((v) => {
    if (typeof v !== 'string') {
      return v;
    }

    if (v === '') {
      return undefined;
    }

    return Number(v.trim().replace(/,/, '.'))
  }, z.number()),
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

const CreateInvoiceFormSchema = InvoiceSchema.omit({
  id: true,
  date: true
})

export async function createInvoice(formData: FormData) {
  const safeData = CreateInvoiceFormSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  if (safeData.error) {
    throw new Error("Alguno de los datos no fué ingresado")
  }

  const { customerId, amount, status } = safeData.data

  const amountInCents = amount * 100

  const [date] = new Date().toISOString().split('T')

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
  } catch (error) {
    throw new Error("No se pudo cargar la factura, intentelo más tarde")
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

const UpdateInvoice = InvoiceSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const safeData = CreateInvoiceFormSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  if (safeData.error) {
    throw new Error("Alguno de los datos no fue ingresado")
  }

  const { customerId, amount, status } = safeData.data

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    throw new Error("La actualización falló, intentelo más tarde")
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
