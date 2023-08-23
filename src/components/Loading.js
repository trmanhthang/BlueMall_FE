import '../css/Loading.css'
export default function Loading() {
    return(
        <>
            <div className="modal__loading">
                <div className="modal__loading-background">
                    <div className="modal__loading-text">F</div>
                </div>
                <div className="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    )
}