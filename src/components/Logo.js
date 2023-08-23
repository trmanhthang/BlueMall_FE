import '../css/Logo.css'
import {Link} from "react-router-dom";
export default function () {
    return(
        <>
            {/*LOGO*/}
            <Link to={"/"} className="header__logo">
                <i className="logo-icon fa-solid fa-cloud">
                    <span className="logo-icon__text">f</span>
                </i>
                <span className="header_logo--text">FCBlue Mall</span>
            </Link>
            {/*    */}
        </>
    )
}