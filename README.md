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

## Suspense

> [!WARNING]
> IN PROGRESS...
