import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { coursesAPI, VIDEO_BASE_URL } from '../api/endpoints'
import VideoUploader from '../components/VideoUploader'

function TrainerCourses() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [expandedLesson, setExpandedLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  // ===== useEffect ۱: دریافت دوره‌ها =====
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await coursesAPI.list()
        setCourses(data)
        if (data.length > 0) setSelectedCourse(data[0])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // ===== useEffect ۲: دریافت درس‌ها =====
  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedCourse) return
      try {
        const { data } = await coursesAPI.lessons(selectedCourse.id)
        setLessons(data)
        setExpandedLesson(null)
      } catch (err) {
        console.error(err)
      }
    }
    fetchLessons()
  }, [selectedCourse])

  // ===== handleVideoSaved =====
  const handleVideoSaved = async (lessonId, videoUrl) => {
    try {
      // ذخیره در Backend
      await coursesAPI.updateLessonVideo(lessonId, videoUrl)

      // آپدیت state
      setLessons(
        lessons.map((l) =>
          l.id === lessonId ? { ...l, video_url: videoUrl } : l
        )
      )

      // بستن پنل آپلود
      setExpandedLesson(null)
    } catch (err) {
      console.error('خطا در ذخیره:', err)
      alert('خطا در ذخیره‌ی ویدئو. لطفاً دوباره تلاش کن.')
    }
  }

  // ===== Loading =====
  if (loading) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری...</p>
          </div>
        </main>
      </div>
    )
  }

  // ===== Return =====
  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مربی</span>
          <h1>
            دوره‌های <span>من</span>
          </h1>
          <p>{toFa(courses.length)} دوره</p>
        </div>

        {/* Course Tabs */}
        {courses.length > 0 && (
          <div className="plans-tabs">
            {courses.map((course) => (
              <button
                key={course.id}
                className={`plan-tab ${
                  selectedCourse?.id === course.id ? 'active' : ''
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <span className="plan-tab-id">{course.icon}</span>
                <strong>{course.title}</strong>
                <span className="plan-tab-status">
                  {toFa(course.lessons_count)} درس
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Lessons */}
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="panel-title" style={{ marginTop: '30px' }}>
              <span className="title-bar" />
              📹 درس‌های «{selectedCourse.title}»
            </h2>

            {lessons.length === 0 ? (
              <div className="error-state">
                <div className="error-icon">📹</div>
                <p>هنوز درسی برای این دوره ساخته نشده.</p>
              </div>
            ) : (
              <div className="trainer-lessons-list">
                {lessons.map((lesson, i) => {
                  const isExpanded = expandedLesson === lesson.id

                  return (
                    <motion.div
                      key={lesson.id}
                      className="trainer-lesson-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <div className="trainer-lesson-num">{toFa(i + 1)}</div>

                      <div className="trainer-lesson-info">
                        <strong>{lesson.title}</strong>
                        <span>
                          ⏱ {lesson.duration}
                          {lesson.is_free && ' • 🎬 پیش‌نمایش رایگان'}
                        </span>
                      </div>

                      <div className="trainer-lesson-status">
                        {lesson.video_url ? (
                          <span className="video-status has-video">
                            ✓ ویدئو آپلود شده
                          </span>
                        ) : (
                          <span className="video-status no-video">
                            ⏳ ویدئو ندارد
                          </span>
                        )}
                      </div>

                      <div className="trainer-lesson-actions">
                        <button
                          className="upload-video-btn"
                          onClick={() =>
                            setExpandedLesson(isExpanded ? null : lesson.id)
                          }
                        >
                          {isExpanded
                            ? '✕ بستن'
                            : lesson.video_url
                            ? '✏️ تغییر ویدئو'
                            : '📤 آپلود ویدئو'}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="trainer-lesson-upload">
                          <VideoUploader
                            value={lesson.video_url}
                            onChange={(url) =>
                              handleVideoSaved(lesson.id, url)
                            }
                            label={`ویدئوی درس: ${lesson.title}`}
                          />
                        </div>
                      )}

                      {lesson.video_url && !isExpanded && (
                        <video
                          src={`${VIDEO_BASE_URL}${lesson.video_url}`}
                          className="trainer-lesson-preview"
                          controls
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default TrainerCourses