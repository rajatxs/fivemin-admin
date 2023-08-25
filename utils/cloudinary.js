import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
   secure: true,
});

/**
 * Upload given file with specified `publicId`
 * @param {Buffer} buff
 * @param {"image" | "video" | "raw" | "auto" | undefined} type
 * @param {string} publicId
 * @return {Promise<import('cloudinary').UploadApiResponse|undefined>}
 */
export function uploadFile(buff, type, publicId) {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
         {
            resource_type: type,
            public_id: publicId,
         },
         (error, result) => {
            if (error) {
               reject(error);
            } else {
               resolve(result);
            }
         }
      ).end(buff);
   });
}
