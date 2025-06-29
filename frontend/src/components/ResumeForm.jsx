import React, { useState } from 'react';
import Input from './input';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Globe,
  Heart,
  Plus,
  Trash2,
  Mail,
} from 'lucide-react';

const ResumeForm = ({ resume, onUpdate }) => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'interests', label: 'Interests', icon: Heart },
  ];

  const updateResumeData = (section, data) => {
    onUpdate({ [section]: data });
  };

  const addToArray = (section, newItem) => {
    const currentArray = safeResume[section] || [];
    updateResumeData(section, [...currentArray, newItem]);
  };

  const removeFromArray = (section, index) => {
    const currentArray = safeResume[section] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    updateResumeData(section, newArray);
  };

  const updateArrayItem = (section, index, newData) => {
    const currentArray = safeResume[section] || [];
    const newArray = [...currentArray];
    newArray[index] = { ...newArray[index], ...newData };
    updateResumeData(section, newArray);
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <User className="w-6 h-6 text-violet-600" />
        Profile Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          value={safeResume.profileInfo?.fullName || ''}
          onChange={(e) =>
            updateResumeData('profileInfo', {
              ...safeResume.profileInfo,
              fullName: e.target.value,
            })
          }
          placeholder="Enter your full name"
        />
        <Input
          label="Job Title/Designation *"
          value={safeResume.profileInfo?.designation || ''}
          onChange={(e) =>
            updateResumeData('profileInfo', {
              ...safeResume.profileInfo,
              designation: e.target.value,
            })
          }
          placeholder="e.g. Software Engineer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[100px]"
          value={safeResume.profileInfo?.summary || ''}
          onChange={(e) =>
            updateResumeData('profileInfo', {
              ...safeResume.profileInfo,
              summary: e.target.value,
            })
          }
          placeholder="Write a brief summary about yourself, your skills, and career objectives..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Mail className="w-6 h-6 text-violet-600" />
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email *"
          type="email"
          value={safeResume.contactInfo?.email || ''}
          onChange={(e) =>
            updateResumeData('contactInfo', {
              ...safeResume.contactInfo,
              email: e.target.value,
            })
          }
          placeholder="your.email@example.com"
        />
        <Input
          label="Phone *"
          type="tel"
          value={safeResume.contactInfo?.phone || ''}
          onChange={(e) =>
            updateResumeData('contactInfo', {
              ...safeResume.contactInfo,
              phone: e.target.value,
            })
          }
          placeholder="+1 (555) 123-4567"
        />
        <Input
          label="Location"
          value={safeResume.contactInfo?.location || ''}
          onChange={(e) =>
            updateResumeData('contactInfo', {
              ...safeResume.contactInfo,
              location: e.target.value,
            })
          }
          placeholder="City, State/Country"
        />
        <Input
          label="LinkedIn"
          value={safeResume.contactInfo?.linkedin || ''}
          onChange={(e) =>
            updateResumeData('contactInfo', {
              ...safeResume.contactInfo,
              linkedin: e.target.value,
            })
          }
          placeholder="linkedin.com/in/yourprofile"
        />
        <Input
          label="GitHub"
          value={safeResume.contactInfo?.github || ''}
          onChange={(e) =>
            updateResumeData('contactInfo', {
              ...safeResume.contactInfo,
              github: e.target.value,
            })
          }
          placeholder="github.com/yourusername"
        />
        <Input
          label="Website"
          value={safeResume.contactInfo?.website || ''}
          onChange={(e) =>
            updateResumeData('contactInfo', {
              ...safeResume.contactInfo,
              website: e.target.value,
            })
          }
          placeholder="www.yourwebsite.com"
        />
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-violet-600" />
          Work Experience
        </h3>
        <button
          onClick={() =>
            addToArray('workExperience', {
              company: '',
              role: '',
              startDate: '',
              endDate: '',
              description: '',
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={16} />
          Add Experience
        </button>
      </div>
      <div className="space-y-4">
        {(safeResume.workExperience || []).map((exp, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Experience {index + 1}
              </h4>
              <button
                onClick={() => removeFromArray('workExperience', index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Company"
                value={exp.company || ''}
                onChange={(e) =>
                  updateArrayItem('workExperience', index, {
                    company: e.target.value,
                  })
                }
                placeholder="Company name"
              />
              <Input
                label="Job Title"
                value={exp.role || ''}
                onChange={(e) =>
                  updateArrayItem('workExperience', index, {
                    role: e.target.value,
                  })
                }
                placeholder="Your job title"
              />
              <Input
                label="Start Date"
                type="date"
                value={exp.startDate || ''}
                onChange={(e) =>
                  updateArrayItem('workExperience', index, {
                    startDate: e.target.value,
                  })
                }
              />
              <Input
                label="End Date"
                type="date"
                value={exp.endDate || ''}
                onChange={(e) =>
                  updateArrayItem('workExperience', index, {
                    endDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[100px]"
                value={exp.description || ''}
                onChange={(e) =>
                  updateArrayItem('workExperience', index, {
                    description: e.target.value,
                  })
                }
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-violet-600" />
          Education
        </h3>
        <button
          onClick={() =>
            addToArray('education', {
              institution: '',
              degree: '',
              fieldOfStudy: '',
              startDate: '',
              endDate: '',
              gpa: '',
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={16} />
          Add Education
        </button>
      </div>
      <div className="space-y-4">
        {(resume.education || []).map((edu, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Education {index + 1}
              </h4>
              <button
                onClick={() => removeFromArray('education', index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Institution"
                value={edu.institution || ''}
                onChange={(e) =>
                  updateArrayItem('education', index, {
                    institution: e.target.value,
                  })
                }
                placeholder="University/School name"
              />
              <Input
                label="Degree"
                value={edu.degree || ''}
                onChange={(e) =>
                  updateArrayItem('education', index, {
                    degree: e.target.value,
                  })
                }
                placeholder="Bachelor's, Master's, etc."
              />
              <Input
                label="Field of Study"
                value={edu.fieldOfStudy || ''}
                onChange={(e) =>
                  updateArrayItem('education', index, {
                    fieldOfStudy: e.target.value,
                  })
                }
                placeholder="Computer Science, Engineering, etc."
              />
              <Input
                label="GPA (Optional)"
                value={edu.gpa || ''}
                onChange={(e) =>
                  updateArrayItem('education', index, { gpa: e.target.value })
                }
                placeholder="3.8/4.0"
              />
              <Input
                label="Start Date"
                type="date"
                value={edu.startDate || ''}
                onChange={(e) =>
                  updateArrayItem('education', index, {
                    startDate: e.target.value,
                  })
                }
              />
              <Input
                label="End Date"
                type="date"
                value={edu.endDate || ''}
                onChange={(e) =>
                  updateArrayItem('education', index, {
                    endDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Code className="w-6 h-6 text-violet-600" />
          Skills
        </h3>
        <button
          onClick={() =>
            addToArray('skills', {
              category: '',
              skillsList: [],
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={16} />
          Add Skill Category
        </button>
      </div>
      <div className="space-y-4">
        {(resume.skills || []).map((skillCategory, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Skill Category {index + 1}
              </h4>
              <button
                onClick={() => removeFromArray('skills', index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="Category"
                value={skillCategory.category || ''}
                onChange={(e) =>
                  updateArrayItem('skills', index, { category: e.target.value })
                }
                placeholder="e.g., Programming Languages, Tools, etc."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={
                    Array.isArray(skillCategory.skillsList)
                      ? skillCategory.skillsList.join(', ')
                      : skillCategory.skillsList || ''
                  }
                  onChange={(e) => {
                    const skillsArray = e.target.value
                      .split(',')
                      .map((skill) => skill.trim())
                      .filter((skill) => skill);
                    updateArrayItem('skills', index, {
                      skillsList: skillsArray,
                    });
                  }}
                  placeholder="JavaScript, React, Node.js, Python"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-violet-600" />
          Projects
        </h3>
        <button
          onClick={() =>
            addToArray('projects', {
              name: '',
              description: '',
              technologies: '',
              link: '',
              startDate: '',
              endDate: '',
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={16} />
          Add Project
        </button>
      </div>
      <div className="space-y-4">
        {(resume.projects || []).map((project, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Project {index + 1}
              </h4>
              <button
                onClick={() => removeFromArray('projects', index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Project Name"
                value={project.name || ''}
                onChange={(e) =>
                  updateArrayItem('projects', index, { name: e.target.value })
                }
                placeholder="Project name"
              />
              <Input
                label="Project Link (Optional)"
                value={project.link || ''}
                onChange={(e) =>
                  updateArrayItem('projects', index, { link: e.target.value })
                }
                placeholder="https://github.com/username/project"
              />
              <Input
                label="Start Date"
                type="date"
                value={project.startDate || ''}
                onChange={(e) =>
                  updateArrayItem('projects', index, {
                    startDate: e.target.value,
                  })
                }
              />
              <Input
                label="End Date"
                type="date"
                value={project.endDate || ''}
                onChange={(e) =>
                  updateArrayItem('projects', index, {
                    endDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={project.technologies || ''}
                  onChange={(e) =>
                    updateArrayItem('projects', index, {
                      technologies: e.target.value,
                    })
                  }
                  placeholder="React, Node.js, MongoDB, etc."
                  rows={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent min-h-[100px]"
                  value={project.description || ''}
                  onChange={(e) =>
                    updateArrayItem('projects', index, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the project, your role, and key achievements..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificationsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Award className="w-6 h-6 text-violet-600" />
          Certifications
        </h3>
        <button
          onClick={() =>
            addToArray('certifications', {
              name: '',
              issuer: '',
              issueDate: '',
              expiryDate: '',
              credentialId: '',
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={16} />
          Add Certification
        </button>
      </div>
      <div className="space-y-4">
        {(resume.certifications || []).map((cert, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Certification {index + 1}
              </h4>
              <button
                onClick={() => removeFromArray('certifications', index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Certification Name"
                value={cert.name || ''}
                onChange={(e) =>
                  updateArrayItem('certifications', index, {
                    name: e.target.value,
                  })
                }
                placeholder="AWS Certified Developer"
              />
              <Input
                label="Issuing Organization"
                value={cert.issuer || ''}
                onChange={(e) =>
                  updateArrayItem('certifications', index, {
                    issuer: e.target.value,
                  })
                }
                placeholder="Amazon Web Services"
              />
              <Input
                label="Issue Date"
                type="date"
                value={cert.issueDate || ''}
                onChange={(e) =>
                  updateArrayItem('certifications', index, {
                    issueDate: e.target.value,
                  })
                }
              />
              <Input
                label="Expiry Date (Optional)"
                type="date"
                value={cert.expiryDate || ''}
                onChange={(e) =>
                  updateArrayItem('certifications', index, {
                    expiryDate: e.target.value,
                  })
                }
              />
              <Input
                label="Credential ID (Optional)"
                value={cert.credentialId || ''}
                onChange={(e) =>
                  updateArrayItem('certifications', index, {
                    credentialId: e.target.value,
                  })
                }
                placeholder="Credential ID or Certificate URL"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLanguagesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Globe className="w-6 h-6 text-violet-600" />
          Languages
        </h3>
        <button
          onClick={() =>
            addToArray('languages', {
              language: '',
              proficiency: '',
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <Plus size={16} />
          Add Language
        </button>
      </div>
      <div className="space-y-4">
        {(resume.languages || []).map((lang, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Language {index + 1}
              </h4>
              <button
                onClick={() => removeFromArray('languages', index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Language"
                value={lang.language || ''}
                onChange={(e) =>
                  updateArrayItem('languages', index, {
                    language: e.target.value,
                  })
                }
                placeholder="English, Spanish, etc."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiency Level
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={lang.proficiency || ''}
                  onChange={(e) =>
                    updateArrayItem('languages', index, {
                      proficiency: e.target.value,
                    })
                  }>
                  <option value="">Select proficiency</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterestsSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Heart className="w-6 h-6 text-violet-600" />
        Interests & Hobbies
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests (comma-separated)
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          value={
            Array.isArray(safeResume.interests)
              ? safeResume.interests.join(', ')
              : safeResume.interests || ''
          }
          onChange={(e) => {
            const interestsArray = e.target.value
              .split(',')
              .map((interest) => interest.trim())
              .filter((interest) => interest);
            updateResumeData('interests', interestsArray);
          }}
          placeholder="Photography, Hiking, Reading, Cooking, Open Source Contributions"
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-2">
          Add your hobbies and interests that showcase your personality and
          skills
        </p>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'contact':
        return renderContactSection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
      case 'certifications':
        return renderCertificationsSection();
      case 'languages':
        return renderLanguagesSection();
      case 'interests':
        return renderInterestsSection();
      default:
        return renderProfileSection();
    }
  };

  // Initialize empty resume structure if not provided
  const initializeResume = () => {
    if (!resume) return {};

    return {
      profileInfo: resume.profileInfo || {},
      contactInfo: resume.contactInfo || {},
      workExperience: resume.workExperience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      projects: resume.projects || [],
      certifications: resume.certifications || [],
      languages: resume.languages || [],
      interests: resume.interests || [],
      ...resume,
    };
  };

  const safeResume = initializeResume();

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-b from-violet-50 to-white border-r border-violet-100 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Resume Sections
        </h2>
        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all w-full text-left ${
                  activeSection === section.id
                    ? 'bg-violet-100 text-violet-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <Icon className="w-5 h-5" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">{renderActiveSection()}</div>
    </div>
  );
};

export default ResumeForm;
