import { useParams, useLocation, Link, Outlet } from 'react-router-dom'

export default function () {
    const { applicationId } = useParams()
    const selectedTab = useLocation().pathname.split('/')[3];

    return (
        <>
            <div className="flex flex-row gap-6 pb-5 items-baseline">
                <Link
                    className={`font-semibold hover:border-b-[.5rem] hover:border-[#290005] hover:pb-[.6rem] ${selectedTab !== "comments" ? "border-b-[.5rem] py-[0.6rem] tab-selected" : ""}`}
                    to={`/applications/${applicationId}`}
                >
                    Application
                </Link>
                <Link
                    className={`font-semibold hover:border-b-[.5rem] hover:border-[#290005] hover:pb-[.6rem] ${selectedTab === "comments" ? "border-b-[.5rem] py-[0.6rem] tab-selected" : ""}`}
                    to={`/applications/${applicationId}/comments`}>
                    Shelter Message
                </Link>
            </div>
            <Outlet />
        </>
    )
}