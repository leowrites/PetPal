import { Link } from "react-router-dom"
import Button from "../components/inputs/Button"

export default function () {
    return (
        <div>
            <div>
                Listings
            </div>
            <Link to='/questions'>
                <Button>
                    Manage Questions
                </Button>
            </Link>
        </div>
    )
}