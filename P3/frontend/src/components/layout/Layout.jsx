import { Outlet, Link } from "react-router-dom"
import Footer from "./Footer"
import Navbar from '../navigation/NavBar'

export default function Layout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}