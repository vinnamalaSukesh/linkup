import { UserButton } from "@clerk/nextjs";
import Head from "./(auth)/head";

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col" >
      <Head />
      <UserButton />
    </div>
  );
}
