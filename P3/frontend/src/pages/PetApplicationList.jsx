import Page from "../components/layout/Page"
import { useUser } from "../contexts/UserContext"
import ShelterApplicationList from "./applicationList/ShelterApplicationList"


export default function PetApplicationList() {
    return (
        <Page>
            <ShelterApplicationList />
        </Page>
    )
}