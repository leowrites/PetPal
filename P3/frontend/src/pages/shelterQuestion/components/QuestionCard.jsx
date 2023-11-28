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

export default function ({ questionObj }) {
    const [open, setOpen] = useState(false);
    const handleOpen = (open) => setOpen(open);

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
                        <IconButton size='md' className='rounded-full'>
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