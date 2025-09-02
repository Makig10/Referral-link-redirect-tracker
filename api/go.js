import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();


let cachedClient = null;

export default async function handler(req, res) {
  try {
    const uri = process.env.REALMONGODB_URI;
  
    if (!uri) throw new Error("MONGODB_URI is not defined!");
    
    // Reuse cached client if available
    if (!cachedClient) {
      const client = new MongoClient(uri);
      cachedClient = await client.connect();
    }

    const db = cachedClient.db("tracker");
    const collection = db.collection("clicks");

    if (req.url === "/test") {
      const count = await collection.countDocuments();
      res.statusCode = 200;
      res.end(`✅ Connected. Current total clicks: ${count}`);
      return;
    }

    const logEntry = {
      timestamp: new Date(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
    };

    await collection.insertOne(logEntry);

    res.writeHead(302, { Location: "https://www.soulhostels.rw/" });
    res.end();
  } catch (err) {
    console.error("Error logging click:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
