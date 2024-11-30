# cs361-microservice-image-server

---

**Author**: hokevi@oregonstate.edu  
**Project**: CS 361 - Software Engineering I  
**Assignment**: Microservice D

## Overview
This microservice handles image uploads for items and serves the uploaded images when requested. The service allows images to be associated with an item ID, storing them in a local directory, and serving them based on the item ID. It supports various image formats (e.g., `.jpg`, `.png`, etc.) and dynamically handles the correct file extension.

## Features
- **Upload Image**: Accepts an image and an associated `item_id`, saving the image with the `item_id` as the filename, preserving the original file extension.
- **Fetch Image by Item ID**: When an image is requested via the `item_id`, the microservice serves the corresponding image.
- **Error Handling**: Proper error handling for missing images or failed uploads.

## Technologies Used
- Node.js
- Express
- Multer (for file uploads)
- JavaScript (ES6+)

## Getting Started
1. Clone this repository to your local machine.
2. Ensure that Node.js and npm are installed.
3. Install the dependencies by running: `npm install`.
4. Start the microservice using `node server.js` (default port: `5003`).
5. The server will now be running at `http://127.0.0.1:5003/`.

## Using the Microservice
The microservice allows you to interact with images through HTTP requests.

### Uploading an Image
To upload an image associated with an item, you can make a `POST` request to the `/upload` endpoint. Include the image file under the field `image` and the `item_id` in the request body. This will save the image and return the URL for the uploaded image as the response..

### Retrieving an Image by Item ID
To retrieve the image associated with a specific item_id, make a GET request to the `/image/:item_id` endpoint. The image will be returned if it exists; an error message will be returned otehrwise. Example request `http://127.0.0.1:5003/image/12345` will return the image file as a response.

### Error Handling
If there is an issue, such as a missing image or an invalid upload, the microservice will return an appropriate error response.

For example, if the image is not found for a given item_id:

```json
{
  "error": "Image not found"
}
```

If there was an issue during image upload:
```json
{
  "error": "No image uploaded."
}
```

## Contact Me 
For any issues, please send me a message at hokevi@oregonstate.edu or file a bug here.