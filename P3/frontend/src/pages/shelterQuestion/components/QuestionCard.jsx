import { useState } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    IconButton
} from "@material-tailwind/react";
import Subheading from '../../../components/layout/Subheading'
import { MdModeEdit } from 'react-icons/md';
import { FaRegTrashAlt } from "react-icons/fa";
import QuestionModal from "./QuestionModal";
import QuestionService from "../../../services/QuestionService";

export default function ({ questionObj, handleDelete }) {
    const [open, setOpen] = useState(false);
    const [deleting , setDeleting] = useState(false); 
    const handleOpen = (open) => setOpen(open);
    const onDelete = (id) => {
        setDeleting(true)
        QuestionService.delete(id)
        .then(res => {
            handleDelete(questionObj.id)
            setDeleting(false)
        })
    }

    return (
        <>
            <Card className="mt-6">
                <CardBody className='mb-0 pb-4'>
                    <Subheading>
                        {questionObj.question}
                    </Subheading>
                </CardBody>
                <CardFooter className='pt-0'>
                    <div className="flex gap-2">
                        <IconButton size='md' className='rounded-full' onClick={() => { handleOpen(true) }}>
                            <MdModeEdit />
                        </IconButton>
                        <IconButton size='md' className='rounded-full' onClick={() => { onDelete(questionObj.id) }} disabled={deleting}>
                            <FaRegTrashAlt />
                        </IconButton>
                    </div>
                </CardFooter>
            </Card>
            <QuestionModal open={open} handleOpen={handleOpen} title={'Edit Question'}>
                Hello
            </QuestionModal>
        </>
    )
}