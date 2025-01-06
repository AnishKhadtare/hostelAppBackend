import { Bookmark } from "../models/bookmark.model.js";
import { Hostel } from "../models/hostel.model.js";

const createBookmark = async (req, res) => {
    try {
        const hostelId = req.params.id;
        const userId = req.user._id; 

        const hostel = await Hostel.findById(req.params.id);

        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found." });
        }

        const existingBookmark = await Bookmark.findOne({ user: userId, hostel: hostelId });

        
        if (existingBookmark) {
            return res.status(400).json({ message: "Hostel already bookmarked." });
        }

        const newBookmark = await Bookmark.create({ user: userId, hostel: hostelId });
        return res.status(201).json({ message: "Hostel bookmarked successfully.", bookmark: newBookmark });

    }
    
    catch (error) {
        return res.status(500).json({ message: `Error creating bookmark: ${error.message}` });
    }
};

// Get User Bookmarks
const getUserBookmarks = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is available from authentication middleware

        // Fetch bookmarks for the user
        const bookmarks = await Bookmark.find({ user: userId }).populate('hostel');
        return res.status(200).json({ bookmarks });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching bookmarks: ${error.message}` });
    }
};

export { createBookmark, getUserBookmarks };
