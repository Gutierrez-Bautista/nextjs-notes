Toda la información sobre Next puede encontrarse el la página oficial [nextjs.org](https://nextjs.org/).

# NextJS

NextJS (Next a secas de ahora en más) es un framework de React desarrollado por Vercel que permite crear aplicaciones web full-stack usando React Components para crear la UI y Next para funcionalidades adicionales (como SSR, APIs, React Server Components) y optimizaciones.

Next es a día de hoy el framework número uno de React y muchas empresas grandes utilizan Next para diversos proyectos (Spotify, OpenAI, Patreon, y varias más), es por esto que muchas veces se encuentra trabajo no como desarrollador de React puro sino como desarrollador de Next.

Como último punto cabe destacar que Next permite desarrollar aplicaciones full-stack completas sólo con él, por lo que en muchos casos es útil para llevar a cabo desarrollos rápidos.

## Prerequisitos

Next es un framework de React por lo que antes de aprender Next es necesario entender React a un nivel medianamente decente, no es necesario se un experto pero es bastante importante tener aunque sea unas bases, ya que de lo contrario no podremos hacer nada.

## Crear Proyecto

Para crear un proyecto de Next debemos ejecutar en terminal el siguiente comando

```bash
npx create-next-app@latest
```

o en pnpm

```bash
pnpm create next-app
```

A continuación Next nos pedirá realizar ciertas configuraciones.

- Cuál es el nombre del proyecto --> por defecto "my-app"
- Usar TypeScript --> No / Yes
- Usar ESLint --> No / Yes
- Usar Tailwind CSS --> No / Yes
- Escribir el código en el directorio `src/` --> No / Yes
- Usar el App Router (recomendado) --> No / Yes
- Usar Turbopack para `next dev` -->  No / Yes
- Usar import alias --> No / Yes
- Que import alias quieres usar --> por defecto `@/*`

## Guia Oficial de Next

El equipo de Next creó una guia oficial para aprender las bases del framework con código de ejemplo y despliegue incluidos (puede encontrarse en [nextjs.org/learn](https://nextjs.org/learn)), de ahora en más usaré el código que proporciona esta misma guía para poder dar los ejemplos sin problema, en algunas ocasiones primero se dará un ejemplo propio, pero en todos los casos mostraré partes del código de la guia oficial.

Para descargar el código de la guía puede crearse un proyecto de Next copiando los siguientes comandos

```bash
npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
```

o para pnpm

```bash
pnpm create next-app nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
```

La flag `--example` permite crear el proyecto de Next basado en un repositorio.

# Estilos en Next

Por defecto Next nos permite dar estilos de tres formas distintas

## Estilos Globales

Son la forma más básica, es importar un archivo `.css` cuyos estilos se aplicaran de forma global, esto puede ser útil para que toda la aplicación tenga cierto grado de coherencia.

```tsx
// path: ./app/layout.tsx
import './ui/global.css'
// ...
```

## Tailwind CSS

Si bien Tailwind no es propio de Next el framework está muy preparado para trabajar con él, tanto así que es capaz de crear una configuración por defecto si así se lo decimos.

```tsx
export function MyComponent () {
  return (
    <div className='w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-black'>
    </div>
  )
}
```

## CSS Modules

CSS modules nos permite de forma completamente nativa hacer que nuestras clases tengan un hash que nos permita dar estilos sin preocuparnos de que estos entren en conflicto con los de otra parte de la aplicación.

```css
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

```tsx
import styles from 'myStyles.module.css'

export function MyComponent () {
  return (
    <div className={styles.shape}>
    </div>
  )
}
```

# Optimización de Fuentes e Imagenes

Una de las muchas cosas que ofrece Next es la optimización de fuentes e imagenes.

## Fuentes

Next posee una librería llamada `next/font` que nos otorga una serie de funciones pero a nosotros la que nos interesa ahora es la sublibrería `next/font/google`, esta nos permite importar gran variedad de fuentes desde Google Fonts y que a la hora de hacer la build Next se encargue de descargarlas y alojarlas junto con los demás archivos estáticos de la aplicación sin que tengamos que hacerlo nosotros.

```ts
// path: ./app/ui/fonts.ts
import { Inter } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })
```

Para usar estas fuentes lo que hacemos es dirigirnos a nuestro componente y hacer lo siguiente

```tsx
import './ui/global.css'
import { montserrat } from './ui/fonts'; // Importamos la funete

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* la utilizamos por medio de la propiedad className */}
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
```

## Imagenes

Al igual que Next otorga una serie de librerias que nos ayudan con ciertas optimizaciones también trae componentes con el mismo fin, uno de ellos es el componente `Image` de `next/image`

```tsx
// paht: ./app/Page.tsx

