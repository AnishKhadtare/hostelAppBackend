import { Hostel } from "../models/hostel.model.js";
import path from 'path';
import { uploadOnCloudinary } from "../cloudinary.js";
import axios from "axios";

/* changes */ 

const getCoordinates = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: lat, longitude: lon };
    } else {
      throw new Error('No results found for the provided address.');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    throw error;
  }
}


const postHostelRoom = async (req, res) => {
    try {
        const { name, location, address, rent, description, status } = req.body;
        const photos = req.files;

        const coordinates = await getCoordinates(address);
        console.log("coordinates", coordinates);
        
        if (!photos) {
            console.error('No files uploaded');
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedPhotos = [];
        for (let photo of photos) {
            const uploadedPhoto = await uploadOnCloudinary(photo.path);
            if (uploadedPhoto) {
                uploadedPhotos.push(uploadedPhoto.secure_url);
            } else {
                console.error('Photo upload failed:', photo);
            }
        }

        const seller = req.user._id;  // Assuming `req.user` contains the authenticated user information

        const newHostel = new Hostel({
            name,
            location,
            address,
            rent,
            description,
            status,
            photos: uploadedPhotos,
            seller,  // Include the seller field
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        });

        await newHostel.save();

        res.status(201).json({ message: 'Hostel posted successfully', hostel: newHostel });
    } catch (error) {
        console.error('Error posting hostel:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getAllHostelPostedBySeller = async(req, res) => {
    try{
        const hostels = await Hostel.find({seller: req.user._id});
        if(!hostels){
            return res.status(404).json({message: "No hostels found."});
        }
        return res.status(200).json({message: "Hostels fetched successfully.", hostels});
    }
    catch(error){
        return res.status(500).json({message: `Hostel fetching unsuccessfully! ERROR : ${error.message}`});
    }
}

const getSingleHostelPosted = async(req, res) => {
    try {
        const hostel = await Hostel.findOne({_id: req.params.id, seller: req.user._id});
        if(!hostel){
            return res.status(404).json({message: "Hostel not found."});
        }
        return res.status(200).json({message: "Hostel fetched successfully.", hostel});
    }
    catch (error) {
        return res.status(500).json({message: `Hostel fetching unsuccessfully! ERROR : ${error.message}`});
    }
}

const getAllHostels = async(req, res) => {
    try{
        const hostels = await Hostel.find({status : "Available"});
        if(!hostels){
            return res.status(404).json({message: "No hostels available right now."});
        }
        return res.status(200).json({message: "Hostels fetched successfully.", hostels});
    }
    catch(error){
        return res.status(500).json({message: `Hostel fetching unsuccessfully! ERROR : ${error.message}`})
    };
}

const getSingleHostel = async(req, res) => {
    try{
        const hostel = await Hostel.findOne({_id: req.params.id}).populate("seller", "-password -refreshToken -isSeller -isBuyer");
        if(!hostel){
            return res.status(404).json({message: "Hostel not found."});
        }
        return res.status(200).json({message: "Hostel fetched successfully.", hostel});
    }
    catch(error){
        return res.status(500).json({message: `Hostel fetching unsuccessfully! ERROR : ${
            error.message}`
        });
    }
}
/* changes */

const uploadPhotos = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const files = req.files;
    if (!files) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const uploadPromises = files.map(file => uploadOnCloudinary(file.path));
    const uploadResults = await Promise.all(uploadPromises);

    const photoUrls = uploadResults.map(result => result.secure_url);

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found.' });
    }

    hostel.photos = hostel.photos.concat(photoUrls);
    await hostel.save();

    res.status(200).json({ message: 'Photos uploaded successfully.', photos: hostel.photos });
  } catch (error) {
    res.status(500).json({ message: `Error uploading photos: ${error.message}` });
  }
};


export {postHostelRoom, getAllHostelPostedBySeller, getSingleHostelPosted, getAllHostels, getSingleHostel, uploadPhotos};