import { Outlet, LiveReload, Link, Links, Meta, useLoaderData } from '@remix-run/react'
import globalStylesUrl from '~/styles/global.css'
//import { getUser } from '~/utils/session.server'

export const links = () => [{ rel: 'stylesheet', href: globalStylesUrl }]

export const meta = () => {
  const description = 'App helps you to meet football mates'
  const keywords = 'football, meet, play, find people'

  return {
    description,
    keywords,
  }
}
type ParentComponentProps = {
  title?: string;
  children?: any
}

// export const loader = async ({ request }) => {
//   const user = await getUser(request)
//   const data = {
//     user,
//   }
//   return data
// }

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({ children, title = 'Lets Football' }: ParentComponentProps) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
        <title>{title}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

function Layout({ children }: ParentComponentProps) {
  //const { user } = useLoaderData()

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          Lets F⚽⚽tball
        </Link>

        <ul className='nav'>
          <li>
            <Link to='/matches'>matches</Link>
          </li>
          {/* {user ? (
            <li>
              <form action='/auth/logout' method='POST'>
                <button type='submit' className='btn'>
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to='/auth/login'>Login</Link>
            </li>
          )} */}
        </ul>
      </nav>

      <div className='container'>{children}</div>
    </>
  )
}

export function ErrorBoundary({ error }: any) {
  console.log(error)
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  )
}
