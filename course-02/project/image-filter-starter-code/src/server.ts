import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { Request, Response } from "express";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage/", async (req: Request, res: Response) => {
    try {
      // image_url query
      const { image_url }: { image_url: string } = req.query;

      //validate image url
      if (!image_url) {
        return res.status(400).send(`image_url is required`);
      }

      //filter image
      const filtered_image = await filterImageFromURL(image_url);

      res.status(200).download(filtered_image, (err) => {
        if (err) {
          console.log(err);
        }
        // delete image from server after download success
        deleteLocalFiles([filtered_image]);
      });
    } catch (err) {
      res
        .status(500)
        .send("ooops something  went wrong!failed to process image_url!");
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
