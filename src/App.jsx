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
import NutritionBuilder from './pages/NutritionBuilder'
import AdminDashboard from './pages/AdminDashboard'
import AdminMembers from './pages/AdminMembers'
import AdminOrders from './pages/AdminOrders'
import AdminTrainers from './pages/AdminTrainers'
import AdminReports from './pages/AdminReports'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Contact from './pages/Contact'
import AITrainerWizard from './pages/AITrainerWizard'
import MyPlans from './pages/MyPlans'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Player بدون Layout */}
        <Route path="/courses/:courseId/player" element={<CoursePlayer />} />

        {/* همه‌ی صفحات با Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* دوره‌ها */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />

          {/* مربیان */}
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/trainers/:trainerId" element={<TrainerDetail />} />

          {/* پنل مربی */}
          <Route path="/trainer" element={<TrainerPanel />} />
          <Route path="/trainer/students" element={<TrainerStudents />} />
          <Route path="/trainer/schedule" element={<TrainerSchedule />} />
          <Route path="/trainer/courses" element={<TrainerCourses />} />
          <Route path="/trainer/requests" element={<TrainerRequests />} />
          <Route
            path="/trainer/plan/:planId"
            element={<WorkoutPlanBuilder />}
          />
          <Route
            path="/trainer/nutrition/:planId"
            element={<NutritionBuilder />}
          />

          {/* پنل ادمین */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/trainers" element={<AdminTrainers />} />
          <Route path="/admin/reports" element={<AdminReports />} />

          {/* فروشگاه */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />

          {/* سبد خرید */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />

          {/* احراز هویت */}
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />

          {/* AI Trainer */}
          <Route path="/ai-trainer" element={<AITrainerWizard />} />
          <Route path="/plans" element={<MyPlans />} />
          <Route path="/plans/:planId" element={<MyPlans />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App