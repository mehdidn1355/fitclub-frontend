import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function PlanView() {
  const { planId } = useParams()
  const navigate = useNavigate()
  
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:8000/api/plans/${planId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات')
        }
        
        const data = await response.json()
        setPlan(data)
      } catch (err) {
        console.error(err)
        setError('برنامه یافت نشد')
      } finally {
        setLoading(false)
      }
    }

    if (planId) {
      fetchPlan()
    }
  }, [planId])

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>در حال دریافت برنامه...</div>
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>
        <h2>⚠️ {error}</h2>
        <button onClick={() => navigate('/plans')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>بازگشت</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#a3e635' }}>برنامه شما با موفقیت ساخته شد! 🎉</h1>
      <h3>عنوان: {plan.title}</h3>
      <p>توضیحات: {plan.description}</p>
      
      <hr style={{ margin: '20px 0', borderColor: '#333' }} />
      
      <h3>لیست حرکات:</h3>
      {plan.items && plan.items.map((item) => (
        <div key={item.id} style={{ background: '#222', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
          <strong>{item.exercise?.name || 'حرکت'}</strong> - {item.day} - {item.sets} ست - {item.reps} تکرار
        </div>
      ))}
    </div>
  )
}

export default PlanView