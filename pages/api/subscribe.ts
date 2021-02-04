import {NowRequest, NowResponse} from '@vercel/node'
import {MongoClient, Db} from 'mongodb'
import url from 'url';

let cachedb: Db = null;

async function connectingToDatabase(uri:string){
  if (cachedb){
    return cachedb;
  }

  const client = await  MongoClient.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true
  });
  const dbname = url.parse(uri).pathname.substr(1);

  const db = client.db(dbname);

  cachedb = db;

  return db;
}

export default async (request:NowRequest, response:NowResponse)=>{
  const {email} = request.body;

  const db = await connectingToDatabase(process.env.MONGODB_URI);

  const collection = db.collection('subscribers');

  await collection.insertOne({
    email,
    subscribeAt: new Date(),
  })
  
  return response.status(201).json({ok: true});
}