import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from 'react-router-dom'
import Button from '../components/inputs/Button'
import { PetOverviewPanel } from "../components/pet/common"
import PetDetailService from "../services/PetDetailService"
import { setAuthToken } from "../services/ApiService"
import { Formik, Form, Field } from 'formik'
import PetApplicationService from "../services/PetApplicationService"
import { Select, Option } from "@material-tailwind/react";
import Skeleton from 'react-loading-skeleton'
import Page from "../components/layout/Page"
import { useUser } from "../contexts/UserContext"

const PetImage = ({ src }) => {
    return (
        <div>
            <img
                src={src ? src[0] : '/logo_dark_mode.svg'}
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

const SkeletonArray = () => {
    return (
        <>
            {
                Array.from({ length: 5 }, (_, i) => <Skeleton className='mr-2 mb-2 box-content' height='2rem' key={i} inline />)
            }
        </>
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
                        answers?.length === 0 ?
                            <div className="col-span-6 mt-3">
                                <p className="text-lg">No questions answered for {petName}!</p>
                            </div>
                            : answers?.map((answer) => {
                                const assignedQuestion = answer.question
                                return PreconfiguredQuestions(assignedQuestion.question, assignedQuestion.required, completed, answer)
                            })
                    }
                </div>
            </Form>
        </Formik>
    )
}

const SuccessMessage = ({ petName, redirectUrl }) => {
    return (
        <div className="flex flex-col gap-2 h-full">
            <p className="text-2xl min-w-full font-semibold">Your Application for {petName}</p>
            <div className="flex flex-col h-full items-center sm:px-10 justify-center gap-2 my-10">
                <img src="../assets/check_icon.png" alt="" className="w-10" />
                <p className="text-lg">
                    Thank you for expressing your interest in adopting {petName}!
                </p>
                <Link to={redirectUrl}>
                    <button
                        className="text-white py-2 px-10 rounded-full enabled-button mt-5 w-fit hover:opacity-[85%] transition duration-300"
                    >
                        <p className="text-sm w-fit">View my application</p>
                    </button>
                </Link>
            </div>
        </div>)
}

const WriteOnlyQuestions = ({ petName, assignedQuestions, listingId, completed }) => {
    const [success, setSuccess] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState('')
    const onSubmit = (values, { setSubmitting }) => {
        PetApplicationService.post(listingId, values)
            .then((res) => {
                console.log(res)
                setSubmitting(false)
                setRedirectUrl(`/applications/${res.data.id}`)
                setSuccess(true)
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
        <>
            {
                success ?
                    <SuccessMessage petName={petName} redirectUrl={redirectUrl} /> :
                    <Formik
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <p className="text-2xl min-w-full font-semibold">Adopt {petName}</p>
                                <div className="grid md:grid-cols-6 w-full gap-3 mb-4">
                                    {
                                        // if there are no questions, display a message
                                        assignedQuestions?.length === 0
                                            ?
                                            <div className="col-span-6 mt-3">
                                                <p className="text-lg">No questions to answer for {petName}!</p>
                                            </div>
                                            : assignedQuestions?.map((assignedQuestion) => {
                                                return PreconfiguredQuestions(assignedQuestion.question, assignedQuestion.required, completed)
                                            })
                                    }
                                </div>
                                {
                                    <Button type='submit' disabled={isSubmitting} className='mt-4'>
                                        <p className="font-bold">
                                            Submit
                                        </p>
                                    </Button>
                                }
                            </Form>
                        )}
                    </Formik>
            }
        </>
    )
}

const ApplicationForm = ({ petName, assignedQuestions, listingId, completed, answers }) => {
    return (
        <>
            {
                completed ?
                    <ReadOnlyQuestions petName={petName} assignedQuestions={assignedQuestions} completed={completed} answers={answers} /> :
                    <WriteOnlyQuestions petName={petName} assignedQuestions={assignedQuestions} listingId={listingId} completed={completed} />
            }
        </>
    )
}


export default function PetApplication({ completed }) {
    const { listingId, applicationId } = useParams()
    const [petDetail, setPetDetail] = useState({})
    const [application, setApplication] = useState({})
    const [loading, setLoading] = useState(true)
    const [statusLoading, setStatusLoading] = useState(false)
    const { user } = useUser()
    const navigate = useNavigate()
    // should check if the user already aoplied for this pet
    // if they have redirect them to their application page
    // for shelters, they should be able to view the application too
    useEffect(() => {
        // fetch pet details
        if (completed) {
            // retrieve completed pet application
            PetApplicationService.get(applicationId)
                .then(res => {
                    console.log(res.data)
                    setPetDetail(res.data.listing)
                    setApplication(res.data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    navigate('/404')
                })
        }
        else {
            PetDetailService.get(listingId)
                .then(res => {
                    setPetDetail(res.data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    navigate('/404')
                })
        }
    }, [listingId, applicationId, completed, navigate])
    const petListingOverview = {
        name: petDetail.name,
        listingTime: petDetail.listed_date,
        status: petDetail.status,
        shelter: petDetail.shelter?.shelter_name,
        breed: petDetail.breed,
        age: petDetail.age,
        description: petDetail.bio
    }

    const handleStatusChange = (val) => {
        // check if old status is the same as the new status
        if (val === application.status) {
            return
        }
        setStatusLoading(true)
        PetApplicationService.update(applicationId, { status: val })
            .then(res => {
                console.log(res)
                setStatusLoading(false)
                setApplication(res.data)
            })
            .catch(err => {
                setStatusLoading(false)
                console.error(err)
            })
    }

    const shelterAction = () => {
        return (
            <div>
                <p className="mb-4 text-lg">
                    Update the application status:
                </p>
                <div className='w-72'>
                    <Select size='md' label="update status" onChange={handleStatusChange} value={application.status} disabled={statusLoading}>
                        <Option value="pending">Pending</Option>
                        <Option value="denied">Denied</Option>
                        <Option value="approved">Approved</Option>
                    </Select>
                </div>
            </div>
        )
    }
    const userAction = () => {
        return (
            <div>
                <div className='pb-3'>
                    Your application status is: {application.status}
                </div>
                {
                    application.status === 'pending' &&
                    <Button disabled={statusLoading} onClick={() => { handleStatusChange('withdrawn') }}>
                        Withdraw
                    </Button>
                }
                {
                    application.status === 'approved' &&
                    <Button disabled={statusLoading} onClick={() => { handleStatusChange('accepted') }}>
                        Accept
                    </Button>
                }
            </div>
        )
    }

    return (
        <Page>
            <div className='my-5'>
                {
                    user.is_shelter ? shelterAction() : userAction()
                }
            </div>
            <div className="order-1 grid md:grid-cols-3 gap-4 h-fit">
                <PetImage src={petDetail.images} />
                <div className="order-3 md:order-2 md:col-span-2 md:row-span-3 pet-overview-box p-5 rounded-xl">
                    {
                        loading && <SkeletonArray />
                    }
                    {
                        petDetail.assigned_questions
                            ? <ApplicationForm petName={petListingOverview.name}
                                assignedQuestions={petDetail.assigned_questions}
                                listingId={listingId} completed={completed} answers={application.application_responses} />
                            : null
                    }
                </div>
                <div className="order-2 md:order-3 md:row-span-2 flex flex-col gap-1 p-5 rounded-xl pet-overview-box">
                    <PetOverviewPanel petListingOverview={petListingOverview} loading={loading} />
                </div>
            </div>
        </Page>
    )
}