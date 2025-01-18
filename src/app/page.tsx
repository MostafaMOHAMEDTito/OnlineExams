import { getServerSession } from "next-auth";
import Dashboard from "./OnlineExams/page";
import { OPTIONS } from "./auth";
import SideNav from "./_components/sideNav/page";

export default async function Home() {
  // get token
  const session = await getServerSession(OPTIONS);
  const token = session?.token;

  return (
    <>
      <main>
        <section className={!token ? "hidden" : "flex relative"}>
          <SideNav />
        </section>
        <section className="p-4 sm:ml-64 w-[1063]">
          <Dashboard />
        </section>
      </main>
    </>
  );
}
