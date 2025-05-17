const cloudinary=require('../cloudinary')
const multer=require('multer');
const uuidv4 = require('uuid').v4;
const {CloudinaryStorage}=require('multer-storage-cloudinary')

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:async (req,file)=>{
        let folder='youtube-clone';
        let resourceType=file.mimetype.startsWith('image')?'image':'video';
        return{
            folder:folder,
            resource_type:resourceType,
            public_id: `video_${uuidv4()}`,
        }
    },
})
const deleteVideo = async (publicId) => {
    try {
        if (!publicId) {
            return { error: true, message: "Video ID is required" };
        }

        const result = await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

        if (result.result !== "ok") {
            return { error: true, message: "Failed to delete video from Cloudinary" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error deleting video from Cloudinary:", error);
        return { error: true, message: "Internal Server Error" };
    }
};


const upload=multer({storage});


module.exports={upload,deleteVideo}