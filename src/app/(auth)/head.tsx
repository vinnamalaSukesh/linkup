'use client'

import { Great_Vibes } from "next/font/google";
export const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" })
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

const Head = () => {
    const {theme,setTheme} = useTheme()
    return (
        <div className="flex items-center h-[8vh] justify-around shadow-[0px_0px_10px_black] dark:shadow-[0px_0px_10px_white] w-full">
            <Image src={'/logo.png'} alt="logo" width={80} height={40} />
            <p className={`text-3xl ${greatVibes.className}`}>linkup</p>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shadow-[0px_0px_10px_black] dark:shadow-[0px_0px_10px_white] rounded-full w-[35px] h-[35px] bg-black dark:bg-white">
            { theme === "dark" ?
                <Sun className="text-yellow-500 m-auto "/>
              : <Moon className="m-auto text-white"/>
            }
            </button>
        </div>
    )
}
export default Head