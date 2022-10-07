import { Link } from '@remix-run/react';
import { redirect, Request } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { requireUserId } from '~/utils/session.server';

type Match = {
	creatorUserId: string;
	title: string;
	playerRegistered: number;
	matchSize: number;
	location: string;
	date: Date;
};

export const action = async ({ request }: { request: Request }) => {
	const userId = await requireUserId(request);
	if (!userId) return redirect('/login');

	const formData = await request.formData();
	let formDate = formData.get('date');
	if (typeof formDate === 'string' && formDate) {
		formDate = new Date(formDate);
	}

	const match: Match = {
		creatorUserId: userId,
		title: formData.get('title') as string,
		playerRegistered: 1,
		matchSize: Number(formData.get('matchSize')),
		location: formData.get('location') as string,
		date: new Date(formDate),
	};
	if (typeof match.title)
		if (!Object.values(match).every(Boolean)) {
			throw new Error('there was a Problem creating a match');
		}
	//  sbmiut to db

	const newMatch = await db.match.create({ data: match });
	await db.userMatch.create({
		data: {
			userId,
			matchId: newMatch.id,
		},
	});

	return redirect(`/matches/${newMatch.id}`);
};
function NewMatch() {
	return (
		<>
			<div className="px-4 py-5 sm:px-6 flex justify-between align-middle">
				<h1 className="my-auto">New Match</h1>
				<div className="flex justify-end gap-2 align-middle">
					<Link
						to="/matches"
						className="btn btn-reverce"
					>
						<button
							className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-gray-500 focus:ring-offset-2"
							name="_action"
							value="leave"
						>
							Back
						</button>
					</Link>
				</div>
			</div>

			<div className="px-4 sm:px-6 max-w-lg mx-auto">
				<form
					method="POST"
					className="mt-8 space-y-6"
				>
					<div className="-space-y-px rounded-md shadow-sm">
						<div>
							<label htmlFor="title"> Title </label>
							<input
								required
								type="text"
								name="title"
								id="title"
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
					<div className="-space-y-px rounded-md shadow-sm">
						<div>
							<label htmlFor="date"> Date </label>
							<input
								required
								type="datetime-local"
								name="date"
								id="date"
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
					<div className="-space-y-px rounded-md shadow-sm">
						<div>
							<label htmlFor="matchSize">Choose a Match Size:</label>
							<select
								required
								name="matchSize"
								id="matchSize"
								itemType="number"
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							>
								<option value="10">10</option>
								<option value="22">22</option>
							</select>
						</div>
					</div>
					<div className="-space-y-px rounded-md shadow-sm">
						<div>
							<label htmlFor="location">Where will the Match be played</label>
							<textarea
								required
								name="location"
								id="location"
								placeholder="street 11, &#10;04103 Leipzig"
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
					<button className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-400 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:bg-green-800 focus:ring-offset-2 ">
						Create a Match
					</button>
				</form>
			</div>
		</>
	);
}

export default NewMatch;
