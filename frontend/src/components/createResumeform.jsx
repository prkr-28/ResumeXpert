import React, {useState} from 'react';
import Input from './input';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import {API_PATHS} from '../utils/apiPaths';

const CreateResumeform = ({onSuccess}) => {
   const [title, setTitle] = useState('');
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

   const handleCreateResume = async (e) => {
      e.preventDefault();
      console.log('Form submitted, title:', title);

      if (!title) {
         setError('please enter resume title');
         return;
      }
      setError('');
      setIsLoading(true);

      try {
         console.log('Making API call...');
         const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
            title,
         });
         console.log('API response:', response.data);

         if (response.data._id) {
            // Call onSuccess callback to close modal and refresh dashboard
            console.log('Success! Calling onSuccess callback...');
            if (onSuccess) {
               onSuccess();
            }
            // Navigate to the resume editor
            console.log('Navigating to resume editor...');
            navigate(`/resume/${response.data?._id}`);
         }
      } catch (error) {
         console.error('Error creating resume:', error);
         if (error.response && error.response.data.message) {
            setError(error.response.data.message);
         } else {
            setError('something went wrong please try again');
         }
      } finally {
         setIsLoading(false);
         onSuccess();
      }
   };

   return (
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
         <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Create New Resume
         </h3>
         <p className="text-gray-600 mb-8">
            Give your resume a title to get started. You can customise
            everything later.
         </p>

         <form onSubmit={handleCreateResume}>
            <Input
               value={title}
               onChange={({target}) => setTitle(target.value)}
               label="Resume Title"
               placeholder="Enter the Title"
               type="text"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
               type="submit"
               disabled={isLoading}
               className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all disabled:opacity-50 disabled:hover:scale-100">
               {isLoading ? 'Creating...' : 'Create Resume'}
            </button>
         </form>
      </div>
   );
};

export default CreateResumeform;
