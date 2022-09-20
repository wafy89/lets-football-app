const {PrismaClient} = require('@prisma/client')

const db = new PrismaClient()

async function seed(){

    //clear database
    await db.match.deleteMany()
    await db.user.deleteMany()
    await db.userMatch.deleteMany()


    // create user data
    const admin = await db.user.create({
        data: {
            username: "admin@fea.de",
            // this is a hashed version of "admin"
            passwordHash:"$2a$10$i9N65NaDXOM3Q9C8MwfI7u89czPGCeuSk.WQQWspCJMIzefNDcKH6",
            name: 'admin',
            position: "cm"
        },
      });

    
    //create matches data 
    const matches =getMatches().map(async match=> await db.match.create({data:{...match, creatorUserId: admin.id}}) ) 
    

    // create relationData
    matches.map(async match=>{
        await db.userMatch.create({
            data:{
                matchId:(await match).id,
                userId:admin.id
            }
        })
    })
}

function getMatches() {
return [
    
        {
            //id: '1',
            title: 'match 1',
            playerRegistered: 1,
            matchSize: 22,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()
        },
        {
            //id: '2',
            title: 'match 2',
            matchSize: 10,
            playerRegistered: 1,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()

        },
        {
            //id: '3',
            title: 'match 3',
            matchSize: 10,
            playerRegistered: 1,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()

        },
        {
            //id: '4',
            title: 'match 4',
            matchSize: 22,
            playerRegistered: 1,
            location: 'linkelStr.11 04159 Leipzig',
            date : new Date()

        },
    ]
}


seed()