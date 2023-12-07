import { Link } from "react-router-dom";
import Button from "../components/inputs/Button"
import Page from "../components/layout/Page";

export default function NotFound() {
    return (
        <Page>
            <div className="flex flex-col items-center justify-start pt-20 md:pt-40 h-screen text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Ruh Roh! You seem to be lost.
                </h1>
                <p className="mb-2 text-lg text-gray-600">
                    Click here to go back to the home page:
                </p>
                <Link to="/" >
                    <Button className=''>
                        <p className="text-sm w-fit font-extrabold">Home</p>
                    </Button>
                </Link>
            </div>
        </Page>
    )
}