// ...
import Image from 'next/image';

export default function Page() {
  return (
      {/* ... */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image src='/hero-desktop.png' alt='' width={1000} height={760} className='hidden md:block' />
          <Image src='/hero-mobile.png' alt='' width={560} height={620} className='block md:hidden' />
        </div>
      {/* ... */}
  );
}
```

Este componente `Image` optimiza nuestras imagenes de varias maneras.
La primera es detectando el formato óptimo de imagen para el navegador y haciendo la respectiva conversión, de esta forma nuestro png posiblemente sea convertido a webp.
La segunda es que por defecto es lazy load, lo que implica que sólo se va a cargar si tiene que renderizarse, por lo que en el ejemplo de arriba sólo se enviará al cliente la imagen que sea necesaria.

Por otro lado `Image` reserva por medio de las props `width` y `height` (siendo la relación de aspecto de la imagen) el espacio necesario para la imagen en la UI, esto hace que aunque tarde en cargarse la UI no se rompa en ningún momento.

Cabe aclarar que esta optimización de imagenes tiene un costo, por ejemplo Vercel ofrece 3000 transformaciones de imagen gratuitas al mes, si queremos realizar más tendremos que pagar el coste correspondiente.

# Enrutado por el Sistema de Archivos

En Next al igual que en otros frameworks como Astro las rutas de nuestra aplicación se crean en base al sistema de archivos, en el caso de Next esto se logra por medio de los archivos `page.tsx` dentro de la carpeta `./app`. Veamoslo con un ejemplo.

Supongamos que queremos crear los siguientes apartados en nuestra aplicación:

- Principal (en `miweb.com/`).
- tablero (en `miweb.com/dashboard`).

Para ello lo que debemos tener es una estructura similar a la siguiente:

```text
app
 |---> page.tsx
 |---> dashboard
           |---> Ppage.tsx
```

De esta manera se renderizara en `miweb.com/` el componente `page.tsx` que se encuentra directamente en `app` mientras que si nos dirigimos a `miweb.com/dashboard/` se renderizará el componente `page.tsx` dentro del directorio `dashboard/`.

Notese que el nombre del directorio coincide con el que se asigna en la URL.

## Dentro del Archivo `page.tsx`

A la hora de crear nuestro archivo `page.tsx` para una ruta debemos tener en cuenta una cosa, debemos obligatoriamente exportar por defecto un componente (no importa el nombre), ya que es el que buscará Next a la hora de acceder a la ruta.

```tsx
// path ./app/dashboard/page.tsx
export default function DashboardPage () {
  return <h2>Dashboard...</h2>
}
```

## Rutas Anidadas

Supongamos que queremos crear una ruta que sea `miweb.com/dashboard/customers` en este caso lo que debemos hacer es crear la carpeta `customers` dentro de `dashboard`

```text
app
 |---> dashboard
           |---> page.tsx
           |---> customers
                     |---> page.tsx
```

Lo mismo tendriamos que hacer si quisieramos otras sub rutas de dashboard, por ejemplo `invoices`.

## Layouts Según la Ruta

Como ya sabemos los layouts son componentes que envuelven a las páginas, si queremos que un layout sólo se utilice para ciertas páginas lo que hacemos es crear un componente `layout.tsx` dentro de la carpeta que representa esa ruta.

```tsx
// path ./app/dashboard/layout.tsx
import SideNav from '@/app/ui/dashboard/sidenav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```

Este layout se renderizará para todas las subrutas de dashboards por lo que `miweb.com/dashboard`, `miweb.com/customers` y `miweb.com/invoices` compartirán layout.

# Navegación

Por lo general, solemos hacer la navegación de nuestra página con el elemento `<a>` de HTML, no obstante esto tiene un gran problema, y es que, con él, en cada navegación se refresca toda la página, no sólo el contenido necesario, es ahí donde entra el componente `<Link>` de `next/link`, el cual nos permite navegar y que aquellos archivos que ya han sido descargados no se envíen nuevamente.

```tsx
// path: ./app/ui/dashboard/nav-links.tsx

// ...
import Link from 'next/link';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];
 
export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

Además de esto, en producción `<Link>` hace code spliting, lo que quiere decir que sólo se envia al cliente el código que se necesita, no todos los componentes. No obstante, Next hace un prefetch de la página a la que dirige un componente `<Link>` cuando este se encuentra en el viewport lo que también ayuda a que la navegación sea más fluida.

## Estilos Según la Ruta

Para cambiar los estilos de un componente según la ruta (página) en la que nos encontremos vamos a recurrir al Hook de Next llamado `usePathname`

```tsx
// path: ./app/ui/dashboard/nav-links.tsx

// ...
import { usePathname } from 'next/navigation';
 
export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
            ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}  
            `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

Pero con esto vamos a tener un problema, Next por defecto renderiza todos los componentes en el servidor, y el pathname es algo que sólo existe en el cliente, entonces tenemos que especificarle a Next que este componente tiene que renderizarse en el cliente y no en el servidor por medio de la directiva `'use client'`

```tsx
// path: ./app/ui/dashboard/nav-links.tsx
'use client'

