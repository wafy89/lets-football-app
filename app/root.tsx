import { LoaderFunction } from '@remix-run/node';
import {
	Outlet,
	LiveReload,
	Link,
	Links,
	Meta,
	useLoaderData,
} from '@remix-run/react';
import { getUser } from '~/utils/session.server';

import styles from './styles/app.css';

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}
export const meta = () => {
	const description = 'App helps you to meet football mates';
	const keywords = 'football, meet, play, find people';

	return {
		description,
		keywords,
	};
};
type ParentComponentProps = {
	title?: string;
	children?: any;
};

export const loader: LoaderFunction = async ({ request }) => {
	const user = await getUser(request);

	return {
		user,
	};
};
export default function App() {
	return (
		<Document>
			<Layout>
				<Outlet />
			</Layout>
		</Document>
	);
}

function Document({ children, title = 'Lets Football' }: ParentComponentProps) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1"
				/>
				<Meta />
				<Links />
				<title>{title}</title>
			</head>
			<body>
				{children}
				{process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
			</body>
		</html>
	);
}

function Layout({ children }: ParentComponentProps) {
	const loaderData = useLoaderData();
	const user = loaderData?.user || { name: ' ' };

	return (
		<>
			<div className="mx-auto  px-2 text-red-50 sm:px-6 lg:px-8  bg-gray-800">
				<div className="relative flex h-16 items-center justify-between">
					<Link
						to="/"
						className="logo"
					>
						Lets F⚽⚽tball
					</Link>

					<ul className="relative flex h-16 items-center justify-between  gap-1">
						<li className="p-1">
							<Link to="/matches">matches</Link>
						</li>

						{user ? (
							<li className="p-1">
								<form
									action="/logout"
									method="POST"
								>
									<button
										type="submit"
										className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										Logout {user.name}
									</button>
								</form>
							</li>
						) : (
							<li className="p-1">
								<Link to="/login">Login</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className="container">{children}</div>
		</>
	);
}

export function ErrorBoundary({ error }: any) {
	return (
		<Document>
			<Layout>
				<h1>Error</h1>
				<p>{error.message}</p>
			</Layout>
		</Document>
	);
}
