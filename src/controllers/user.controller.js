import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
    //get user details from frontend
    //validation-not empty
    //check if user already exists:username,email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response 
    

    const {fullName, email, username, password} = req.body;
    console.log("email: ",email);
    
    if (
        [fullName,email,username,password].some((field) => //a built-in function used to check if at least one element in an array passes a specific condition 
                                                          // implemented by a provided callback function
             !field || field.trim() === "" )
    ) {
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({//await is important here as .findOne() returns a promise
        $or: [{ username },{ email }] // it checks in the users collection , find a document where username equals "yadnesh" or email equals "test@gmail.com"
                                        //if found then it returns that document or else it returns null
    })

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})

export {registerUser}