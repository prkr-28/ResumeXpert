import fs from 'fs';
import path from 'path';

import Resume from '../models/resumeModel.js';
import upload from '../middleware/uploadMiddleware.js';
import { resolveSoa } from 'dns';

export const uploaResumeImage = async (req, res) => {
  try {
    //configuring multer to handle images...
    upload.fields([{ name: thumbnail }, { name: profileImage }])(
      req,
      res,
      async (err) => {
        if (err) {
          return res.status(404).json({
            message: 'file upload failed',
            error: err.message,
          });
        }
        const resumeId = req.params.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });
        if (!resume) {
          return res.status(404).json({
            message: 'Resume not found or unauthorized',
          });
        }
        //use process cwd to locate uploads folder
        const uploadsFolder = path.join(process.cwd(), 'uploads');
        const baseUrl = `${req.protocol}//${req.get('host')}`;

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImage?.[0];
        if (newThumbnail) {
          if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadsFolder,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) {
              fs.unlinkSync(oldThumbnail);
            }
            resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
          }
        }

        //same for profiepreview..
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadsFolder,
              path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
              fs.unlinkSync(oldProfile);
            }
            resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
          }
          await resume.save();
          res.status(200).json({
            message: 'image upload successfully',
            thumbnailLink: resume.thumbnailLink,
            profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
          });
        }
      }
    );
  } catch (error) {
    console.error('error in uploading image', error);
    res.json(500).json({
      message: 'failed to upload images',
      error: error.message,
    });
  }
};
