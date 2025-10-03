import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
export default function MainLayout(){return(<div className='min-h-screen bg-gray-50 text-gray-900'><Topbar/><div className='flex'><Sidebar/><main className='flex-1 p-6 max-w-6xl mx-auto w-full'><Outlet/></main></div></div>)}
