const express = require('express');
const admin = require('../storage/firebase.js');
const Data = require('../schema/productschema.js');
const router = express.Router();
const multer = require('multer');

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.array('photoUrls', 5), async (req, res) => {
  try {
    // Destructuring necessary fields from request body
    const {
      firstname,
      lastname,
      phone,
      create_date,
      create_time,
      wallet_amount,
      wallet_amount_updatedby,
      status,
      email,
      dob,
      gender,
      currency,
      address,
      customer_type,
    } = req.body;


    // Create a new Data instance with uploaded photo URLs
    const data = new Data({
      name: firstname + ' ' + lastname,
      phone,
      create_date,
      create_time,
      wallet_amount,
      wallet_amount_updatedby,
      status,
      email,
      dob,
      gender,
      currency,
      address,
      customer_type,
    });

    // Save data to MongoDB
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to upload image to Firebase
async function uploadImageToFirebase(file) {
  const bucket = admin.storage().bucket();
  const fileBuffer = file.buffer;

  const fileName = `images/${Date.now()}_${file.originalname}`;
  const fileRef = bucket.file(fileName);

  const options = {
    destination: fileRef,
    metadata: {
      contentType: file.mimetype,
    },
  };

  await fileRef.save(fileBuffer, options);

  // Get the public URL of the uploaded file
  const [url] = await fileRef.getSignedUrl({ action: 'read', expires: '01-01-2030' });

  return url;
}

//filterbyphone
router.get('/readByPhone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ error: 'Phone parameter is required for reading' });
    }

    const data = await Data.find({
      phone: new RegExp(phone, 'i'), // Case-insensitive match for phone number
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//filter by name
router.get('/readByName/:name', async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required for reading' });
    }

    const data = await Data.find({
      name: new RegExp(name, 'i'), // Case-insensitive match for name
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//readbyid
router.get('/read/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Data.findById(id); // Assuming 'Data' is your Mongoose model

    if (!data) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//read all
router.get('/read', async (req, res) => {
  try {
    const allData = await Data.find(); // Retrieve all records from the 'Data' collection

    res.status(200).json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//upload image
router.post('/uploadimages', upload.array('photoUrls', 5), async (req, res) => {
  try {
    // Destructuring necessary fields from request body

    // Check if image files were uploaded
    const photoUrls = req.files;

    if (!photoUrls || photoUrls.length === 0) {
      return res.status(400).json({ error: 'At least one photoUrl is required' });
    }

    // Upload each photo and get the URLs using Firebase function
    const uploadedPhotoUrls = await Promise.all(photoUrls.map(uploadImageToFirebase));

    // Create a new Data instance with uploaded photo URLs
    const data = new Data({
      photoUrls: uploadedPhotoUrls.slice(0, 5), // Storing uploaded photo URLs in MongoDB
    });

    // Save data to MongoDB
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//update
router.put('/update/:id', async (req, res) => {
  try {
    const { firstname,lastname,email,phone,dob,gender,company,address,customer_type } = req.body;
    const dataId = req.params.id;

    const updatedData = await Data.findByIdAndUpdate(
      dataId,
      {
        name: firstname + ' ' + lastname,
        email,
        phone,
        dob,
        gender,
        company,
        address,
        customer_type,
     
      },
      { new: true } // To return the updated document
    );

    if (!updatedData) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Data.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(204).json(); // 204 No Content status for a successful deletion with no response body
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Other routes for read, update, and delete (kept unchanged)

module.exports = router;
