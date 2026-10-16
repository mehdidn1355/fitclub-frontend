import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { coursesAPI, VIDEO_BASE_URL } from '../api/endpoints'

function CoursePlayer() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          coursesAPI.get(courseId),
          coursesAPI.lessons(courseId),
        ])
        setCourse(courseRes.data)
        setLessons(lessonsRes.data)
        if (lessonsRes.data.length > 0) {
          setActiveLesson(lessonsRes.data[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId])

  if (loading) {
    return (
      <div className="player-page">
        <div className="loading-state">
          <div className="spinner" />
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (!course || !activeLesson) {
    return (
      <div className="player-page">
        <div className="error-state">
          <p>دوره یافت نشد</p>
          <Link to="/courses" className="primary-button">
            بازگشت به دوره‌ها
          </Link>
        </div>
      </div>
    )
  }

  const progress = lessons.length
    ? Math.round((completed.length / lessons.length) * 100)
    : 0

  const isLocked =
    !activeLesson.is_free &&
    !completed.includes(activeLesson.id) &&
    activeLesson.order > 2

  const hasVideo = !!activeLesson.video_url

  const toggleComplete = () => {
    if (completed.includes(activeLesson.id)) {
      setCompleted(completed.filter((id) => id !== activeLesson.id))
    } else {
      setCompleted([...completed, activeLesson.id])
    }
  }

  const nextLesson = () => {
    const idx = lessons.findIndex((l) => l.id === activeLesson.id)
    if (idx < lessons.length - 1) setActiveLesson(lessons[idx + 1])
  }

  const prevLesson = () => {
    const idx = lessons.findIndex((l) => l.id === activeLesson.id)
    if (idx > 0) setActiveLesson(lessons[idx - 1])
  }

  return (
    <div className="player-page">
      {/* Header */}
      <header className="player-header">
        <Link to={`/courses/${course.id}`} className="player-back">
          ← بازگشت به دوره
        </Link>
        <div className="player-header-info">
          <span className="player-course-icon">{course.icon}</span>
          <div>
            <strong>{course.title}</strong>
            <span>
              {toFa(lessons.length)} درس • {course.duration}
            </span>
          </div>
        </div>
        <div className="player-progress-info">
          <div className="player-progress-bar">
            <motion.div
              className="player-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span>{toFa(progress)}٪</span>
        </div>
      </header>

      <div className="player-layout">
        {/* Main */}
        <div className="player-main">
          <div className="player-video-wrapper">
            {isLocked ? (
              <div className="player-locked">
                <span className="locked-icon">🔒</span>
                <h3>این درس قفل است</h3>
                <p>برای دسترسی، دوره رو خریداری کن.</p>
                <Link
                  to={`/courses/${course.id}`}
                  className="primary-button"
                >
                  خرید دوره
                </Link>
              </div>
            ) : hasVideo ? (
              <video
                key={activeLesson.id}
                src={`${VIDEO_BASE_URL}${activeLesson.video_url}`}
                controls
                autoPlay
                className="player-video-element"
              >
                مرورگر شما از پخش ویدئو پشتیبانی نمی‌کنه.
              </video>
            ) : (
              <div className="player-video">
                <div className="player-video-placeholder">
                  <motion.div
                    className="play-icon"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ▶
                  </motion.div>
                  <h3>{activeLesson.title}</h3>
                  <p>مدت: {activeLesson.duration}</p>
                  <span className="no-video-badge">🎬 ویدئو هنوز آپلود نشده</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="player-controls">
            <div className="player-lesson-title">
              <span>درس فعلی:</span>
              <strong>{activeLesson.title}</strong>
            </div>
            <div className="player-buttons">
              <button
                className="player-btn"
                onClick={prevLesson}
                disabled={lessons[0]?.id === activeLesson.id}
              >
                → درس قبلی
              </button>
              <button
                className={`player-btn ${
                  completed.includes(activeLesson.id) ? 'completed' : ''
                }`}
                onClick={toggleComplete}
                disabled={isLocked}
              >
                {completed.includes(activeLesson.id)
                  ? '✓ تکمیل شده'
                  : 'علامت‌گذاری به‌عنوان تکمیل'}
              </button>
              <button
                className="player-btn primary"
                onClick={nextLesson}
                disabled={lessons[lessons.length - 1]?.id === activeLesson.id}
              >
                درس بعدی ←
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="player-sidebar">
          <div className="player-sidebar-header">
            <h3>محتوای دوره</h3>
            <span>
              {toFa(completed.length)} از {toFa(lessons.length)}
            </span>
          </div>

          <div className="player-lessons">
            {lessons.map((lesson, i) => {
              const isCompleted = completed.includes(lesson.id)
              const isActive = activeLesson.id === lesson.id
              const locked =
                !lesson.is_free && !isCompleted && lesson.order > 2

              return (
                <button
                  key={lesson.id}
                  className={`player-lesson ${
                    isActive ? 'active' : ''
                  } ${isCompleted ? 'completed' : ''} ${
                    locked ? 'locked' : ''
                  }`}
                  onClick={() => !locked && setActiveLesson(lesson)}
                >
                  <span className="lesson-num">
                    {isCompleted ? '✓' : locked ? '🔒' : toFa(i + 1)}
                  </span>
                  <div className="lesson-content">
                    <strong>{lesson.title}</strong>
                    <span>⏱ {lesson.duration}</span>
                  </div>
                  {isActive && <span className="lesson-playing">▶</span>}
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CoursePlayer