import { Outlet, useLocation } from "react-router-dom";
import TopMenu from "@/components/common/top-menu";
import Footer from "../../components/common/footer";
import { ChatAI } from "@/components/common/ChatAI";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname != '/login' && location.pathname != '/cadastro';

  return (
    <>
      <TopMenu />
      <main className={isHome ? 'home-main' : undefined}>
        <Outlet />
      </main>
      <ChatAI />
      <Footer/>
    </>
  );
}