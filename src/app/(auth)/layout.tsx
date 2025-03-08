import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import Head from "./head"

export default function Authlayout({children,} : Readonly<{children : React.ReactNode}>){
    return(
        <>
            <Head />
            <ClerkLoading>
                <div className="flex items-center justify-center w-full h-[85vh] font-bold">
                    <p>Loading...</p>
                    <p>I am using free resources so will be late</p>
                </div>
            </ClerkLoading>
            <ClerkLoaded>
                {children}
            </ClerkLoaded>
            <div className="bg-blue-950 text-white flex items-center justify-center gap-20 h-[7vh] font-bold">
                <p>Designed by Sukesh reddy</p>
                <a href="https://drive.google.com/file/d/1gKppyefblkWvFldvjb43u80mtl6ta7dX/view?usp=drivesdk">My resume</a>
            </div>
        </>
    )
}


