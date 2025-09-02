import { MongoClient } from "mongodb";

let cachedClient = null;

export default async function handler(req, res) {
  try {
    const uri = process.env.REALMONGODB_URI; // must be set in Vercel Dashboard

    if (!uri) throw new Error("MONGODB_URI is not defined!");

    // Reuse client
    if (!cachedClient) {
      const client = new MongoClient(uri);
      cachedClient = await client.connect();
    }

    const db = cachedClient.db("tracker");
    const collection = db.collection("clicks");

    // Optional test endpoint
    if (req.url === "/test") {
      const count = await collection.countDocuments();
      res.status(200).send(`✅ Connected. Total clicks: ${count}`);
      return;
    }

    // Log the click
    await collection.insertOne({
      timestamp: new Date(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
    });

    // Redirect immediately
    res.writeHead(302, { Location: "https://www.soulhostels.rw/" });
    res.end();

  } catch (err) {
    console.error("Error logging click:", err);
    res.status(500).send("Internal Server Error");
  }
}
