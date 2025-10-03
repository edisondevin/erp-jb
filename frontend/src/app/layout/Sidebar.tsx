import { NavLink } from 'react-router-dom'
import RequirePermission from '../guard/RequirePermission'
import { useAuth } from '../../auth/AuthProvider'
const Item=({to,label}:{to:string;label:string})=>(<NavLink to={to} className={({isActive})=>`block px-3 py-2 rounded-md text-sm ${isActive?'bg-gray-200':'hover:bg-gray-100'}`}>{label}</NavLink>)
export default function Sidebar(){const{hasRole}=useAuth();return(<aside className='w-60 p-4 border-r bg-white min-h-[calc(100vh-56px)]'><div className='mb-4 font-bold'>ERP JB</div><Item to='/' label='Inicio'/><RequirePermission perm='academic.students.read.school'><Item to='/students' label='Estudiantes'/></RequirePermission><Item to='/academic/years' label='Años Académicos'/>{hasRole('SUPER_ADMIN')&&<Item to='/users' label='Usuarios'/>}</aside>)}
