import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export async function loader({ params }: any) {
	const match = await db.match.findUnique({
		where: { id: params.matchId },
		include: {
			userMatch: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!match) throw new Error('match not found');

	return {
		match,
	};
}

export default function MatchDetails() {
	const { match } = useLoaderData();
	const getAvailablePlaces = () => match.matchSize - match.playersRegistered;

	return (
		<>
			<div className="page-header">
				<h1> Match Details : {match.title}</h1>
				<Link
					to="/matches"
					className="btn btn-reverse"
				>
					Back
				</Link>
			</div>
			<p>available : {getAvailablePlaces()}</p>
			<p>{JSON.stringify(match)}</p>
		</>
	);
}
