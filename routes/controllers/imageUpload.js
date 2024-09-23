const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const path = require('path');
// const uuid = require('uuid').v4;

// exports.imageUpload = (request, response) => {
//   if (!request.files || Object.keys(request.files).length === 0) {
//     return response.status(400).send({ message: 'No files were uploaded.' });
//   }
//   let imageFile = request.files.image;
//   let uniqueFilename = `image_${uuid()}${path.extname(imageFile.name)}`;
//   imageFile.mv(`images/${uniqueFilename}`, function(err) {
//     if (err) {
//       return response.status(500).send({ message: 'File move failed', err });
//     }

//     // upload image here
//     cloudinary.uploader.upload('images/${uniqueFilename}')
//     .then((result) => {
//       response.status(200).send({
//         message: "success",
//         result,
//       });
//     }).catch((error) => {
//       response.status(500).send({
//         message: "failure",
//         error,
//       });
//     });
//   });
// };

exports.imageUpload = async (request, response) => {
  try {
    const { image: imageUrl } = request.body;

    // Check if an image URL is provided
    if (imageUrl) {
      // Upload the image from the URL
      const result = await cloudinary.uploader.upload(imageUrl);

      return response.status(200).send({ message: 'success', result });
    }

    if (!request.files || Object.keys(request.files).length === 0) {
      return response.status(400).send({ message: 'No files were uploaded.' });
    }

    let imageFile = request.files.image;
    // Ignore imageFile.data: When useTempFiles is set to true, the file is not stored in memory, so data will be empty.
    // if (!imageFile.data || imageFile.data.length === 0) {
    //   return response.status(400).send({ message: 'failure', error: 'Empty file data' });
    // }

    // const result = await new Promise((resolve, reject) => {
    //   const stream = cloudinary.uploader.upload_stream((error, result) => {
    //     if (error) reject(error);
    //     else resolve(result);
    //   });
    //   stream.end(imageFile.data);
    // });
    // Upload the file to Cloudinary using the temp file path
    const result = await cloudinary.uploader.upload(imageFile.tempFilePath);

    response.status(200).send({ message: 'success', result });
  } catch (error) {
    response.status(500).send({ message: 'failure', error: error.message });
  }
};