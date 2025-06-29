import Resume from '../models/resumeModel.js';
import fs from 'fs';
import path from 'path';

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    //default template...
    const defaultResumeData = {
      profileInfo: {
        profileImg: '',
        profilePreviewUrl: '',
        fullName: '',
        designation: '',
        summary: '',
      },
      contactInfo: {
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
      },
      workExperience: [
        {
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
      education: [
        {
          degree: '',
          institution: '',
          startDate: '',
          endDate: '',
        },
      ],
      skills: [
        {
          name: '',
          progress: 0,
        },
      ],
      projects: [
        {
          title: '',
          description: '',
          github: '',
          liveDemo: '',
        },
      ],
      certifications: [
        {
          title: '',
          issuer: '',
          year: '',
        },
      ],
      languages: [
        {
          name: '',
          progress: 0,
        },
      ],
      interests: [''],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });

    res.status(201).json({
      newResume,
    });
  } catch (error) {
    res.status(500).json({
      message: 'failed to create resume',
      error: error.message,
    });
  }
};

//get userresume..
export const getUserResume = async (req, res) => {
  try {
    const resume = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(resume);
  } catch (error) {
    res.status(500).json({
      message: 'failed to get resume',
      error: error.message,
    });
  }
};

//getresumebyid...
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({
      message: 'failed to get resume',
      error: error.message,
    });
  }
};

//updateresume..
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }

    //merge updated resume....
    Object.assign(resume, req.body);
    //saving updated resume...
    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    res.status(404).json({
      message: 'Resume not Updated',
    });
  }
};

//deteuserresume...
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }
    //create a uploadfolder and store the resume there...
    const uploadFolder = path.join(process.cwd(), 'uploads');
    //delete thumbnail...
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadFolder,
        path.basename(resume.thumbnailLink)
      );
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }
    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(
        uploadFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({
        message: 'Resume not found',
      });
    }
    res.json({ message: 'resume deleted successfully' });
  } catch (error) {
    res.status(404).json({
      message: 'Failed to delete resume',
      error: error.message,
    });
  }
};
