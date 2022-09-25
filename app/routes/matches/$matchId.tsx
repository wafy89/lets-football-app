import { ActionFunction, redirect, Request } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { getUser, getUserId } from '~/utils/session.server';
import matchStylesUrl from '~/styles/match.css';
export const links = () => [{ rel: 'stylesheet', href: matchStylesUrl }];

export async function loader({ params, request }: any) {
	const userId = (await getUserId(request)) || undefined;

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
	const creator = await db.user.findFirst({
		where: { id: match?.creatorUserId },
	});
	if (!match) throw new Error('match not found');

	return {
		match,
		userId,
		creator,
	};
}

export const action: ActionFunction = async ({ request, params }) => {
	const form = await request.formData();
	const actionType = form.get('_action');

	const { matchId } = params;
	const userId = (await getUserId(request)) || undefined;

	if (!userId) throw redirect('/login');
	if (!matchId) return;

	// handle action
	switch (actionType) {
		case 'join':
			await db.userMatch.create({
				data: {
					userId,
					matchId,
				},
			});
			return null;
		case 'leave':
			await db.userMatch.delete({
				where: {
					matchId_userId: {
						userId,
						matchId,
					},
				},
			});
			return redirect('/matches');
		default:
			throw new Error('somthing went wrong with join/leave action');
	}
};

export default function MatchDetails() {
	const { match, userId, creator } = useLoaderData();
	const usersInMatch = match.userMatch;
	const isUserInMatch = () =>
		usersInMatch.some(
			(user: { userId: string }) => user?.userId && user.userId === userId
		);

	const getAvailablePlaces = () => match.matchSize - match.playerRegistered;

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
				<form method="post">
					{isUserInMatch() ? (
						<button
							className="btn btn-delete"
							name="_action"
							value="leave"
						>
							Leave
						</button>
					) : (
						<button
							className="btn "
							type="submit"
							name="_action"
							value="join"
						>
							Join
						</button>
					)}
				</form>
			</div>
			<ul className="page-content">
				<li>available Places : {getAvailablePlaces()}</li>
				<li>match size : {match.matchSize}</li>
				<li>Players registered : {match.playerRegistered}</li>
				<li>Location : {match.location}</li>
				<li>Date : {new Date(match.date).toLocaleString()}</li>
				<Link to={`/user/${creator.id}`}>
					<li>Creator : {creator.name}</li>
				</Link>
				<li>
					Players joining:
					<ol>
						{match.userMatch.map((player) => (
							<li>{player.user.name}</li>
						))}
					</ol>
				</li>
			</ul>
		</>
	);
}
