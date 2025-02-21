import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import multer from 'multer'

//Middleware to upload files
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 3 },
  fileFilter: (req, file, callback) => {
    const acceptedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]
    if (!acceptedMimeTypes.includes(file.mimetype)) {
      callback(
        new BadRequestError(
          'Invalid file type, only .jpeg, .jpg, .png and .webp are accepted',
        ),
      )
    }
    callback(null, true)
  },
})
