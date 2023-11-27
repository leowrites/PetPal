import { Outlet, Link } from "react-router-dom"
import Footer from "./Footer"
import Page from './Page'
import Navbar from '../navigation/NavBar'

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