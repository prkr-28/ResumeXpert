import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Download,
} from 'lucide-react';

const ResumePreview = forwardRef(
  ({ resume, template = 'modern', onDownloadPDF }, ref) => {
    const resumeRef = useRef();

    const handleDownloadPDF = async () => {
      if (!resumeRef.current) {
        console.error('Resume ref is not available');
        toast.error('Resume preview not ready. Please try again.');
        return;
      }

      const loadingToast = toast.loading('Generating PDF...');

      try {
        console.log('Starting PDF generation...');

        // Simplified html2canvas configuration
        const canvas = await html2canvas(resumeRef.current, {
          scale: 1,
          useCORS: false,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: true,
          imageTimeout: 5000,
          onclone: (clonedDoc) => {
            // Remove any problematic elements from the cloned document
            const elementsToRemove = clonedDoc.querySelectorAll(
              '.print\\:hidden, #resume-preview-download-btn'
            );
            elementsToRemove.forEach((el) => el.remove());
          },
        });

        console.log('Canvas generated:', {
          width: canvas.width,
          height: canvas.height,
        });

        // Convert to data URL with error handling
        let imgData;
        try {
          imgData = canvas.toDataURL('image/png', 0.8);
          if (!imgData || imgData === 'data:,') {
            throw new Error('Empty canvas data');
          }
        } catch (canvasError) {
          console.error('Canvas to data URL failed:', canvasError);
          throw new Error('Failed to convert canvas to image');
        }

        console.log('Image data generated, length:', imgData.length);

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate scaling to fit page
        const canvasAspectRatio = canvas.height / canvas.width;
        const pdfAspectRatio = pdfHeight / pdfWidth;

        let finalWidth, finalHeight;

        if (canvasAspectRatio > pdfAspectRatio) {
          // Canvas is taller, fit to height
          finalHeight = pdfHeight - 20; // 10mm margin top and bottom
          finalWidth = finalHeight / canvasAspectRatio;
        } else {
          // Canvas is wider, fit to width
          finalWidth = pdfWidth - 20; // 10mm margin left and right
          finalHeight = finalWidth * canvasAspectRatio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        console.log('PDF dimensions calculated:', {
          finalWidth,
          finalHeight,
          x,
          y,
        });

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        // Generate safe filename
        const fullName = resume?.profileInfo?.fullName || 'resume';
        const safeFileName = fullName
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '_')
          .toLowerCase();
        const fileName = `${safeFileName}_${template}_${
          new Date().toISOString().split('T')[0]
        }.pdf`;

        console.log('Saving PDF:', fileName);
        pdf.save(fileName);

        toast.dismiss(loadingToast);
        toast.success('PDF downloaded successfully!');

        if (onDownloadPDF) {
          onDownloadPDF();
        }
      } catch (error) {
        console.error('PDF generation failed:', error);
        toast.dismiss(loadingToast);

        // Try the simple fallback
        try {
          await handleSimplePDFDownload();
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          toast.error(
            'PDF generation failed. Please try the browser print option (Ctrl+P).'
          );
        }
      }
    };

    // Fallback PDF generation method
    const handleSimplePDFDownload = async () => {
      try {
        console.log('Attempting simple PDF generation...');
        const loadingToast = toast.loading('Generating PDF (simple mode)...');

        const canvas = await html2canvas(resumeRef.current, {
          scale: 1,
          backgroundColor: '#ffffff',
          logging: true,
          useCORS: false,
          allowTaint: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

        const fileName = `resume_${new Date().getTime()}.pdf`;
        pdf.save(fileName);

        toast.dismiss(loadingToast);
        toast.success('PDF downloaded successfully (simple mode)!');
      } catch (error) {
        console.error('Simple PDF generation also failed:', error);

        // Final fallback - use browser print
        toast.dismiss();
        toast(
          'Using browser print as fallback. Press Ctrl+P or Cmd+P to save as PDF',
          {
            duration: 5000,
            icon: '🖨️',
          }
        );

        // Trigger browser print dialog
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    };

    // Template-specific styles
    const getTemplateStyles = () => {
      switch (template) {
        case 'classic':
          return {
            container: 'bg-white text-gray-900 font-serif',
            header: 'text-center border-b-2 border-gray-800 pb-6 mb-6',
            nameStyle: 'text-4xl font-bold text-gray-900 mb-2 tracking-wide',
            titleStyle: 'text-xl text-gray-700 mb-4 font-semibold',
            sectionTitle:
              'text-xl font-bold text-gray-900 border-b-2 border-gray-400 pb-2 mb-4 uppercase tracking-wider font-serif',
            contactStyle:
              'flex flex-wrap justify-center gap-6 text-sm text-gray-600',
            primaryColor: 'text-gray-900',
            secondaryColor: 'text-gray-700',
            accentColor: 'text-gray-600',
          };
        case 'creative':
          return {
            container:
              'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900',
            header:
              'text-left bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white p-8 mb-6 rounded-2xl shadow-lg',
            nameStyle: 'text-4xl font-bold text-white mb-3 drop-shadow-md',
            titleStyle: 'text-xl text-purple-100 mb-4 font-medium',
            sectionTitle:
              'text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent border-b-2 border-purple-300 pb-3 mb-4',
            contactStyle: 'flex flex-wrap gap-4 text-sm text-purple-100',
            primaryColor: 'text-purple-600',
            secondaryColor: 'text-gray-700',
            accentColor: 'text-purple-500',
          };
        case 'professional':
          return {
            container: 'bg-white text-gray-900',
            header: 'text-left bg-blue-900 text-white p-6 mb-6 -m-8 mb-6',
            nameStyle: 'text-3xl font-bold text-white mb-2',
            titleStyle: 'text-lg text-blue-100 mb-4 font-medium',
            sectionTitle:
              'text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2 mb-4 uppercase tracking-wide',
            contactStyle: 'flex flex-wrap gap-4 text-sm text-blue-100',
            primaryColor: 'text-blue-900',
            secondaryColor: 'text-gray-700',
            accentColor: 'text-blue-600',
          };
        case 'minimal':
          return {
            container: 'bg-white text-gray-900',
            header: 'text-center pb-8 mb-8 border-b border-gray-200',
            nameStyle: 'text-4xl font-light text-gray-900 mb-3 tracking-wider',
            titleStyle: 'text-lg text-gray-600 mb-6 font-normal tracking-wide',
            sectionTitle:
              'text-lg font-medium text-gray-900 mb-4 tracking-wide uppercase text-sm',
            contactStyle:
              'flex flex-wrap justify-center gap-6 text-sm text-gray-600',
            primaryColor: 'text-gray-900',
            secondaryColor: 'text-gray-700',
            accentColor: 'text-gray-500',
          };
        default: // modern
          return {
            container: 'bg-white text-gray-900',
            header: 'text-left border-b-2 border-violet-600 pb-6 mb-6',
            nameStyle: 'text-3xl font-bold text-gray-900 mb-2',
            titleStyle: 'text-xl text-violet-600 font-medium mb-4',
            sectionTitle:
              'text-xl font-bold text-gray-900 border-b-2 border-violet-600 pb-2 mb-4',
            contactStyle: 'flex flex-wrap gap-4 text-sm text-gray-600',
            primaryColor: 'text-violet-600',
            secondaryColor: 'text-gray-700',
            accentColor: 'text-gray-600',
          };
      }
    };

    const styles = getTemplateStyles();

    // Expose the downloadPDF function to parent components
    useImperativeHandle(ref, () => ({
      downloadPDF: handleDownloadPDF,
    }));

    if (!resume) {
      return (
        <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download size={24} />
            </div>
            <p className="font-medium">Loading preview...</p>
          </div>
        </div>
      );
    }

    const {
      profileInfo,
      contactInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages,
      interests,
    } = resume;

    return (
      <div className="h-[140vh] bg-gray-50">
        {/* Preview Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Live Preview</h2>
              <p className="text-sm text-gray-600">
                Template: {template.charAt(0).toUpperCase() + template.slice(1)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimplePDFDownload}
                className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors print:hidden text-sm">
                Simple PDF
              </button>
              <button
                id="resume-preview-download-btn"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors print:hidden">
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="h-full overflow-y-scroll">
          <div
            ref={resumeRef}
            id="resume-preview"
            className={`max-w-4xl mx-auto p-6 print:p-0 print:max-w-none ${styles.container}`}>
            <div className="bg-white shadow-lg print:shadow-none p-8 space-y-6">
              {/* Header Section */}
              <div
                className={`${styles.header} ${
                  template === 'professional' ? 'text-white' : ''
                }`}>
                <div className="flex items-center gap-6">
                  {profileInfo?.profilePreviewUrl && (
                    <img
                      src={profileInfo.profilePreviewUrl}
                      alt={profileInfo.fullName || 'Profile'}
                      className={`w-24 h-24 rounded-full object-cover shadow-lg ${
                        template === 'professional'
                          ? 'border-4 border-white'
                          : 'border-4 border-white'
                      }`}
                    />
                  )}
                  <div className="flex-1">
                    <h1 className={styles.nameStyle}>
                      {profileInfo?.fullName || 'Your Name'}
                    </h1>
                    <h2 className={styles.titleStyle}>
                      {profileInfo?.designation || 'Your Title'}
                    </h2>
                    {contactInfo && (
                      <div className={styles.contactStyle}>
                        {contactInfo.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{contactInfo.email}</span>
                          </div>
                        )}
                        {contactInfo.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{contactInfo.phone}</span>
                          </div>
                        )}
                        {contactInfo.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{contactInfo.location}</span>
                          </div>
                        )}
                        {contactInfo.linkedin && (
                          <div className="flex items-center gap-2">
                            <Linkedin size={16} />
                            <span>{contactInfo.linkedin}</span>
                          </div>
                        )}
                        {contactInfo.github && (
                          <div className="flex items-center gap-2">
                            <Github size={16} />
                            <span>{contactInfo.github}</span>
                          </div>
                        )}
                        {contactInfo.website && (
                          <div className="flex items-center gap-2">
                            <Globe size={16} />
                            <span>{contactInfo.website}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {profileInfo?.summary && (
                  <div className="mt-6">
                    <h3
                      className={`${styles.sectionTitle} text-lg mb-3 ${
                        template === 'professional'
                          ? 'text-white border-blue-200'
                          : ''
                      }`}>
                      Summary
                    </h3>
                    <p
                      className={`leading-relaxed ${
                        template === 'professional'
                          ? 'text-blue-100'
                          : styles.secondaryColor
                      }`}>
                      {profileInfo.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Work Experience */}
              {workExperience &&
                workExperience.length > 0 &&
                workExperience.some((exp) => exp.company || exp.role) && (
                  <div>
                    <h3 className={styles.sectionTitle}>Work Experience</h3>
                    <div className="space-y-4">
                      {workExperience.map(
                        (exp, index) =>
                          (exp.company || exp.role) && (
                            <div key={index} className="pb-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4
                                    className={`text-lg font-semibold ${styles.primaryColor}`}>
                                    {exp.role || 'Position'}
                                  </h4>
                                  <p
                                    className={`font-medium ${styles.secondaryColor}`}>
                                    {exp.company || 'Company'}
                                  </p>
                                </div>
                                {(exp.startDate || exp.endDate) && (
                                  <span
                                    className={`text-sm ${styles.accentColor} font-medium`}>
                                    {exp.startDate}{' '}
                                    {exp.startDate && exp.endDate && '-'}{' '}
                                    {exp.endDate}
                                  </span>
                                )}
                              </div>
                              {exp.description && (
                                <p
                                  className={`${styles.secondaryColor} leading-relaxed`}>
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Education */}
              {education &&
                education.length > 0 &&
                education.some((edu) => edu.degree || edu.institution) && (
                  <div>
                    <h3 className={styles.sectionTitle}>Education</h3>
                    <div className="space-y-4">
                      {education.map(
                        (edu, index) =>
                          (edu.degree || edu.institution) && (
                            <div key={index} className="pb-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4
                                    className={`text-lg font-semibold ${styles.primaryColor}`}>
                                    {edu.degree || 'Degree'}
                                    {edu.fieldOfStudy &&
                                      ` in ${edu.fieldOfStudy}`}
                                  </h4>
                                  <p
                                    className={`font-medium ${styles.secondaryColor}`}>
                                    {edu.institution || 'Institution'}
                                  </p>
                                  {edu.gpa && (
                                    <p
                                      className={`text-sm ${styles.accentColor}`}>
                                      GPA: {edu.gpa}
                                    </p>
                                  )}
                                </div>
                                {(edu.startDate || edu.endDate) && (
                                  <span
                                    className={`text-sm ${styles.accentColor} font-medium`}>
                                    {edu.startDate}{' '}
                                    {edu.startDate && edu.endDate && '-'}{' '}
                                    {edu.endDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Skills */}
              {skills &&
                skills.length > 0 &&
                skills.some(
                  (skillCategory) =>
                    skillCategory.category ||
                    (skillCategory.skillsList &&
                      skillCategory.skillsList.length > 0)
                ) && (
                  <div>
                    <h3 className={styles.sectionTitle}>Skills</h3>
                    <div className="space-y-4">
                      {skills.map(
                        (skillCategory, index) =>
                          (skillCategory.category ||
                            (skillCategory.skillsList &&
                              skillCategory.skillsList.length > 0)) && (
                            <div key={index}>
                              {skillCategory.category && (
                                <h4
                                  className={`text-lg font-semibold ${styles.primaryColor} mb-2`}>
                                  {skillCategory.category}
                                </h4>
                              )}
                              {skillCategory.skillsList &&
                                skillCategory.skillsList.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {skillCategory.skillsList.map(
                                      (skill, skillIndex) => (
                                        <span
                                          key={skillIndex}
                                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            template === 'creative'
                                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                              : template === 'classic'
                                              ? 'bg-gray-100 text-gray-700 border border-gray-300'
                                              : template === 'professional'
                                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                              : template === 'minimal'
                                              ? 'bg-gray-50 text-gray-700 border border-gray-200'
                                              : 'bg-violet-100 text-violet-700 border border-violet-200'
                                          }`}>
                                          {skill}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Projects */}
              {projects &&
                projects.length > 0 &&
                projects.some((project) => project.name) && (
                  <div>
                    <h3 className={styles.sectionTitle}>Projects</h3>
                    <div className="space-y-4">
                      {projects.map(
                        (project, index) =>
                          project.name && (
                            <div key={index} className="pb-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4
                                  className={`text-lg font-semibold ${styles.primaryColor}`}>
                                  {project.name}
                                </h4>
                                {(project.startDate || project.endDate) && (
                                  <span
                                    className={`text-sm ${styles.accentColor} font-medium`}>
                                    {project.startDate}{' '}
                                    {project.startDate &&
                                      project.endDate &&
                                      '-'}{' '}
                                    {project.endDate}
                                  </span>
                                )}
                              </div>
                              {project.technologies && (
                                <p
                                  className={`text-sm ${styles.accentColor} mb-2 font-medium`}>
                                  Technologies: {project.technologies}
                                </p>
                              )}
                              {project.description && (
                                <p
                                  className={`${styles.secondaryColor} leading-relaxed mb-2`}>
                                  {project.description}
                                </p>
                              )}
                              {project.link && (
                                <a
                                  href={project.link}
                                  className={`flex items-center gap-2 text-sm ${styles.accentColor} hover:${styles.primaryColor}`}>
                                  <ExternalLink size={14} />
                                  View Project
                                </a>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Certifications */}
              {certifications &&
                certifications.length > 0 &&
                certifications.some((cert) => cert.name) && (
                  <div>
                    <h3 className={styles.sectionTitle}>Certifications</h3>
                    <div className="space-y-3">
                      {certifications.map(
                        (cert, index) =>
                          cert.name && (
                            <div
                              key={index}
                              className="flex justify-between items-start">
                              <div>
                                <h4
                                  className={`font-semibold ${styles.primaryColor}`}>
                                  {cert.name}
                                </h4>
                                {cert.issuer && (
                                  <p
                                    className={`text-sm ${styles.secondaryColor}`}>
                                    {cert.issuer}
                                  </p>
                                )}
                                {cert.credentialId && (
                                  <p
                                    className={`text-xs ${styles.accentColor}`}>
                                    ID: {cert.credentialId}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                {cert.issueDate && (
                                  <span
                                    className={`text-sm ${styles.accentColor} font-medium block`}>
                                    {new Date(
                                      cert.issueDate
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                                {cert.expiryDate && (
                                  <span
                                    className={`text-xs ${styles.accentColor}`}>
                                    Expires:{' '}
                                    {new Date(
                                      cert.expiryDate
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Languages */}
              {languages &&
                languages.length > 0 &&
                languages.some((lang) => lang.language) && (
                  <div>
                    <h3 className={styles.sectionTitle}>Languages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {languages.map(
                        (lang, index) =>
                          lang.language && (
                            <div
                              key={index}
                              className="flex items-center justify-between">
                              <span
                                className={`font-medium ${styles.secondaryColor}`}>
                                {lang.language}
                              </span>
                              <span
                                className={`text-sm ${styles.accentColor} font-medium`}>
                                {lang.proficiency || 'Basic'}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

              {/* Interests */}
              {interests &&
                interests.length > 0 &&
                interests.some((interest) => interest?.trim()) && (
                  <div>
                    <h3 className={styles.sectionTitle}>Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {interests.map(
                        (interest, index) =>
                          interest?.trim() && (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                template === 'creative'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : template === 'classic'
                                  ? 'bg-gray-100 text-gray-700 border border-gray-300'
                                  : template === 'professional'
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                  : template === 'minimal'
                                  ? 'bg-gray-50 text-gray-700 border border-gray-200'
                                  : 'bg-violet-100 text-violet-700 border border-violet-200'
                              }`}>
                              {interest}
                            </span>
                          )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
        }
      `}</style>
      </div>
    );
  }
);

export default ResumePreview;
