const {PrismaClient} = require('@prisma/client')

const db = new PrismaClient()

async function seed(){
    const admin = await db.user.create({
        data: {
            username: "admin@fea.de",
            // this is a hashed version of "admin"
            passwordHash:"$2a$10$i9N65NaDXOM3Q9C8MwfI7u89czPGCeuSk.WQQWspCJMIzefNDcKH6",
            name: 'admin',
            position: "cm"
        },
      });
    await Promise.all(
        getMatches().map(match=>{
            return db.match.create({data:{ userId:admin.id,...match}})
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