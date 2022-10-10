import { ActionFunction, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { User } from '@prisma/client';
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
	const match = await db.match.findFirst({
		where: {
			id: matchId,
		},
		include: {
			userMatch: {
				include: {
					user: true,
				},
			},
		},
	});
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
		case 'delete':
			await db.userMatch.deleteMany({
				where: {
					matchId,
				},
			});
			await db.match.delete({
				where: {
					id: matchId,
				},
			});

			return redirect('/matches');
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
	const isMatchCreator = () => userId === match.creatorUserId;

	const getAvailablePlaces = () => match.matchSize - match.userMatch.length;

	return (
		<>
			<div className="overflow-hidden bg-white shadow sm:rounded-t-lg mt-4">
				<div className="px-4 py-5 sm:px-6 flex justify-between align-middle">
					<h1 className="my-auto"> Match Details : {match.title}</h1>
					<div className="flex justify-end gap-2 align-middle">
						<Link
							to="/matches"
							className="flex-col justify-center"
						>
							<button
								className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:bg-gray-500 focus:ring-offset-2"
								name="_action"
								value="leave"
							>
								back
							</button>
						</Link>
						<form method="post">
							{isMatchCreator() ? (
								<button
									className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:bg-red-500 focus:ring-offset-2"
									name="_action"
									value="delete"
								>
									Delete
								</button>
							) : isUserInMatch() ? (
								<button
									className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:bg-red-500 focus:ring-offset-2"
									name="_action"
									value="leave"
								>
									Leave
								</button>
							) : (
								<button
									className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-400 py-2 px-4 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:bg-green-800 focus:ring-offset-2"
									type="submit"
									name="_action"
									value="join"
								>
									Join
								</button>
							)}
						</form>
					</div>
				</div>
			</div>
			<div className="border-t border-gray-200">
				<dl>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">
							available Places :
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{getAvailablePlaces()}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">match size :</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{match.matchSize}
						</dd>
					</div>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">
							Players registered :
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{match.playerRegistered}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Location :</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{match.location}
						</dd>
					</div>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Date :</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{new Date(match.date).toLocaleString()}
						</dd>
					</div>
					<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">Creator :</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<Link to={`/user/${creator.id}`}>{creator.name}</Link>
						</dd>
					</div>
					<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-500">
							Players joining:
						</dt>
						<br />
						{match.userMatch.map((player: { user: User }) => (
							<dd className="ml-4 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								<Link to={`/user/${player.user.id}`}>
									{player.user.name} - {player.user.position}
								</Link>
							</dd>
						))}
					</div>
				</dl>
			</div>
		</>
	);
}
