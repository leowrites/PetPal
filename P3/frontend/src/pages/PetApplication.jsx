import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/inputs/Button'
import { PetOverviewPanel } from "../components/pet/common"
import PetDetailService from "../services/PetDetailService"
import { setAuthToken } from "../services/ApiService"
import { Formik, Form, Field } from 'formik'
import PetApplicationService from "../services/PetApplicationService"

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

const PreconfiguredQuestions = (question, required, completed, answer) => {
    let inputConfig = {
        question: question.question,
        name: question.id,
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
            <label htmlFor={inputConfig.question} className={inputConfig.labelClass}>{inputConfig.question}</label>
            <Field
                id={inputConfig.question}
                name={inputConfig.name}
                type={inputConfig.type}
                className={inputConfig.inputClass}
                placeholder={
                    completed ? answer.answer :
                    inputConfig.placeholder
                }
                required={required}
                disabled={completed}
                checked={completed ? answer.answer : null}
            />
        </div>
    )
}

const ReadOnlyQuestions = ({ petName, completed, answers }) => {
    console.log(answers)
    return (
        <Formik>
            <Form>
                <p className="text-2xl min-w-full font-semibold">Adopt {petName}</p>
                <div className="grid md:grid-cols-6 w-full gap-3">
                    {
                        answers?.map((answer) => {
                            const assignedQuestion = answer.question
                            return PreconfiguredQuestions(assignedQuestion.question, assignedQuestion.required, completed, answer)
                        })
                    }
                </div>
            </Form>
        </Formik>
    )
}

const WriteOnlyQuestions = ({ petName, assignedQuestions, listingId, completed }) => {
    const onSubmit = (values, { setSubmitting }) => {
        PetApplicationService.post(listingId, values)
            .then((res) => {
                console.log(res)
                setSubmitting(false)
            })
            .catch(err => {
                console.error(err)
                setSubmitting(false)
            })
    }
    const initialValues = assignedQuestions.reduce((acc, curr) => {
        acc[curr.question.id] = ''
        return acc
    }, {})
    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={initialValues}
        >
            {({ isSubmitting }) => (
                <Form>
                    <p className="text-2xl min-w-full font-semibold">Adopt {petName}</p>
                    <div className="grid md:grid-cols-6 w-full gap-3">
                        {
                            assignedQuestions?.map((assignedQuestion) => {
                                return PreconfiguredQuestions(assignedQuestion.question, assignedQuestion.required, completed)
                            })
                        }
                    </div>
                    {
                        <Button type='submit' disabled={isSubmitting}>
                            <p className="font-bold">
                                Submit
                            </p>
                        </Button>
                    }
                </Form>
            )}
        </Formik>
    )
}

const ApplicationForm = ({ petName, assignedQuestions, listingId, completed, answers }) => {
    return (
        <div className="order-3 md:order-2 md:col-span-2 md:row-span-3 pet-overview-box p-5 rounded-xl">
            {
                completed ?
                    <ReadOnlyQuestions petname={petName} assignedQuestions={assignedQuestions} completed={completed} answers={answers}/> :
                    <WriteOnlyQuestions petname={petName} assignedQuestions={assignedQuestions} listingId={listingId} completed={completed} />
            }
        </div>
    )
}


export default function PetApplication({ completed }) {
    const { listingId, applicationId } = useParams()
    const [petDetail, setPetDetail] = useState({})
    const [applicationResponse, setApplicationResponse] = useState([{}])
    const navigate = useNavigate()
    // should check if the user already aoplied for this pet
    // if they have redirect them to their application page
    useEffect(() => {
        // fetch pet details
        setAuthToken(localStorage.getItem('token'))
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
        if (completed) {
            // retrieve completed pet application
            PetApplicationService.get(applicationId)
                .then(res => {
                    console.log(res.data)
                    setPetDetail(res.data.listing)
                    setApplicationResponse(res.data.application_responses)
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        navigate('/404')
                    }
                    console.error(err)
                })
        }
        else {
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
        }
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
                    ? <ApplicationForm petName={petListingOverview.name}
                        assignedQuestions={petDetail.assigned_questions}
                        listingId={listingId} completed={completed} answers={applicationResponse} />
                    : null
            }
            <div className="order-2 md:order-3 md:row-span-2 flex flex-col gap-1 p-5 rounded-xl pet-overview-box">
                <PetOverviewPanel petListingOverview={petListingOverview} />
            </div>
        </div>
    )
}