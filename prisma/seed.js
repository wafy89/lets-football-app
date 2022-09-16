const {PrismaClient} = require('@prisma/client')

const db = new PrismaClient()

async function seed(){
    await Promise.all(
        getMatches().map(match=>{
            return db.match.create({data: match})
        })
    )
}

function getMatches() {
return [
    
        {
            //id: '1',
            title: 'match 1',
            playersRegistered: 5,
            matchSize: 22,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()
        },
        {
            //id: '2',
            title: 'match 2',
            playersRegistered: 2,
            matchSize: 10,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()

        },
        {
            //id: '3',
            title: 'match 3',
            playersRegistered: 4,
            matchSize: 10,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()

        },
        {
            //id: '4',
            title: 'match 4',
            playersRegistered: 6,
            matchSize: 22,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()

        },
    ]
}


seed()