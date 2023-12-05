import Page from "../components/layout/Page"
import { useUser } from "../contexts/UserContext"
import UserApplicationList from "./applicationList/UserApplicationList"
import ShelterApplicationList from "./applicationList/ShelterApplicationList"


export default function PetApplicationList() {
    const { user } = useUser();
    const View = user.role === "shelter" ? "Shelter" : "User";
    return (
        <Page>
            {
                user.is_shelter ?
                    <ShelterApplicationList />
                    :
                    <UserApplicationList />
            }
        </Page>
    )
}