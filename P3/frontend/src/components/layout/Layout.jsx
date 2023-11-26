import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import Page from './Page'

// to be updated
const Navbar = () => {
    return (
        <div>
            <h1>Navbar</h1>
        </div>
    )
}
export default function Layout() {
    return (
        <>
            <Navbar />
            <Page>
                <Outlet />
            </Page>
            <Footer />
        </>
    )
}