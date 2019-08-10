// import {default as models} from '../generated/models/index'
// import { modelsConfig } from "./models.config";
// import { startGraphQL } from '../lib/servers/graphql.server';
// import { createConnection } from 'typeorm';
// import { Model } from '../lib/types';
// import path from 'path'




// const run = async ()=>{
//     const connection = await createConnection({
//         type: 'sqlite',
//         database: 'database.db',
//         synchronize: true,
//         logging: false,
//         entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
//     })
    
//     Object.keys(models).forEach(key=>{
//         const model:Model = models[key]
//         model.setConnection(connection)
//     })
    
    
//     startGraphQL(modelsConfig, models);
// }

// run()