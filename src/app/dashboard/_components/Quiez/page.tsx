import Image from "next/image";
import Link from "next/link";
import { getServerSession, Session } from "next-auth";
import { OPTIONS } from "@/app/auth";
import { JSON_HEADER } from "@/lib/constants/api.constants";


export default async function Quiez() {
  const { token } = (await getServerSession(OPTIONS)) as Session;

  const getAllQuiez = await fetch(process.env.API + "/subjects", {
    headers: { ...JSON_HEADER, token },
  });

  if (!getAllQuiez.ok) {
    console.error("Failed to fetch quizzes:", getAllQuiez.statusText);
    return <p>Failed to load quizzes. Please try again later.</p>;
  }

  const data = await getAllQuiez.json();


  const subjects: subjects = data.subjects;

  // Render subjects
  return (
    <section className="w-[1063] mx-auto">
      <h3 className="text-maincolor font-bold text-2xl mb-6 ">Quizzes</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {subjects?.map(
          (subject: { _id: string; name: string; icon?: string }) => (
            <Link
              href={"/dashboard/quizHistory"}
              key={subject._id}
              className="relative sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)] box-border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <Image
                width={400}
                height={400}
                src={subject.icon || "/placeholder.jpg"}
                alt={subject.name || "No Title"}
                className="w-full h-auto rounded-t-lg object-cover"
              />
              <div className="bg-blue-400/45 p-3 rounded-b-lg absolute top-3/4 inset-x-5 w-3/4 flex items-center justify-center">
                <h2 className="text-white text-center text-lg font-bold">
                  {subject.name || "Untitled"}
                </h2>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
