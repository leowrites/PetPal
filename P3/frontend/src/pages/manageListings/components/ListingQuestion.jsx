import React, { useEffect, useState } from 'react';
import Container from '../../../components/layout/Container';
import { Chip } from '@material-tailwind/react'
import Text from '../../../components/Text';
import ListingQuestionService from '../../../services/ListingQuestionService';
import Button from '../../../components/inputs/Button';
import { FaPen, FaTrash } from "react-icons/fa";
import { Dialog, DialogHeader, DialogBody } from '@material-tailwind/react'
import Heading from '../../../components/layout/Heading';


const ListingQuestion = ({ listingId, question, handleDelete, handleUpdate }) => {
    const [listingQuestion, setListingQuestion] = React.useState({})
    const [open, setOpen] = useState(false);
    const handleOpen = (open) => setOpen(open);

    useEffect(() => {
        ListingQuestionService.get(listingId, question.id)
        .then(res => {
            setListingQuestion(res.data)
        })
    }, [listingId, question.id])

    const handleUpdateRequired = () => {
        setListingQuestion({ ...listingQuestion, required: !listingQuestion.required })
        handleUpdate(listingId, question.id, { required: !listingQuestion.required })
    }

    return (
        <Container className='flex items-center justify-between px-2 py-2' key={question.id}>
            <div className="flex flex-row items-center gap-2">
                <Chip value={listingQuestion.question?.type} />
                <Text className="w-full py-2">{listingQuestion.question?.question}{listingQuestion.required && <span className="text-red-400">*</span>}</Text>
            </div>
            <div className="flex flex-row items-center gap-2">
                <button
                    className='rounded-lg bg-gray-400 text-white p-2 hover:opacity-80 transition duration-300'
                    onClick={() => handleOpen(true)}
                >
                    <FaPen />
                </button>
                <button
                    onClick={() => handleDelete(listingId, question.id)}
                    className='rounded-lg bg-red-400 text-white p-2 hover:opacity-80 transition duration-300'
                >
                    <FaTrash />
                </button>
            </div>


            <Dialog
                open={open}
                size={"sm"}
                handler={handleOpen}
            >
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <DialogHeader>
                        <Heading>
                            Edit listing question
                        </Heading>
                    </DialogHeader>
                </div>
                <DialogBody className="flex flex-col gap-2">
                    <Button
                        className="font-medium"
                        color="red"
                        onClick={handleUpdateRequired}
                    >
                        {listingQuestion.required ? 'Make question optional' : 'Make question required'}
                    </Button>
                </DialogBody>
            </Dialog>
        </Container>
    );
};

export default ListingQuestion;