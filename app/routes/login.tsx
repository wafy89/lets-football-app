import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, Link, useSearchParams } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { login, createUserSession } from '~/utils/session.server';

function validateUsername(username: unknown) {
	if (typeof username !== 'string' || username.length < 3) {
		return `Usernames must be at least 3 characters long`;
	}
}

function validatePassword(password: unknown) {
	if (typeof password !== 'string' || password.length < 4) {
		return `Passwords must be at least 6 characters long`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		username: string | undefined;
		password: string | undefined;
	};
	fields?: {
		username: string;
		password: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const username = form.get('username');
	const password = form.get('password');

	if (typeof username !== 'string' || typeof password !== 'string') {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fields = { username, password };
	const fieldErrors = {
		username: validateUsername(username),
		password: validatePassword(password),
	};

	if (Object.values(fieldErrors).some(Boolean))
		return badRequest({ fieldErrors, fields });

	const user = await login({ username, password });
	if (!user) {
		return badRequest({
			fields,
			formError: `Username/Password combination is incorrect`,
		});
	}
	return createUserSession(user.id);

	// if there's no user, return the fields and a formError
	// if there is a user, create their session and redirectTo
};

export default function Login() {
	const [searchParams] = useSearchParams();
	return (
		<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<Link to="/signup">
							<button className="font-medium text-indigo-600 hover:text-indigo-500">
								register a new User
							</button>
						</Link>
					</p>
				</div>
				<form
					className="mt-8 space-y-6"
					method="POST"
				>
					<input
						type="hidden"
						name="redirectTo"
						value={searchParams.get('redirectTo') ?? undefined}
					/>
					<div className="-space-y-px rounded-md shadow-sm">
						<div>
							<label
								className="sr-only"
								htmlFor="username-input"
							>
								Email address
							</label>
							<input
								id="username-input"
								name="username"
								type="email"
								required
								className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<label
								htmlFor="password-input"
								className="sr-only"
							>
								Password
							</label>
							<input
								id="password-input"
								name="password"
								type="password"
								required
								className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder="Password"
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<svg
									className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
										clip-rule="evenodd"
									/>
								</svg>
							</span>
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