// ...
```

# Base de Datos y Fetching de Datos

A continuación veremos cómo hacer fetching de datos en NextJS y para qye sea más cercano a un entorno real crearemos una Base de Datos (BBDD de ahora en más) en los servidores de Vercel.

## Crear la Base de Datos

Para crear la BBDD vamo a utilizar Vercel Storage.

Para ello primero debemos ir a la [página de Vercel](https://vercel.com/) y crearnos una cuenta, acto seguido vamos a Storage y crearemos una BBDD Postgres con `Neon` (debería ser la primera opción del apartado de Marketplace) del cual podemos leer en la sección de [integraciones](https://vercel.com/bautistas-projects-d352204f/~/integrations/neon).

Ahora hacemos algunas configuraciones simples

- Definimos la región: idealmente lo más cerca de nuestro proyecto posible.
- Plan que vamos a usar: El plan gratuito nos permite conectar 10 proyectos y nos da 0.5 GB de almacenamiento, 190 horas de computo y autoescalado hasta 2 Unidades de Computo (2 vCPU, 8 GB RAM).
- Nombre de la BBDD: para este ejemplo usaremos "customer-voices"

Acto seguido nos dará varias opciones para conectarnos a la BBDD, en nuestro caso usaremos `.env.local`, le damos a "Copy Snippet" y lo pegamos en nuestro archivo `.env`, es MUY IMPORTANTE que esta información NO SE SUBA A NINGÚN LADO, ni a un repositorio remoto (a menos que sea privado) y mucho menos debe llegar al cliente.

Hay un pequeño error con el código de Vercel a la hora de trabajar con Neon (no han actualizado la plantilla en un tiempo) por lo que debemos desintalar las dependencias de `bcrypt` y remplazarlas con `bcryptjs`

```bash
pnpm remove bcrypt @types/bcrypt

