
import { useParams } from "@remix-run/react"
function MatchDetails() {
    const {matchId} = useParams()
    return (
        <>
         <div className="page-header"> <h1> Match Details :</h1> </div>
        </>
       
    )
}

export default MatchDetails