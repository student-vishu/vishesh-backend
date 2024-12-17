import { asyncHandler } from "../utils/asyncHandler.js";
import { ApieError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinaryFileupload.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user detail from frontend
    // validation - not empty
    // check if user alrady exists: username, email
    // check for image , check for avatar
    // upload then to cloudinary, avatar 
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res 

    // get user detail from frontend
    const { fullName, email, username, password } = req.body
    console.log("Email: ", email);

    // validation - not empty
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApieError(400, "all fields are required")
    }

    // check if user alrady exists: username, email
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApieError(409, "user with email or username already exist")
    }

    // check for image , check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApieError(400, "avatar file is required")
    }

    // upload then to cloudinary, avatar 
    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApieError(400, "avatar file is required")
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshtoken")

    // check for user creation
    if (!createdUser) {
        throw new ApieError(500, "something went wrong whilr registring the user")
    }

    //res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registerd successfully")
    )

})

export { registerUser }