import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  try {
    const dbClient = await clientPromise;
    const db = dbClient.db("tracker");
    const collection = db.collection("clicks");

    if (req.url === "/test") {
      // Just check connection
      const count = await collection.countDocuments();
      res.statusCode = 200;
      res.end(`✅ Connected. Current total clicks: ${count}`);
      return;
    }

    // Otherwise, track click + redirect
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
