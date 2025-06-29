import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';
import { containerStyles } from '../assets/dummystyle';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { Download, ArrowLeft, Palette } from 'lucide-react';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resumePreviewRef = useRef();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const getTemplatePreview = (templateId) => {
    const baseStyles =
      'aspect-[3/4] rounded-lg mb-3 p-2 text-xs overflow-hidden';

    switch (templateId) {
      case 'modern':
        return (
          <div className={`${baseStyles} bg-white border border-violet-200`}>
            <div className="h-3 bg-gradient-to-r from-violet-600 to-violet-700 rounded mb-1"></div>
            <div className="h-2 bg-gray-200 rounded mb-1"></div>
            <div className="h-1 bg-gray-300 rounded mb-2"></div>
            <div className="space-y-1">
              <div className="h-1 bg-violet-100 rounded"></div>
              <div className="h-1 bg-violet-100 rounded w-3/4"></div>
              <div className="h-1 bg-violet-100 rounded w-1/2"></div>
            </div>
          </div>
        );
      case 'classic':
        return (
          <div className={`${baseStyles} bg-white border border-gray-300`}>
            <div className="border-b-2 border-gray-400 pb-1 mb-2">
              <div className="h-2 bg-gray-700 rounded mb-1"></div>
              <div className="h-1 bg-gray-500 rounded w-2/3"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-200 rounded"></div>
              <div className="h-1 bg-gray-200 rounded w-4/5"></div>
              <div className="h-1 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        );
      case 'creative':
        return (
          <div
            className={`${baseStyles} bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200`}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded p-1 mb-2">
              <div className="h-2 bg-white/30 rounded mb-1"></div>
              <div className="h-1 bg-white/20 rounded w-2/3"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-purple-200 rounded"></div>
              <div className="h-1 bg-purple-200 rounded w-3/4"></div>
              <div className="h-1 bg-purple-200 rounded w-1/2"></div>
            </div>
          </div>
        );
      default:
        return (
          <div
            className={`${baseStyles} bg-gray-100 flex items-center justify-center`}>
            <span className="text-gray-500 text-sm">Preview</span>
          </div>
        );
    }
  };

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design with violet accents',
      // preview: '/api/placeholder/120/160'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional professional layout with serif fonts',
      // preview: '/api/placeholder/120/160'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and eye-catching design with gradients',
      // preview: '/api/placeholder/120/160'
    },
  ];

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching resume with ID:', id);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(id));
      console.log('Resume fetched successfully:', response.data);
      setResume(response.data);
      if (response.data.template?.theme) {
        setSelectedTemplate(response.data.template.theme);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.status === 404) {
        toast.error('Resume not found');
      } else if (error.response?.status === 401) {
        toast.error('Please log in to access this resume');
      } else {
        toast.error('Failed to load resume');
      }
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleSave = async (updatedData) => {
    try {
      setSaving(true);
      const dataToSave = {
        ...updatedData,
        template: {
          theme: selectedTemplate,
          colorPalette: ['#7c3aed', '#a855f7', '#c084fc'],
        },
      };

      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(id),
        dataToSave
      );
      setResume(response.data);
      toast.success('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateResume = (updatedData) => {
    setResume((prev) => ({ ...prev, ...updatedData }));
    handleSave(updatedData);
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
    handleUpdateResume({
      template: {
        theme: templateId,
        colorPalette: ['#7c3aed', '#a855f7', '#c084fc'],
      },
    });
  };

  const handleDownloadPDF = () => {
    // Trigger download from the preview component
    if (resumePreviewRef.current && resumePreviewRef.current.downloadPDF) {
      resumePreviewRef.current.downloadPDF();
    } else {
      toast.error('PDF download not available. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Resume not found</h2>
          <p className="text-gray-600">
            The resume you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className={containerStyles.main}>
        {/* Header */}
        <div className={containerStyles.header}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-violet-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-violet-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {resume.title}
              </h1>
              <p className="text-gray-600 mt-1">
                Complete your resume to increase your chances of getting hired
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="flex items-center gap-2 px-4 py-2 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-colors">
              <Palette size={18} />
              Template
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors">
              <Download size={18} />
              {saving ? 'Saving...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Template Selector */}
        {showTemplateSelector && (
          <div className="mb-6 p-6 bg-white border border-violet-100 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Choose Template
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-violet-300'
                  }`}>
                  {getTemplatePreview(template.id)}
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={containerStyles.grid}>
          <div className={containerStyles.formContainer}>
            <ResumeForm resume={resume} onUpdate={handleUpdateResume} />
          </div>
          <div className={containerStyles.previewContainer}>
            <ResumePreview
              ref={resumePreviewRef}
              resume={resume}
              template={selectedTemplate}
              onDownloadPDF={handleDownloadPDF}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
