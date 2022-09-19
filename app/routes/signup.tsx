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
	console.log({ fieldErrors });
	if (Object.values(fieldErrors).some(Boolean))
		return badRequest({ fieldErrors, fields });

	const userExists = await db.user.findFirst({
		where: { username },
	});
	console.log({ userExists });
	if (userExists?.id) {
		return badRequest({
			fields,
			formError: `User with username ${username} already exists`,
		});
	}
	console.log('zamatna');
	const user = await register(fields);
	console.log({ user });
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
		<div className="auth-container">
			<div className="page-header">
				<h1>register</h1>
			</div>

			<div className="page-content">
				<form method="post">
					<input
						type="hidden"
						name="redirectTo"
						value={searchParams.get('redirectTo') ?? undefined}
					/>
					<div className="form-control">
						<label htmlFor="username-input">Username</label>
						<input
							type="text"
							id="username-input"
							name="username"
						/>
					</div>
					<div className="form-control">
						<label htmlFor="password-input">Password</label>
						<input
							id="password-input"
							name="password"
							type="password"
							required
						/>
					</div>
					<div className="form-control">
						<label htmlFor="name-input">Name</label>
						<input
							type="text"
							id="name-input"
							name="name"
							required
						/>
					</div>{' '}
					<div className="form-control">
						<label htmlFor="posistion-input">Position</label>
						<select
							id="posistion-input"
							name="position"
							required
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
						className="btn btn-block"
						type="submit"
					>
						Create a User
					</button>
				</form>
			</div>
		</div>
	);
}
