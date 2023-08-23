import '../css/HeaderForm.css'
import Logo from "./Logo";
export default function HeaderForm() {
    return (
        <>
            {/*Start Header*/}
            <div id="header">
                <div className="grid wide">
                    <div className="row header--align">
                        <div className="header__left">
                            {/*LOGO*/}
                            <Logo/>
                            {/*    */}
                        </div>

                        <div className="header_help">
                            <span>Bạn cần giúp đỡ?</span>
                        </div>
                    </div>
                </div>
            </div>
            {/*End Header*/}
        </>
    )
}