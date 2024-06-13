# URL Resolver Cloud Function

This repository contains a Google Cloud Function that resolves shortened URLs and returns the final destination URL. The function is built using Node.js and the Express framework.

## Features

- Resolve shortened URLs to their final destination.
- Handle CORS for cross-origin requests.
- Deployable to Google Cloud Functions.

## Requirements

- Node.js (v14 or later)
- Google Cloud SDK

## Project Structure

```
url-resolver/
│
├── index.js
├── package.json
└── node_modules/
```

## Setup

1. Clone the repository and navigate to the project directory:

   ```sh
   git clone https://github.com/your-username/url-resolver.git
   cd url-resolver
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

## Local Testing

To test the function locally, ensure `index.js` starts the server when not running in a cloud environment:

```javascript
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
```

To start the server locally:

```sh
npm start
```

## Deployment

1. **Install the Google Cloud SDK**: Follow the instructions [here](https://cloud.google.com/sdk/docs/install) to install the Google Cloud SDK.

2. **Initialize the SDK and authenticate**:

   ```sh
   gcloud init
   gcloud auth login
   ```

3. **Create a new project**:

   ```sh
   gcloud projects create url-resolver-project
   gcloud config set project url-resolver-project
   ```

4. **Enable Cloud Functions and Cloud Build APIs**:

   ```sh
   gcloud services enable cloudfunctions.googleapis.com cloudbuild.googleapis.com
   ```

5. **Deploy the function**:

   Ensure your working directory contains your `index.js` and `package.json` files.

   ```sh
   gcloud functions deploy urlResolver --runtime nodejs14 --trigger-http --allow-unauthenticated --entry-point=urlResolver
   ```

6. **Retrieve the Function URL**:

   After deployment, retrieve the URL:

   ```sh
   gcloud functions describe urlResolver --format="value(httpsTrigger.url)"
   ```

## Usage

To resolve a shortened URL, make a GET request to the deployed function endpoint with the `url` query parameter:

```
https://REGION-PROJECT_ID.cloudfunctions.net/urlResolver/resolve?url=YOUR_SHORT_URL
```

Replace `REGION-PROJECT_ID` with the appropriate values from your Google Cloud Function deployment, and `YOUR_SHORT_URL` with the URL you want to resolve.

### Example Request

Using curl:

```sh
curl "https://REGION-PROJECT_ID.cloudfunctions.net/urlResolver/resolve?url=http://short.url"
```

## Troubleshooting

If you encounter any issues, please refer to the [Google Cloud Functions Troubleshooting Documentation](https://cloud.google.com/functions/docs/troubleshooting).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
