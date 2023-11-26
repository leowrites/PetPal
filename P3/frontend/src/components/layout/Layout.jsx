import { Outlet, Link } from "react-router-dom"
import Footer from "./Footer"
import Page from './Page'

// to be updated
const Navbar = () => {
    return (
        <header>
            <h1>Navbar</h1>
            <Link to={"/"}>Home</Link>
            <Link to={"listings/1"}>Pet Detail</Link>
        </header>
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