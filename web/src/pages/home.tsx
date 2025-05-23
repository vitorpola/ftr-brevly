import brevlyLogo from "../assets/logotipo.svg";
import { LinkForm } from "../components/link_form";
import { MyLinksCard } from "../components/my_links_card";

export function Home() {
  return (
    <main className="w-full">
      <div className="px-4 pb-4 pt-8 text-center lg:text-left max-w-5xl mx-auto">
        <img src={brevlyLogo} alt="Brevly" className="w-24 inline" />
      </div>
      <div className="p-3 flex items-start flex-col gap-3 lg:flex-row lg:gap-4 max-w-5xl mx-auto">
        <LinkForm />
        <MyLinksCard />
      </div>
    </main>
  )
}
