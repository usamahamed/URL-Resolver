const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { http } = require("@google-cloud/functions-framework");

const app = express();
app.use(cors());

app.get("/resolve", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL is required");
  try {
    const response = await axios.head(url, { maxRedirects: 10 });
    res.json({ resolvedUrl: response.request.res.responseUrl });
  } catch (error) {
    res.status(500).send("Error resolving URL");
  }
});

http("urlResolver", app);