pnpm add bcryptjs @types/bcryptjs
```

Y a continuación debemos modificar el archivo `./app/seed/route.ts` para que importe `bcryptjs` en lugar de `bcrypt`

```ts
// Antes:
// import bcrypt from "bcrypt";

// Después:
import bcrypt from "bcryptjs";
```

A continuación nos aseguramos de estar ejecutando el proyecto en modo desarrollo con las dependencias actualizadas y vamos a nuestro navegador y nos dirigimos a `http://localhost:3000/seed`.

Esto hará que en nuestra BBDD se carguen una serie de datos por defecto extraidos de los archivos en `./app/lib/`.

## Fetching de Datos

En Next, a diferencia de React tradicional, no vamos a usar hooks como `useEffect` o librerías como `ReactQuery` para realizar las peticiones, usar estos métodos implica que el fetching se haga en el cliente y por ende esto lleva a tener que enviar más código al cliente (el necesario para tratar los datos y renderizar) y mayores tiempos de carga ya que el usuario puede no tener una buena conexión a internet en el momento.

Es aquí donde entran los React Server Components (RSCs), con los cuales ya hemos trabajado, son aquellos componentes que se renderizan únicamente en el servidor. Un peculiaridad de los RSCs es que pueden ser asincronos, esto nos permite usar sintaxis async/await de toda la vida dentro del componente

```tsx
// path ./app/dashboard/page.tsx
import { fetchRevenue } from "../lib/data"

export default async function DashboardPage () {
  const revenue = await fetchRevenue()
  console.log(revenue)

  return <h2>Dashboard...</h2>
}
```

Esto nos mostrará en terminal los datos que buscó en la BBDD.

Acto seguido podemos cambiar nuestro `DashboardPage` para mostrar los datos obtenidos

```tsx
import { fetchRevenue } from "../lib/data"
import RevenueChart from "../ui/dashboard/revenue-chart"
import { lusitana } from "../ui/fonts"

export default async function DashboardPage () {
  const revenue = await fetchRevenue()
  console.log(revenue)

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />

        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  )
}
```

Para que funcione el gráfico debemos ir al archivo en `./app/ui/dashboard/revenue-chart.tsx` y descomentar las lineas del componente.

Ahora si mostramos los componentes `<LastestInvoices>` y `<Card>` (el proceso es igual a lo de antes) veremos que nuestro dashboard cobra más vida.

## Loading y Suspense

Ahora bien, supongamos que nuestras peticiones tardan 3 segundos (lo cual es bastante), de la manera que hicimos el fetching lo que esto proboca es que toda la página tarde esos tres segundos en cargar, esto es claramente negativo para la experiencia del usuario y es por ello que nos vamos a apoyar de una de dos estrategias, un componente `loading.tsx` o usar el componente `<Suspense>` de React.

### `loading.tsx`

De la misma forma que un componente `page.tsx` es el que se renderiza como contenido de una página, si tenemos un componente `loading.tsx` en una ruta será ese componente `loading.tsx` el que se renderice mientras el componente `page.tsx` carga.

Para simular que la petición para obtener los revenue tarda 3 segundo vamos a editar la función `fetchRevenue` de `./app/lib/data.ts` para descomentar la promesa de la linea 20

```ts
// path ./app/lib/data.ts

// ...

export async function fetchRevenue() {
  try {
    // ...
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // ...
  } catch (error) {
    // ...
  }
}
```

Ahora nosdirigimos a `./app/dashboard` y creamos un archivo `loading.tsx` que contenga un componente que renderice `<DashboardSkeleton />` (componente de la demo de Next)

```tsx
// ./app/dashboard/loading.tsx
import DashboardSkeleton from "../ui/skeletons";

export default function DashboardLoading () {
  return <DashboardSkeleton />
}
```

De esta manera si navegamos a `localhost:3000/dashboard` Next nos mostrará una previsualización de cómo se verá la página cuando termine de cargar.

