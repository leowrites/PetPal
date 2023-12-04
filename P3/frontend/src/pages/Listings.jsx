import { Link } from "react-router-dom"
import Button from "../components/inputs/Button"
import Page from "../components/layout/Page"

export default function () {
    return (
        <Page>
            <div>
                Listings
            </div>
            <Link to='/questions'>
                <Button>
                    Manage Questions
                </Button>
            </Link>
        </Page>
    )
}