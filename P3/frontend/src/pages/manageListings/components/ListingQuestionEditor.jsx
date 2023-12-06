import React, { useEffect, useState } from 'react';
import QuestionService from "../../../services/QuestionService";
import ListingQuestionService from '../../../services/ListingQuestionService';
import Container from '../../../components/layout/Container';
import { Dialog, DialogHeader, DialogBody } from '@material-tailwind/react'
import Text from '../../../components/Text';
import Button from '../../../components/inputs/Button';
import { Link } from 'react-router-dom';
import ListingQuestion from './ListingQuestion';
import Heading from '../../../components/layout/Heading';

const ListingQuestionEditor = ({ listingId }) => {
    const [questions, setQuestions] = React.useState([])
    const [listingQuestions, setListingQuestions] = React.useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = (open) => setOpen(open);

    useEffect(() => {
        QuestionService.list()
        .then(res => {
            setQuestions(res.data.results)
        })
        .catch(err => console.log(err))

        ListingQuestionService.list(listingId)
        .then(res => {
            setListingQuestions(res.data.results)
        })
    }, [listingId])

    const handleDelete = (listingId, questionId) => {
        ListingQuestionService.delete(listingId, questionId)
        .then(res => {
            setListingQuestions(listingQuestions.filter(listingQuestion => listingQuestion.id !== questionId))
        })
    }

    const handleUpdate = (listingId, questionId, data) => {
        ListingQuestionService.update(listingId, questionId, data)
        .then(res => {
            setListingQuestions(listingQuestions.map(listingQuestion => listingQuestion.id === questionId ? res.data : listingQuestion))
        })
    }

    return (
        <div className='flex flex-col gap-2'>
            {
                listingQuestions.map(question => (
                    <ListingQuestion key={question.id} listingId={listingId} question={question} handleDelete={handleDelete} handleUpdate={handleUpdate} />
                ))
            }
            <Button onClick={handleOpen} className="mt-4">Add Question</Button>

            <Dialog
                open={open}
                size={"sm"}
                handler={handleOpen}
            >
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <DialogHeader >
                        <Heading>Add a Question</Heading>
                    </DialogHeader>
                    <Link to='/questions'>
                        <Button className='font-xs mr-4 font-bold'>Edit question repository</Button>
                    </Link>
                </div>
                <DialogBody className="flex flex-col gap-2">
                    {
                        questions
                        .filter(question => !listingQuestions.map(listingQuestion => listingQuestion.question).includes(question.id))
                        .map(question => (
                            <Container className='flex items-center justify-between px-4 py-1' key={question.id}>
                                <Text className="w-full py-2">{question.question}</Text>
                                <Button onClick={() => ListingQuestionService.create(listingId, question.id).then(res => setListingQuestions([...listingQuestions, res.data]))}>Add</Button>
                            </Container>
                        ))
                    }
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default ListingQuestionEditor;