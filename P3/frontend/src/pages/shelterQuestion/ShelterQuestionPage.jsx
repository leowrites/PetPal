import Heading from "../../components/layout/Heading";
import Button from "../../components/inputs/Button";
import { useEffect, useState } from "react";
import QuestionService from "../../services/QuestionService";
import { setAuthToken } from "../../services/ApiService";
import QuestionCard from './components/QuestionCard'
import QuestionModal from "./components/QuestionModal";
import { Formik, Form } from 'formik';
import TextInput from "../../components/inputs/TextInput";
import SelectInput from "../../components/inputs/SelectInput";
import { options } from "../../constants/QuestionTypes";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import Page from "../../components/layout/Page";


const NewQuestionModal = ({ open, handleOpen, handleAddQuestion }) => {
    const navigate = useNavigate()
    const initialValues = {
        question: '',
        type: 'TEXT',
    }
    const onSubmit = (values) => {
        // get id from backend
        QuestionService.create(values)
            .then(res => {
                handleAddQuestion(res.data)
                handleOpen(false)
            })
    }
    return (
        <QuestionModal open={open} handleOpen={handleOpen} title={'Create a Question'}>
            <Formik initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="question">Question</label>
                        <TextInput label="Question" id="question" name="question" placeholder="Enter the question here..." required />
                        <div className='pt-3'>
                            <label htmlFor="type">Type</label>
                            <div>
                                <SelectInput name='type' options={options} />
                            </div>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className={'mt-4'}>Submit</Button>
                    </Form>
                )}
            </Formik>
        </QuestionModal>
    )
}

const SkeletonArray = () => {
    return (
        <>
            {
                Array.from({ length: 5 }, (_, i) => <Skeleton className='mr-2 mb-2' width='15rem' height='8rem' key={i} inline />)
            }
        </>
    )
}

export default function () {
    const [open, setOpen] = useState(false);
    const handleOpen = (open) => setOpen(open);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleAddQuestion = (questionObj) => {
        setQuestions([...questions, questionObj])
    }
    const handleDelete = (id) => {
        setQuestions(questions.filter(questionObj => questionObj.id !== id))
    }

    const handleUpdate = (questionObj) => {
        setQuestions(questions.map(question => question.id === questionObj.id ? questionObj : question))
    }

    useEffect(() => {
        QuestionService.list()
            .then(res => {
                setQuestions(res.data.results)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <Page>
            <div className='mb-5'>
                <Heading>
                    Your Question Repository
                </Heading>
            </div>
            <div>
                <Button onClick={() => handleOpen(true)}>
                    Add
                </Button>
            </div>
            <div className='flex flex-wrap gap-4 mt-6 '>
                {
                    loading && <SkeletonArray />
                }
                {
                    questions?.map(questionObj => <QuestionCard key={questionObj.id} questionObj={questionObj} handleDelete={handleDelete}
                        handleUpdate={handleUpdate} />)
                }
            </div>
            <NewQuestionModal open={open} handleOpen={handleOpen} handleAddQuestion={handleAddQuestion} />
        </Page>
    )
}