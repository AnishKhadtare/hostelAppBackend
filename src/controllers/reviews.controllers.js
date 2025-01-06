import {Review} from "../models/review.model.js";

const postReviews = async (req, res) => {
    try {
        console.log("zero");
        const { id } = req.params;
        console.log("first", id);
        const { rating, review } = req.body; // Change 'comment' to 'review'
        console.log("sec", req.body);

        // Additional logging for rating and review
        console.log("Received rating:", rating);
        console.log("Received review:", review);

        if ([rating, review].some((data) => data.trim() === "")) { // Change 'comment' to 'review'
            return res.status(400).json({ message: "Please fill all the fields." });
        }
        console.log(`thrd ${rating} ${review}`); // Change 'comment' to 'review'

        // Additional logging for req.user
        console.log("User ID:", req.user?._id);

        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: "User not authenticated." });
        }

        const reviewData = await Review.create({ user: req.user._id, hostel: id, rating, comment: review }); // Change 'comment' to 'review'
        console.log("frth", reviewData);

        res.status(201).json({ message: "Review created successfully.", review: reviewData });
    } catch (err) {
        console.error("Error in postReviews:", err); // Improved error logging
        res.status(500).json({ message: "Internal server error." });
    }
};


const getAllReviewsForHostel = async(req, res) => {
    try{
        const {id} = req.params;
        const reviews = await Review.find({hostel: id}).populate("user", "-password -refreshToken -isSeller -isBuyer");
        if(!reviews){
            return res.status(404).json({message: "No reviews found."})
        }
        res.status(200).json({message: "Reviews found successfully.", reviews})
    }
    catch(error){
        res.status(500).json({message: `Reviews fetching unsuccessfull. ERROR : ${error.message}`});
    }
}

const getAverageRating = async(req, res) => {
    try {
        const {id} = req.params;
        const reviews = await Review.find({hostel: id});
        if (!reviews) {
            return res.status(404).json({ message: "No reviews found." })
        }
        const ratings = reviews.map((review) => review.rating);
        const sumRating = ratings.reduce((a, b) => a + b, 0);
        res.status(200).json({ message: "Average rating found successfully.", averageRating: sumRating / ratings.length });
    }
    catch (error) {
        res.status(500).json({ message: `Average rating fetching unsuccessfull. ERROR :${error.message}`});
    }        
}

export {postReviews, getAllReviewsForHostel, getAverageRating};