import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { uploadAPI, VIDEO_BASE_URL } from '../api/endpoints'

export default function VideoUploader({
  value,
  onChange,
  label = 'ویدئوی حرکت',
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(
    value ? `${VIDEO_BASE_URL}${value}` : null
  )
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      setError('حجم فایل نباید بیشتر از ۵۰۰ مگابایت باشه')
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const { data } = await uploadAPI.video(file, (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        setProgress(percent)
      })

      setPreview(`${VIDEO_BASE_URL}${data.url}`)
      onChange(data.url)
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.detail || 'خطا در آپلود. لطفاً دوباره تلاش کن.'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="video-uploader">
      <label className="video-uploader-label">{label}</label>

      {!preview && !uploading && (
        <div
          className="video-upload-area"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="video-upload-icon">🎬</span>
          <strong>برای آپلود ویدئو کلیک کن</strong>
          <span className="video-upload-hint">
            MP4, WebM, MOV — حداکثر ۵۰۰ مگابایت
          </span>
        </div>
      )}

      {uploading && (
        <div className="video-uploading">
          <div className="video-upload-progress">
            <motion.div
              className="video-upload-progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span>در حال آپلود... {progress}٪</span>
        </div>
      )}

      {preview && !uploading && (
        <div className="video-preview">
          <video src={preview} controls className="video-preview-player">
            مرورگر شما از پخش ویدئو پشتیبانی نمی‌کنه.
          </video>
          <button
            type="button"
            className="video-remove-btn"
            onClick={handleRemove}
          >
            🗑 حذف ویدئو
          </button>
        </div>
      )}

      {error && <div className="auth-error">{error}</div>}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  )
}