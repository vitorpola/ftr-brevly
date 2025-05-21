import brevlyLogo from "../assets/logotipo.svg";
import { LinkForm } from "../components/link_form";
import { MyLinksCard } from "../components/my_links_card";
import { LinksProvider } from "../contexts/LinksContext";

export function Home() {
  return (
    <main className="w-full">
      <div className="mb-6 text-center lg:text-left">
        <img src={brevlyLogo} alt="Brevly" className="flex w-24 " />
      </div>
      <div className="">
        <LinksProvider>
          <LinkForm />
          <MyLinksCard />
        </LinksProvider>
      </div>
    </main>
  )
}
