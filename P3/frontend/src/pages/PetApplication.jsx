import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/inputs/Button'
import { PetOverviewPanel } from "../components/pet/common"
import PetDetailService from "../services/PetDetailService"
import { setAuthToken } from "../services/ApiService"


const PetImage = ({ src }) => {
    return (
        <div>
            <img
                src={src}
                alt=""
                className="w-full h-full object-cover pet-photo rounded-xl aspect-square"
            />
        </div>
    )
}


// TODO: update to formik fields
const PreconfiguredQuestions = (question) => {
    const questionString = question.question
    let inputConfig = {
        name: questionString,
        containerClass: 'md:col-span-3 pt-3',
        labelClass: 'block',
        inputClass: "w-full px-3 py-2 rounded-lg border-2 border-gray-200"
    }
    switch (question.type) {
        case 'EMAIL':
            inputConfig = {
                ...inputConfig,
                type: 'email',
                placeholder: 'me@petpal.com',
            }
            break
        case 'FILE':
            inputConfig = {
                ...inputConfig,
                type: 'file',
            }
            break
        case 'NUMBER':
            inputConfig = {
                ...inputConfig,
                type: 'number',
                placeholder: 0,
            }
            break
        case 'DATE':
            inputConfig = {
                ...inputConfig,
                type: 'date',
            }
            break
        case 'CHECKBOX':
            inputConfig = {
                ...inputConfig,
                type: 'checkbox',
                containerClass: 'flex md:col-span-6 pt-2',
                labelClass: `${inputConfig.labelClass} pr-4`,
                inputClass: ""
            }
            break
        default:
            inputConfig = {
                ...inputConfig,
                type: 'text',
                placeholder: 'Type your answer here',
            }
    }
    return (
        <div key={question.id} className={inputConfig.containerClass}>
            <label htmlFor={inputConfig.name} className={inputConfig.labelClass}>{inputConfig.name}</label>
            <input
                id={inputConfig.name}
                type={inputConfig.type}
                className={inputConfig.inputClass}
                placeholder={inputConfig.placeholder}
            />
        </div>
    )
}

const ApplicationForm = ({ petName, assignedQuestions }) => {
    return (
        <div
            className="order-3 md:order-2 md:col-span-2 md:row-span-3 pet-overview-box p-5 rounded-xl"
        >
            <p className="text-2xl min-w-full font-semibold">Adopt {petName}</p>
            <div className="grid md:grid-cols-6 w-full gap-3">
                {
                    assignedQuestions?.map((assignedQuestion) => {
                        return PreconfiguredQuestions(assignedQuestion.question)
                    })
                }
            </div>
            <Button>
                <p className="font-bold">
                    Submit
                </p>
            </Button>
        </div>
    )
}


export default function PetApplication() {
    const { listingId } = useParams()
    const [petDetail, setPetDetail] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
        // fetch pet details
        setAuthToken(localStorage.getItem('token'))
        PetDetailService.get(listingId)
            .then(res => {
                setPetDetail(res.data)
            })
            .catch(err => {
                if (err.response.status === 404) {
                    navigate('/404')
                }
                console.error(err)
            })
    }, [])
    const petListingOverview = {
        name: petDetail.name,
        listingTime: petDetail.listed_date,
        status: petDetail.status,
        shelter: petDetail.shelter?.shelter_name,
        breed: petDetail.breed,
        age: petDetail.age,
        description: petDetail.bio
    }
    return (
        <div className="order-1 grid md:grid-cols-3 gap-4 h-fit">
            <PetImage src={petDetail.image} />
            {
                petDetail.assigned_questions
                    ? <ApplicationForm petName={petListingOverview.name} assignedQuestions={petDetail.assigned_questions} />
                    : null
            }
            <div className="order-2 md:order-3 md:row-span-2 flex flex-col gap-1 p-5 rounded-xl pet-overview-box">
                <PetOverviewPanel petListingOverview={petListingOverview} />
            </div>
        </div>
    )
}