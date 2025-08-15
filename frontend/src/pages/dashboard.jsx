import React, {useEffect, useState, useCallback} from 'react';
import Dashboardlayout from '../components/dashboardlayout';
import {dashboardStyles as styles} from '../assets/dummystyle';
import {useNavigate} from 'react-router-dom';
import {LucideFilePlus, LucideTrash2} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import {API_PATHS} from '../utils/apiPaths';
import {ResumeSummaryCard} from '../components/cards';
import toast from 'react-hot-toast';
import moment from 'moment';
import Modal from '../components/model';
import CreateResumeform from '../components/createResumeform';

const Dashboard = () => {
   const navigate = useNavigate();
   const [openCreateModal, setOpenCreateModal] = useState(false);
   const [allResumes, setAllResumes] = useState([]);
   const [loading, setLoading] = useState(false);
   const [resumeToDelete, setResumeToDelete] = useState(null);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   // Calculate completion percentage for a resume
   const calculateCompletion = (resume) => {
      let completedFields = 0;
      let totalFields = 0;

      // Profile Info
      totalFields += 3;
      if (resume.profileInfo?.fullName) completedFields++;
      if (resume.profileInfo?.designation) completedFields++;
      if (resume.profileInfo?.summary) completedFields++;

      // Contact Info
      totalFields += 2;
      if (resume.contactInfo?.email) completedFields++;
      if (resume.contactInfo?.phone) completedFields++;

      // Work Experience
      resume.workExperience?.forEach((exp) => {
         totalFields += 5;
         if (exp.company) completedFields++;
         if (exp.role) completedFields++;
         if (exp.startDate) completedFields++;
         if (exp.endDate) completedFields++;
         if (exp.description) completedFields++;
      });

      // Education
      resume.education?.forEach((edu) => {
         totalFields += 4;
         if (edu.degree) completedFields++;
         if (edu.institution) completedFields++;
         if (edu.startDate) completedFields++;
         if (edu.endDate) completedFields++;
      });

      // Skills
      resume.skills?.forEach((skillCategory) => {
         totalFields += 2;
         if (skillCategory.category) completedFields++;
         if (skillCategory.skillsList && skillCategory.skillsList.length > 0)
            completedFields++;
      });

      // Projects
      resume.projects?.forEach((project) => {
         totalFields += 4;
         if (project.name) completedFields++;
         if (project.description) completedFields++;
         if (project.technologies) completedFields++;
         if (project.link) completedFields++;
      });

      // Certifications
      resume.certifications?.forEach((cert) => {
         totalFields += 3;
         if (cert.name) completedFields++;
         if (cert.issuer) completedFields++;
         if (cert.issueDate) completedFields++;
      });

      // Languages
      resume.languages?.forEach((lang) => {
         totalFields += 2;
         if (lang.language) completedFields++;
         if (lang.proficiency) completedFields++;
      });

      // Interests
      totalFields += resume.interests?.length || 0;
      completedFields +=
         resume.interests?.filter((i) => i?.trim() !== '')?.length || 0;

      return Math.round((completedFields / totalFields) * 100);
   };

   const fetchAllResumes = useCallback(async () => {
      try {
         setLoading(true);
         const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
         const resumesWithCompletion = response.data.map((resume) => ({
            ...resume,
            completion: calculateCompletion(resume),
         }));
         setAllResumes(resumesWithCompletion);
      } catch (error) {
         console.error('error in fetching resumes', error);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchAllResumes();
   }, [fetchAllResumes, allResumes.length]);

   const handleDeleteResume = async () => {
      if (!resumeToDelete) {
         return;
      }
      try {
         await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
         toast.success('Resume deleted sucessfully');
      } catch (error) {
         console.error('error in deleting the resume', error);
         toast.error('failed to delete resume');
      } finally {
         setResumeToDelete(null);
         setShowDeleteConfirm(false);
         fetchAllResumes(); // Refresh the list
      }
   };

   const handleDeleteClick = (id) => {
      setResumeToDelete(id);
      setShowDeleteConfirm(true);
   };

   return (
      <Dashboardlayout>
         <div className={styles.container}>
            <div className={styles.headerWrapper}>
               <div>
                  <h1 className={styles.headerTitle}>My Resumes</h1>
                  <p className={styles.headerSubtitle}>
                     {allResumes.length > 0
                        ? `You have ${allResumes.length} resumes${
                             allResumes.length != 1 ? 's' : ''
                          }`
                        : 'Start building your professional resume'}
                  </p>
               </div>

               <div className="flex gap-4">
                  <button
                     className={styles.createButton}
                     onClick={() => setOpenCreateModal(true)}>
                     <div className={styles.createButtonOverlay}></div>
                     <span className={styles.createButtonContent}>
                        Create Now
                        <LucideFilePlus
                           className="group-hover:translate-x-1 transition-transform"
                           size={18}
                        />
                     </span>
                  </button>
               </div>
            </div>

            {/* loading state */}
            {loading && (
               <div className={styles.spinnerWrapper}>
                  <div className={styles.spinner}></div>
               </div>
            )}

            {/* emptystate */}
            {!loading && allResumes.length === 0 && (
               <div className={styles.emptyStateWrapper}>
                  <div className={styles.emptyIconWrapper}>
                     <LucideFilePlus className="text-violet-600" size={32} />
                  </div>
                  <h3 className={styles.emptyTitle}>No Resumes Yet</h3>
                  <p className={styles.emptyText}>
                     You haven't created any resume yet. Start building your
                     proffesional resume to land your dream job
                  </p>

                  <button
                     className={styles.createButton}
                     onClick={() => setOpenCreateModal(true)}>
                     <div className={styles.createButtonOverlay}></div>
                     <span className={styles.createButtonContent}>
                        Create Your First Resume
                        <LucideFilePlus
                           className="group-hover:translate-x-1 transition-transform"
                           size={20}
                        />
                     </span>
                  </button>
               </div>
            )}

            {/* grid view */}
            {!loading && allResumes.length > 0 && (
               <div className={styles.grid}>
                  <div
                     className={styles.newResumeCard}
                     onClick={() => setOpenCreateModal(true)}>
                     <div className={styles.newResumeIcon}>
                        <LucideFilePlus size={32} className="text-white" />
                     </div>
                     <h3 className={styles.newResumeTitle}>
                        Create New Resume
                     </h3>
                     <p className={styles.newResumeText}>
                        Start building your career
                     </p>
                  </div>
                  {allResumes.map((resume) => (
                     <ResumeSummaryCard
                        key={resume._id}
                        imgUrl={resume.thumbnailLink}
                        title={resume.title}
                        createdAt={resume.createdAt}
                        updatedAt={resume.updatedAt}
                        onSelect={() => navigate(`/resume/${resume._id}`)}
                        onDelete={() => handleDeleteClick(resume._id)}
                        completion={resume.completion || 0}
                        isPremium={resume.isPremium}
                        isNew={
                           moment().diff(moment(resume.createdAt), 'days') < 7
                        }
                     />
                  ))}
               </div>
            )}
         </div>

         {/* create model */}
         <Modal
            isOpen={openCreateModal}
            onclose={() => setOpenCreateModal(false)}
            hideHeader
            maxWidth="max-w-2xl">
            <div className="p-6">
               <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}></h3>
                  <button
                     onClick={() => setOpenCreateModal(false)}
                     className={styles.modalCloseButton}>
                     X
                  </button>
               </div>

               <CreateResumeform
                  onSuccess={() => {
                     setOpenCreateModal(false);
                     fetchAllResumes();
                  }}
               />
            </div>
         </Modal>

         {/* delete model */}
         <Modal
            isOpen={showDeleteConfirm}
            onclose={() => setShowDeleteConfirm(false)}
            title="Confirm Deletion"
            showActionBtn
            actionBtnText="Delete"
            actionBtnClassName="bg-red-600 hover:bg-red-700"
            onActionClick={handleDeleteResume}>
            <div className="p-4">
               <div className="flec flex-col items-center text-center">
                  <div className={styles.deleteIconWrapper}>
                     <LucideTrash2 className="text-orange-600" size={25} />
                  </div>
                  <h3 className={styles.deleteTitle}>Delete Resume</h3>
                  <p className={styles.deleteText}>
                     Are you sure? you want to delete this resume?
                  </p>
               </div>
            </div>
         </Modal>
      </Dashboardlayout>
   );
};

export default Dashboard;
