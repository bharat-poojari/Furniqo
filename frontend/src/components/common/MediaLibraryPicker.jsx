import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiRefreshCw, FiCheck, FiX, FiImage, FiSearch } from 'react-icons/fi';
import apiWrapper from '../../services/apiWrapper';
import { getUploadUrls, getUploadedImages } from '../../utils/uploadResponseUtils';
import { toast } from 'react-hot-toast';

const MediaLibraryPicker = ({
  selected,
  onSelect,
  multiple = false,
  label = 'Media Library',
  buttonText,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrls, setSelectedUrls] = useState(
    Array.isArray(selected) ? selected : selected ? [selected] : []
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSelectedUrls(Array.isArray(selected) ? selected : selected ? [selected] : []);
  }, [selected]);

  useEffect(() => {
    if (!isOpen) return;
    fetchImages();
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await apiWrapper.getUploadedImages();
      setImages(getUploadedImages(response));
    } catch (error) {
      console.error('Failed to load media library:', error);
      toast.error('Unable to load media library');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      if (multiple) {
        files.forEach((file) => formData.append('images', file));
      } else {
        formData.append('image', files[0]);
      }

      const response = multiple
        ? await apiWrapper.uploadImages(formData)
        : await apiWrapper.uploadImage(formData);

      const urls = getUploadUrls(response);

      if (!urls.length) {
        throw new Error('No image URL returned from upload');
      }

      setImages((prev) => [...urls, ...prev]);

      if (multiple) {
        const merged = Array.from(new Set([...(selectedUrls || []), ...urls]));
        setSelectedUrls(merged);
        onSelect(merged);
      } else {
        setSelectedUrls([urls[0]]);
        onSelect(urls[0]);
        setIsOpen(false);
      }

      toast.success('Media uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toggleSelection = (url) => {
    if (!multiple) {
      onSelect(url);
      setIsOpen(false);
      return;
    }

    setSelectedUrls((prev) => {
      if (prev.includes(url)) {
        return prev.filter((item) => item !== url);
      }
      return [...prev, url];
    });
  };

  const handleConfirmSelection = () => {
    onSelect(Array.from(new Set(selectedUrls)));
    setIsOpen(false);
  };

  const filteredImages = images.filter((url) =>
    url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm transition hover:border-primary-500 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
      >
        <FiImage className="h-4 w-4" />
        {buttonText || `Choose from ${label}`}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-neutral-900">
            <div className="flex flex-col gap-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{label}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Select existing media or upload new images.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={fetchImages}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 transition hover:border-primary-500 hover:text-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 transition hover:border-red-500 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <FiX className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
                <div className="flex items-center gap-3 rounded-3xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-950">
                  <FiSearch className="h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search uploads"
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none dark:text-neutral-100"
                  />
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-3xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-primary-500 hover:text-primary-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <FiUpload className="h-4 w-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload image'}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-950">
                {loading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="h-24 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                    ))}
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                    No media found. Upload a new image to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredImages.map((url) => {
                      const isSelected = selectedUrls.includes(url);
                      return (
                        <button
                          key={url}
                          type="button"
                          onClick={() => toggleSelection(url)}
                          className={`relative overflow-hidden rounded-3xl border p-0 transition ${isSelected ? 'border-primary-500 ring-2 ring-primary-300' : 'border-transparent hover:border-neutral-300'} bg-white dark:bg-neutral-900`}
                        >
                          <img src={url} alt="Upload" className="h-28 w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-xs">
                            {url.split('/').pop()}
                          </div>
                          {isSelected && (
                            <span className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-primary-600 p-1 text-white">
                              <FiCheck className="h-3 w-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {multiple && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{selectedUrls.length} selected</p>
                  <button
                    type="button"
                    onClick={handleConfirmSelection}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
                  >
                    <FiCheck className="h-4 w-4" />
                    Insert selected
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPicker;
