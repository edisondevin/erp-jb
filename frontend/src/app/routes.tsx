import { Routes,Route,Navigate } from 'react-router-dom'
import ProtectedRoute from './guard/ProtectedRoute'
import MainLayout from './layout/MainLayout'
import LoginPage from '../auth/login/LoginPage'
import DashboardPage from '../modules/dashboard/DashboardPage'
import StudentsList from '../modules/students/StudentsList'
import YearsList from '../modules/academic/YearsList'
import UsersList from '../modules/users/UsersList'
export function AppRoutes(){return(<Routes><Route path='/login' element={<LoginPage/>}/><Route element={<ProtectedRoute/>}><Route element={<MainLayout/>}><Route path='/' element={<DashboardPage/>}/><Route path='/students' element={<StudentsList/>}/><Route path='/academic/years' element={<YearsList/>}/><Route path='/users' element={<UsersList/>}/></Route></Route><Route path='*' element={<Navigate to='/' replace/>}/></Routes>)}
