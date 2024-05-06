import { Outlet } from "react-router-dom";
import Navigation from "./Navigation"

const Layout = () => {
  return (
    <div className="space-y-5 overflow-y-hidden">
      <div className="p-[1%]">
        <Navigation />
      </div>
      <div className="px-[3%]">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout