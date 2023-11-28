import Heading from "../../components/layout/Heading";
import Button from "../../components/inputs/Button";
import { useEffect } from "react";
import QuestionService from "../../services/QuestionService";
import { setAuthToken } from "../../services/ApiService";

export default function () {
    useEffect(() => {
        setAuthToken(localStorage.getItem("token"))
        QuestionService.list()
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }, [])
    return (
        <div>
            <Heading>
                Your Question Repository
            </Heading>
            <Button>
                New
            </Button>
        </div>
    )
}