### Suspense

No obstante, lo que vimos antes es poco práctico en este caso, ya que estamos retrasando el renderizado de toda la página porque una petición que afecta a un solo componente tarda, es ahí cuando conviene hacer la petición en cuestión dentro del componente y envolverlo en en el componente `<Suspense>` de React

```tsx
// path ./app/ui/dashboard/revenue-chart.tsx
// ...
import { fetchRevenue } from '@/app/lib/data';

// ...

export default async function RevenueChart() {
  const revenue = await fetchRevenue()
  // ...
}
```

A continuación lo que haremos en nuestra página del dashboard es envolver el componente en un `<Suspense>` y darle un fallback (lo que se renderizará mientra el componente suspendido carga)

```tsx
// path ./app/dashboard/page.tsx
// ...

export default async function DashboardPage () {
  // ...

  return (
    <main>
      {/* ... */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  )
}
```

Esto que acabamos de hacer se denomina "HTML Straming", dejamos la conexión abierta para poder enviar el contenido cuando termine de renderizarse.

# Busqueda, Paginación y estado en URL

Al hacer una página web muchas veces vamos a querer paginar el contenido para no pedir demasiados datos al servidor y que el usuario pueda realizar busquedas, para ello es muy común usar los query params de la URL, y Next nos otorga una serie de Hooks muy útiles.

Pero antes de ver los hooks que usaremos vamos a capturar el input del usuario. Esto lo hacemos de la misma manera en que se hace tradicionalmente con React

```tsx
// path ./app/ui/search.tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ placeholder }: { placeholder: string }) {
  const handleSearch = (term: string) => {
    console.log(term) // <--- input del usuario
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e) => { handleSearch(e.target.value) } }
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
```

## Busqueda

Ahora sí, nosotro lo que queremos es acceder a los query params de la URL, lo normal sería hacerlo por medio del objeto `window`, no obstante, Next nos otorga un hook que nos permite acceder a ellos más facilmente `useSearchParams` de `next/navigation`. Vamos a usar este hook para 2 cosas, en primer lugar obtener los query params que ya están en la URL para que el valor por defecto del input refleje el parametro `query` y en segundo lugar para que a la hora de actualizarlos persistan los anteriores

```tsx
// path ./app/ui/search.tsx
// ...
import { useSearchParams } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams() // <-- obtenemos los query params

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams) // <-- creamos los nuevos parametros

    if (term) {
      params.set('query', term) // <-- si el input no está vacío cambiamos el valor del parametro `query`
    } else {
      params.delete('query') // <-- si el input está vacío eliminamos el parametro `query`
    }
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e) => { handleSearch(e.target.value) }}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

```

Para sincronizar la URL con el input lo que vamos a hacer es apoyarnos de otros dos hooks de `next/navigation`, `usePathname` e `useRouter`. El primero nos permite acceder a la ruta actual mientras que el segundo nos da una serie de funciones que ayudan a navegar, en nuestro caso usaremos unicamente `replace`

```tsx
// path ./app/ui/search.tsx
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname() // pathname = ruta actual
  const { replace } = useRouter()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`) // remplazamos la URL del navegador
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e) => { handleSearch(e.target.value) }}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
```

Ahora nos toca recuperar los query params desde el servidor, para ello primero recordemos cómo es nuestra página de Invoices

```tsx
// path ./app/dashboard/invoices/page.tsx
import Search from '@/app/ui/search';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';

import Pagination from '@/app/ui/invoices/pagination';
import Table from '@/app/ui/invoices/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
        {/* <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} /> */}
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

Para nuestra fortuna Next nos inyecta en las Props de nuestras paginas una prop del tipo

```ts
searchParams: Promise<{
  // Cada query param
}>
```

Gracias a esto para usar los query params es tan simple como hacer lo siguiente

