import { useLoaderData, Link } from '@remix-run/react';

import { db } from '~/utils/db.server';

type Match = {
	id: number;
	title: string;
	playerRegistered: number;
	matchSize: number;
	location: string;
};

export const loader = async () => {
	const data = {
		matches: await db.match.findMany({
			orderBy: { date: 'desc' },
		}),
	};
	return data;
};

function MatchList() {
	const { matches } = useLoaderData();

	return (
		<>
			<div className="px-4 py-5 sm:px-6 flex justify-between align-middle">
				<h1 className="my-auto"> Matches </h1>
				<div className="flex justify-end gap-2 align-middle">
					<Link
						to="/matches/new"
						className="btn"
					>
						<button
							className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-400 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:bg-green-800 focus:ring-offset-2"
							name="_action"
							value="leave"
						>
							Create Match
						</button>
					</Link>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{matches.map((match: Match) => (
					<div
						key={match.id}
						className="p-6 w-full mx-auto  max-w-sm bg-white rounded-lg border border-gray-200 shadow-md "
					>
						<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
							{match.title}
						</h5>
						<p className="mb-3 font-normal text-gray-700 ">
							{' '}
							Available Places: {match.matchSize - match.playerRegistered}/
							{match.matchSize}
						</p>
						<address className="mb-3 font-normal text-sm text-gray-300 ">
							{match.location}
						</address>
						<Link to={match.id.toString()}>
							<button className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ">
								Match Details
							</button>
						</Link>
					</div>
				))}
			</div>
		</>
	);
}

export default MatchList;
