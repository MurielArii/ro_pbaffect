import { Link, useLocation } from "react-router-dom";
import ThemeHandler from "./ThemeHandler";

const Navigation = () => {
    const location = useLocation();
    return (
        <div className="grid grid-cols-3">
            <div className="flex justify-start items-center">
                <h1 className="font-extrabold text-2xl first-letter:text-3xl">Probleme d'affectation</h1>
            </div>
            <div className="flex gap-3 justify-center items-center">
                <Link to={'/'} className={`btn btn-ghost group ${location.pathname === '/' && 'btn-active'}`}>
                    <span>Minimum</span>
                    <svg className="w-5 fill-current group-hover:scale-110 duration-100" viewBox="0 0 24 24">
                        <path d="m14 9.586-4 4-6.293-6.293-1.414 1.414L10 16.414l4-4 4.293 4.293L16 19h6v-6l-2.293 2.293z"></path>
                    </svg>
                </Link>
                <Link to={'/max'} className={`btn group btn-ghost ${location.pathname === '/max' && 'btn-active'}`}>
                    <span>Maximum</span>
                    <svg className="w-5 fill-current group-hover:scale-110 duration-100" viewBox="0 0 24 24">
                        <path d="m10 10.414 4 4 5.707-5.707L22 11V5h-6l2.293 2.293L14 11.586l-4-4-7.707 7.707 1.414 1.414z"></path>
                    </svg>
                </Link>
            </div>
            <div className="flex justify-end items-center">
                <ThemeHandler />
            </div>
        </div>
    )
}

export default Navigation