```tsx
// path ./app/dashboard/invoices/page.tsx
// ...

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: `${number}`
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1 // Veremos paginación en un momento
  console.log(query, currentPage)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

### Agregando Debounce

Para agregar un debounce a la busqueda nos apoyaremos de la dependencia `use-debounce`

```tsx
// path ./app/ui/search.tsx
// ...
import { useDebouncedCallback } from 'use-debounce'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 500)

  // ...
}

```

## Paginación

A la hora de obtener información de una BBDD es muy común que necesitemos paginarla para, en primer lugar, no mostrar demasiada información; y en segundo lugar para no sobrecargar la BBDD ni el servidor por tener que procesar demasiados datos.

Lo primero que haremos, aporvechando que venimos trabajando con él, es editar el componente `./app/ui/search.tsx` para que al realizar una búsqueda nos lleve a la primera página

```tsx
// path ./app/ui/search.tsx
// ...

export default function Search({ placeholder }: { placeholder: string }) {
  // ...

const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    params.set('page', '1')

    replace(`${pathname}?${params.toString()}`)
  }, 500)

  // ...
}
```

Ahora nos dirigiremos al componente `./app/ui/invoices/pagination.tsx` y vamos a analizarlo un poco, en primer lugar veremos que salen varios errores, todos ellos porque no están definadas ciertas cosas, `currentPage` (type `number`), `createPageURL` (type `() => string`) y `allPages` (type `(number | string)[]`).

Obtener la página actual es muy simple, la buscamos en los parametros de búsqueda

```ts
const searchParams = useSearchParams()
const currentPage = Number(searchParams.get('page'))
```

En el caso de la función `createPageURL` es muy similar a lo que hicimos en `./app/ui/search.tsx` para actualizar la URL

```tsx
const createPageURL = (page: string | number) => {
  const params = new URLSearchParams(searchParams)
  params.set('page', String(page))

  return `${pathname}?${params.toString()}`
}
```

Por último, para obtener todas las páginas, que representa qué debe mostarse en cada item de la páginación (un número de página o puntos suspensivos), nos apoyaremos de una función encargada de generarla.

```ts
import { generatePagination } from '@/app/lib/utils';
const allPages = generatePagination(currentPage, totalPages)
```

De esta manera el código de `./app/ui/invoices/pagination.tsx` quedaría de la siguiente manera

```tsx
'use client';

// ...
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page'))

  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (page: string | number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))

    return `${pathname}?${params.toString()}`
  }

  // omito el return para simplificar el README
  //...
}

// Omito otras funciones que ya vienen definidas
// ...
```

# Server Actions

Los Server Actions son una manera de ejecutar código asíncrono directamente en el servidor, lo que evita tener que crear una API para mutar datos en el servidor.

Esto permite en muchos casos ahorrar lógica y validaciones en el cliente lo que ayuda a la simplicidad.

```tsx
export default function Page () {
  // "create" es un action
  const create = async (formData: FormData) => {
    // indicamos que la función es de servidor, por lo que no se envían al cliente y se ejecutan en servidor
    'use server'

    // lógica para mutar datos
    sql`INSERT INTO ...`
    fetch('/api/users', {
      method: 'POST',
      body: formData
    })
  }

  // El formulario va a llamar a la Server Action
  return <form action={create}>...</form>
}
```

En nuestro caso vamos a usar Server Actions para crear, modificar y eliminar facturas (invoices), empecemos creando nuestra página para crear facturas (`./app/dashboard/invoices/create`).

```tsx
// path: ./app/dashboard/invoices/create/page.tsx
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers(); // <-- a la hora de crear una factura tenemos que asignarle un cliente

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
```

A continuación nos dirigimos al formulario para crear facturas e importamos nuestra action desde `@/app/lib/actions`, crearemos ese archivo y nuestra server action en un momento, y se la asignamos al formulario.

```tsx
// path: ./app/ui/invoices/create-form.tsx
// ...
import { createInvoice } from '@/app/lib/actions';

