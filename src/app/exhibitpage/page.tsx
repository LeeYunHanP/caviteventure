import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import ZenTry from "@/components/zentrihero/zentrihero"
import AboutCav from "@/components/zentrihero/aboutcav"
import Features from "@/components/zentrihero/features"
import Story from "@/components/zentrihero/story"
import Contact from "@/components/zentrihero/contact"


export default async function ExhibitPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  if (!token) {
    redirect("/signin");
  }

  await dbConnect();
  const userId = await getUserIdByToken(token!);
  if (!userId) {
    redirect("/signin");
  }

  return (
    <div>
      <main>
    
        <ZenTry />
        <AboutCav />
        <Features />
        <Story />
        <Contact />
        
      </main>
    </div>
  );
}
