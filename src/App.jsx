import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import CoursePlayer from './pages/CoursePlayer'
import Trainers from './pages/Trainers'
import TrainerDetail from './pages/TrainerDetail'
import TrainerPanel from './pages/TrainerPanel'
import TrainerStudents from './pages/TrainerStudents'
import TrainerSchedule from './pages/TrainerSchedule'
import TrainerCourses from './pages/TrainerCourses'
import TrainerRequests from './pages/TrainerRequests'
import WorkoutPlanBuilder from './pages/WorkoutPlanBuilder'
import WorkoutGenerator from './pages/WorkoutGenerator'
import NutritionBuilder from './pages/NutritionBuilder'
import AdminDashboard from './pages/AdminDashboard'
import AdminMembers from './pages/AdminMembers'
import AdminOrders from './pages/AdminOrders'
import AdminTrainers from './pages/AdminTrainers'
import AdminReports from './pages/AdminReports'
import AdminCreateUser from './pages/AdminCreateUser'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Contact from './pages/Contact'
import AITrainerWizard from './pages/AITrainerWizard'
import MyPlans from './pages/MyPlans'
import PlanView from './pages/PlanView' // 👈 اضافه شد
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses/:courseId/player" element={<CoursePlayer />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/trainers/:trainerId" element={<TrainerDetail />} />
          <Route path="/trainer" element={<TrainerPanel />} />
          <Route path="/trainer/students" element={<TrainerStudents />} />
          <Route path="/trainer/schedule" element={<TrainerSchedule />} />
          <Route path="/trainer/courses" element={<TrainerCourses />} />
          <Route path="/trainer/requests" element={<TrainerRequests />} />
          <Route path="/trainer/plan/:planId" element={<WorkoutPlanBuilder />} />
          <Route path="/trainer/nutrition/:planId" element={<NutritionBuilder />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/trainers" element={<AdminTrainers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/create-user" element={<AdminCreateUser />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-trainer" element={<AITrainerWizard />} />
          <Route path="/plans" element={<MyPlans />} />
          
          {/* 👇 این خط برای نمایش صفحه برنامه ساخته شده است */}
          <Route path="/plans/:planId" element={<PlanView />} />
          
          <Route path="/generate-workout" element={<WorkoutGenerator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App