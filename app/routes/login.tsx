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
		<div className="auth-container">
			<div className="page-header">
				<h1>Login</h1>
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
						/>
					</div>
					<button
						className="btn btn-block"
						type="submit"
					>
						Submit
					</button>
				</form>
				<Link to="/signup">
					<button className="btn-secondary btn-block">
						register a new User
					</button>
				</Link>
			</div>
		</div>
	);
}
