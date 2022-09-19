import { Link } from '@remix-run/react';
import { redirect, Request } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { requireUserId } from '~/utils/session.server';

export const action = async ({ request }: { request: Request }) => {
	const userId = await requireUserId(request);
	const formData = await request.formData();
	const formDate = formData.get('date');
	const match = {
		userId,
		title: formData.get('title'),
		playersRegistered: 1,
		matchSize: Number(formData.get('matchSize')),
		location: formData.get('location'),
		date: typeof formDate === 'string' ? new Date(formDate) : undefined,
	};

	//  sbmiut to db
	const newMatch = await db.match.create({ data: match });

	return redirect(`/matches/${newMatch.id}`);
};
function NewMatch() {
	return (
		<>
			<div className="page-header">
				<h1>New Match</h1>
				<Link
					to="/matches"
					className="btn btn-reverce"
				>
					Back
				</Link>
			</div>
			<div className="page-content">
				<form method="POST">
					<div className="form-control">
						<label htmlFor="title"> Title </label>
						<input
							required
							type="text"
							name="title"
							id="title"
						/>
					</div>
					<div className="form-control">
						<label htmlFor="date"> Date </label>
						<input
							required
							type="datetime-local"
							name="date"
							id="date"
						/>
					</div>
					<div className="form-control">
						<label htmlFor="matchSize">Choose a Match Size:</label>

						<select
							required
							name="matchSize"
							id="matchSize"
							itemType="number"
						>
							<option value="10">10</option>
							<option value="22">22</option>
						</select>
					</div>
					<div className="form-control">
						<label htmlFor="location">Where will the Match be played</label>
						<textarea
							required
							name="location"
							id="location"
							placeholder="street 11, &#10;04103 Leipzig"
						/>
					</div>
					<button
						type="submit"
						className="btn btn-block"
					>
						Create a Match
					</button>
				</form>
			</div>
		</>
	);
}

export default NewMatch;
