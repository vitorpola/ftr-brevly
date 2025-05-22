import brevlyLogo from "../assets/logotipo.svg";
import { LinkForm } from "../components/link_form";
import { MyLinksCard } from "../components/my_links_card";
import { Toast } from "../components/toast";

export function Home() {
  return (
    <main className="w-full">
      <div className="mb-6 text-center lg:text-left">
        <img src={brevlyLogo} alt="Brevly" className="flex w-24" />
      </div>
      <div className="">
        <LinkForm />
        <MyLinksCard />
        <Toast />
      </div>
    </main>
  )
}
