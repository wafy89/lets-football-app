import { useLoaderData, Link } from '@remix-run/react';

import { db } from '~/utils/db.server';

type Match = {
	id: number;
	title: string;
	playersRegistered: number;
	matchSize: number;
	location: string;
};

export const loader = async () => {
	const data = {
		matches: await db.match.findMany({
			take: 10,
			orderBy: { date: 'desc' },
		}),
	};
	return data;
};

function MatchList() {
	const { matches } = useLoaderData();

	return (
		<>
			<div className="page-header">
				<h1>Matches</h1>
				<Link
					to="/matches/new"
					className="btn"
				>
					New Match
				</Link>
			</div>
			<ul className="matches-list">
				{matches.map((match: Match) => (
					<Link to={match.id.toString()}>
						<li key={match.id}>
							<div>{match.title}</div>
							<div>
								Available Places: {match.matchSize - match.playersRegistered}/
								{match.matchSize}
							</div>
							<address className="match-location">{match.location}</address>
						</li>
					</Link>
				))}
			</ul>
		</>
	);
}

export default MatchList;