export default function Form({ customers }: { customers: CustomerField[] }) {
  return (
    <form action={createInvoice}>
      {/* ... */}
    </form>
  );
}
```

Ahora sí, vamos allá con nuestra Server Action `createInvoice`

```tsx
// path: ./app/lib/actions.ts
'use server' // <-- Las funciones de este archivo se ejecutan en el servidor

import { z } from 'zod' // usamos zod para validar datos

// Esquema de un invoice en la BBDD
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // Se almacena en centavos
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

// Esquema de la información que recibimos
const CreateInvoiceFormSchema = InvoiceSchema.omit({
  id: true,
  date: true
})

export async function createInvoice(formData: FormData) {
  // Obtenemos los datos del formulario
  const { customerId, amount, status } = CreateInvoiceFormSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })
}
```

A continuación debemos crear la fecha de la factura nosotros en base a la actual en el formato `YYYY-MM-DD`, pasar el monto a centavos y guardar la información en la BBDD

```tsx
// path: ./app/lib/actions.ts
// ...
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })
// ...

export async function createInvoice(formData: FormData) {
  // Obtenemos los datos del formulario
  const { customerId, amount, status } = CreateInvoiceFormSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  const amountInCents = amount * 100

  const [date] = new Date().toISOString().split('T')

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `
}
```

Por último lo que haremos es redirigir al usuario a la página `/dashboard/invoices` para que pueda ver la factura cargada, no obstante, no basta con simplemente redirigirlo ya que Next por defecto deja en cache la información de la última vez que el usuario estuvo allí, por lo que tenemos que decirle que `revalidar la ruta`.

```tsx
// path: ./app/lib/actions.ts
// ...
import { revalidatePath } from 'next/cache' // función para revalidar un ruta (eliminar el cache y solicitarla de nuevo)
import { redirect } from 'next/navigation' // función para redirigir al usuario

// ...

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoiceFormSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  const amountInCents = amount * 100

  const [date] = new Date().toISOString().split('T')

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `

  revalidatePath('/dashboard/invoices') // <-- revalidamos la ruta
  redirect('/dashboard/invoices') // <-- redireccionamos al usuario
}
```

Con esto ya funciona nuestra creación de facturas.

## Valores Sensibles en Server Actions

Ahora pasemos a eliminar una factura, para ello necesitamos pasar la ID de factura a la Server Action, y como podrás deducir no hemos visto cómo pasar datos adicionales a los del formulario a la Server Action.

Supongo que es evidente que intentar hacerlo de la siguiente manera no funcionrá

```tsx
<form action={updateInvoice(id)}>
```

Para pasar un valor distinto al formulario, sobre todo cuando trabajamos con información sensible podemos ayudarnos de la función `bind` de JS

```tsx
// path: ./app/ui/invoices/buttons.tsx
import { deleteInvoice } from '@/app/lib/actions'; // Esta action hace la llamada a la BBDD con una sentencia `DELETE`

// ...

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id); // agregamos la ID

  return (
    // el componente original no tiene el formulario, debemos agregarlo
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
```

Esta aproximación es útil a la hora de enviar datos sensibles como IDs a las que el usuario no debería tener acceso ya que estas IDs se almacenarán en memoria, lo cual hace que sean más difíciles de acceder.

Una lectura adicional interesante sobre Server Actions es la realacionada a [Seguridad en Server Actions](https://nextjs.org/blog/security-nextjs-server-components-actions) (lectura en inglés como todas las entradas del blog de Vercel).

# Rutas Dinámicas

Al igual que muchos otros frameworks para especificar que una parte de una ruta de Next debe ser dinámica lo que hacemos es poner el nombre de la carpeta entre corchetes (Ej: `[id]/`).

Vamos a usar esto para poder crear la página para editar facturas.

Antes de ir con esta página veamos que en la tabla de facturas tenemos un botón para editarlas que recibe el ID de la factura.

```tsx
// path: ./app/ui/invoices/table.tsx
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  return (
    // ...
    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
      <UpdateInvoice id={invoice.id} />
      <DeleteInvoice id={invoice.id} />
    </td>
    // ...
  );
}
```

Nos dirigimos al componente del botón para modificar la factura y editamos el componente `<Link>` para que redirija hacia la página de modificación correspondiente

```tsx
// path: ./app/ui/invoices/buttons.tsx
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// ...


