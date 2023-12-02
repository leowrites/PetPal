import { useState } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    IconButton,
    Popover,
    PopoverHandler,
    PopoverContent
} from "@material-tailwind/react";
import { Formik, Form } from 'formik';
import TextInput from "../../../components/inputs/TextInput";
import SelectInput from "../../../components/inputs/SelectInput";
import { options } from "../../../constants/QuestionTypes";
import Subheading from '../../../components/layout/Subheading'
import { MdModeEdit } from 'react-icons/md';
import { FaRegTrashAlt } from "react-icons/fa";
import QuestionModal from "./QuestionModal";
import QuestionService from "../../../services/QuestionService";
import Button from "../../../components/inputs/Button";
import { Colors } from "../../../constants/Colors";

const EditQuestionModal = ({ open, handleOpen, questionObj, handleEditQuestion }) => {
    const initialValues = {
        question: questionObj.question,
        type: questionObj.type,
    }
    const onSubmit = (values) => {
        // get id from backend
        QuestionService.update(questionObj.id, values)
            .then(res => {
                handleEditQuestion(res.data)
                handleOpen(false)
            })
    }
    return (
        <QuestionModal open={open} handleOpen={handleOpen} title={'Edit Question'}>
            <Formik initialValues={initialValues}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="question">Question</label>
                        <TextInput label="Question" id="question" name="question" placeholder="Enter the question here..." required/>
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

export default function ({ questionObj, handleDelete, handleUpdate }) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const handleOpen = (open) => setOpen(open);
    const onDelete = (id) => {
        setDeleting(true)
        QuestionService.delete(id)
            .then(res => {
                handleDelete(questionObj.id)
                setDeleting(false)
            })
    }

    const handleEditQuestion = (questionObj) => {
        handleUpdate(questionObj)
    }

    return (
        <>
            <Card className={`w-full md:w-auto shadow-none border-2 border-[${Colors.subblack}]`}>
                <CardBody className='mb-0 pb-4'>
                    <p className='text-xl font-medium'>
                        {questionObj.question}
                    </p>
                </CardBody>
                <CardFooter className='pt-0'>
                    <div className="flex gap-2">
                        <IconButton size='md' className={`rounded-full bg-[${Colors.primary}]`} onClick={() => { handleOpen(true) }}>
                            <MdModeEdit />
                        </IconButton>
                        <Popover placement="bottom-start">
                            <PopoverHandler>
                                <IconButton size='md' className={`rounded-full bg-[${Colors.subblack}]`}>
                                    <FaRegTrashAlt />
                                </IconButton>
                            </PopoverHandler>
                            <PopoverContent>
                                <p className="inline mr-4">
                                    Are you sure you want to delete this question?
                                </p>
                                <Button onClick={() => { onDelete(questionObj.id) }} disabled={deleting}>
                                    <p>Delete</p>
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardFooter>
            </Card>
            <EditQuestionModal open={open} handleOpen={handleOpen} questionObj={questionObj} handleEditQuestion={handleEditQuestion} />
        </>
    )
}