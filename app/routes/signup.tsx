import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useSearchParams } from '@remix-run/react';
import { createUserSession, register } from '~/utils/session.server';
import { db } from '~/utils/db.server';

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
export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const username = form.get('username');
	const password = form.get('password');
	const name = form.get('name');
	const position = form.get('position');

	if (
		typeof username !== 'string' ||
		typeof password !== 'string' ||
		typeof name !== 'string' ||
		typeof position !== 'string'
	) {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fields = { username, password, name, position };
	const fieldErrors = {
		username: validateUsername(username),
		password: validatePassword(password),
	};
	if (Object.values(fieldErrors).some(Boolean))
		return badRequest({ fieldErrors, fields });

	const userExists = await db.user.findFirst({
		where: { username },
	});
	if (userExists?.id) {
		return badRequest({
			fields,
			formError: `User with username ${username} already exists`,
		});
	}
	const user = await register(fields);
	if (!user) {
		return badRequest({
			fields,
			formError: `Something went wrong trying to create a new user.`,
		});
	}
	return createUserSession(user.id);
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export default function Register() {
	const [searchParams] = useSearchParams();
	return (
		<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
						Register a New User
					</h2>

					<div className="page-content">
						<form
							method="post"
							className="mt-8 space-y-6"
						>
							<input
								type="hidden"
								name="redirectTo"
								value={searchParams.get('redirectTo') ?? undefined}
							/>
							<div className="-space-y-px rounded-md shadow-sm">
								<div>
									<label htmlFor="username-input">Email address</label>
									<input
										type="text"
										id="username-input"
										name="username"
										className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										placeholder="Email address"
									/>
								</div>
							</div>
							<div>
								<label htmlFor="password-input">Password</label>
								<input
									id="password-input"
									name="password"
									type="password"
									required
									className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
							<div>
								<label htmlFor="name-input">Name</label>
								<input
									type="text"
									id="name-input"
									name="name"
									required
									className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								/>
							</div>{' '}
							<div>
								<label htmlFor="posistion-input">Position</label>
								<select
									id="posistion-input"
									name="position"
									required
									className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								>
									<option
										disabled
										value=""
										selected
									>
										choose a position
									</option>
									<option value="midfieder">Midfieder</option>
									<option value="Striker">Striker</option>
									<option value="diffender">Diffender</option>
									<option value="goalkeeper">Goal-keeper</option>
								</select>
							</div>
							<button
								className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								type="submit"
							>
								Create a User
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
