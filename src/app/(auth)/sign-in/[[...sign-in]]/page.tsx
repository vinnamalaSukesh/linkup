
import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
    <div className='h-[90vh] w-full flex items-center justify-center mt-[10vh]'>
        <SignIn />
    </div>
)}