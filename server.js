const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();  // Initialize Express app

// Path for the local database (JSON file)
const dbFilePath = path.join(__dirname, 'imageDB.json');

// Check if the database file exists; if not, create it
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify({}), 'utf-8');
}

// Set up multer storage engine to save images locally
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save uploaded files to the 'uploads' directory
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);  // Create the uploads directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Ensure 'item_id' is available and use the original file extension
        const fileExtension = path.extname(file.originalname);  // Get the file extension (e.g., .jpg, .png)
        const itemId = req.body.item_id;  // Extract item_id from body (make sure it's available)
        
        if (!itemId) {
            return cb(new Error("Item ID is required"), null);  // Handle the case if item_id is missing
        }

        // Construct the filename using item_id and the file extension
        const fileName = `${itemId}${fileExtension}`;  // Ensure the filename includes the correct extension
        cb(null, fileName);  // Save the file with this filename
    }
});

const upload = multer({ storage: storage });

// Image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    console.log('Uploaded file:', req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const uploadedImageUrl = `http://127.0.0.1:5003/uploads/${req.file.filename}`;
    res.json({ url: uploadedImageUrl });
});

// Serve the uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to retrieve an image by item_id
app.get('/image/:item_id', (req, res) => {
    const { item_id } = req.params;

    // Get the list of files in the 'uploads' directory
    const uploadDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading image directory:', err);
            return res.status(500).json({ error: 'Failed to read image directory' });
        }

        // Find a file that matches the item_id with any extension
        const imageFile = files.find(file => file.startsWith(item_id) && file !== item_id); // Ensure it matches the item_id and has an extension

        if (imageFile) {
            // Build the file path dynamically using the found image
            const imageFilePath = path.join(uploadDir, imageFile);

            // Log the requested file's details in formatted JSON
            console.log("Requested File:", JSON.stringify({
                item_id: item_id,
                file_name: imageFile,
                file_path: imageFilePath
            }, null, 2)); // Pretty-print with 2-space indentation

            res.sendFile(imageFilePath);
        } else {
            console.log(JSON.stringify({
                item_id: item_id,
                error: 'Image not found'
            }, null, 2)); // Pretty-print with 2-space indentation
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

  
const port = 5003;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
