import { v2 as cloudnary } from "cloudinary"
import fs from "fs"


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudnary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been upload succesfull
        console.log("file has been successfull upload on cloudinary", response.url);
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed

        return null
    }
}

export { uploadCloudinary }