export function UpdateInvoice({ id }: { id: string }) {
  return (
    // Usamos la id para dirigir a la página de modificación
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// ...
```

El resto de la actualización puede hacerse siguiendo la guía de Vercel, mi objetivo no es hacer una copia de esta sino centrarme en la información en sí.

# Manejando Errores

En nuestros Server Actions que creamos para crear, modificar y eliminar facturas hay varios errores que no estamos manejando, veamoslo con la de creación

```ts
export async function createInvoice(formData: FormData) {
  // `.parse` de Zod lanza un Error si los datos no cumplen el esquema
  const { customerId, amount, status } = CreateInvoiceFormSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  const amountInCents = amount * 100

  const [date] = new Date().toISOString().split('T')

  // Si por algún motivo el INSERT falla se lanza un Error
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
```

Manejar estos errores es bastante fácil, usamos `try/catch` y el método `safeParse` del esquema.

```ts
export async function createInvoice(formData: FormData) {
  const safeData = CreateInvoiceFormSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })

  if (safeData.error) {
    return { error: 'Alguno de los datos no fue ingresado' }
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
    return { error: 'No se pudo cargar la factura, intentelo más tarde' }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}
```

Notese que en caso de que haya un error devolvemos un objeto con una clave `error`, este objeto podemos recuperarlo desde el cliente apoyandonos del hook `useActionState` de React

```tsx
// path: ./app/ui/invoices/create-form.tsx
'use client'
// ...

// useActionState es un hook del cliente
import { useActionState } from 'react';
import { createInvoice } from '@/app/lib/actions';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const [state, formAction, isPending] = useActionState(createInvoice, { error: '' })

  return (
    <form action={formAction}>
      {/* ... */}
      {/* podemos renderizar algo si tenemos un error */}
    </form>
  );
}
```

Pero para poder hacer esto tenemos que modificar nuestra Action para que acepte el estado anterior

```ts
export async function createInvoice(prevState: any, formData: FormData) {
  // ...
}
```

## `error.tsx`

Por último, si se lanza una excepción que no hayamos manejado nuestra aplicación fallará, para controlar estos casos podemos crear un archivo `error.tsx` con un componente que se como página en caso de que ocurra una excepción no manejada.

```tsx
// path: ./app/dashboard
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Ocurrió un error</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
```

Este componente en `error.tsx` acepta dos props

- `error`: un objeto `Error` de JavaScript
- `reset`: una función que intenta re-renderizar la ruta

## 404 Not Found

Ahora supongamos que intentamos modificarl manualmente la URL para acceder a la edición de una factura que no existe (Ej: [http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit](http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit)), si queremos mostrar una página en especial para estos casos debemos hacer lo siguiente.

En primer lugar crear un archivo `not-found.tsx` que renderice la página en cuestión

```tsx
// path: ./app/dashboard/invoices/[id]/edit/not-found.tsx
import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>No se encontró la factura.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Volver
      </Link>
    </main>
  );
}
```

Ahora debemos usar la función `notFound` de `next/navigation` para redirigir a esa página en caso de que no se encuetre la factura

```tsx
// path: ./app/dashboard/invoices/[id]/edit/page.tsx
// ...
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const id = params.id
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound()
  }

  // ...
}
```

Con esto en caso de que no encontremos la factura en cuestión Next renderizará el componente en `not-found.tsx` como página

# Autentificación

> [!WARNING]
> IN PROGRESS...
