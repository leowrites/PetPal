import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-tailwind/react'
import { FaArrowUp, FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import PetApplicationCommentService from '../services/PetApplicationCommentService';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Message = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { applicationId } = useParams();
    const { user } = useUser();
    const divRef = useRef(null);
    const [totalMessages, setTotalMessages] = useState(0);
    const [currPage, setCurrPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        PetApplicationCommentService.list(applicationId)
            .then((res) => {
                setMessages(res.data.results);
                setTotalMessages(res.data.count);
                scrollToBottom();
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    navigate('/404')
                }
            });
    }, [applicationId, navigate])

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (message === '') {
            return
        }
        PetApplicationCommentService.create(applicationId, message)
            .then((res) => {
                setMessages([...messages, res.data]);
                setMessage('');
                setTotalMessages(totalMessages + 1);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const scrollToBottom = () => {
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight
        }
    }

    const scrollToTop = () => {
        if (divRef.current) {
            divRef.current.scrollTop = 0
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        scrollToTop()
    }, [currPage]);

    const loadMoreMessages = () => {
        PetApplicationCommentService.list(applicationId, currPage + 1)
            .then((res) => {
                setMessages([...messages, ...res.data.results]);
                setCurrPage(currPage + 1);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="min-h-screen w-full left-0 fixed">
            <div ref={divRef} className="lg:px-48 px-8 flex flex-col gap-1 overflow-auto h-[80vh] pb-36" style={{overflowAnchor: 'auto'}}>
                {
                    messages.length < totalMessages && (
                        <div className="flex flex-row gap-2 items-baseline w-full justify-center">
                            <Button className="rounded-full w-64 flex flex-row items-center justify-center gap-4 mb-4" size="sm" onClick={loadMoreMessages}>
                                <FaArrowUp />
                                Load Earlier Messages
                            </Button>
                        </div>
                    )
                }
                {
                    messages.sort((a, b) => (new Date(a.date_created)) > (new Date(b.date_created)) ? 1 : -1).map((message, i) => (
                        <div className="flex flex-col gap-0" key={i}>
                            {/* {
                                message.user !== user.id && (
                                    <p className="pl-4">{message.user}</p>
                                )
                            } */}
                            <div className={`
                                rounded-tl-2xl
                                rounded-tr-2xl
                                ${message.user !== user.id ? 'rounded-br-2xl' : 'rounded-bl-2xl'}
                                ${message.user !== user.id ? 'bg-gray-200' : 'bg-blue-400 text-white'}
                                ${message.user !== user.id ? '' : 'ml-auto'}
                                px-4
                                py-2
                                lg:w-2/3
                                w-full
                                break-words
                            `}>
                                {message.text}
                            </div>
                            <p className={`text-xs ${message.user !== user.id ? 'text-gray-500' : 'text-blue-400 ml-auto'} pl-4`}>
                                {(new Date(message.date_created)).toLocaleTimeString('en-US', {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    ))
                }
            </div>
            <div className="fixed bottom-0 w-full lg:px-48 px-8 pb-20 pt-2 bg-white">
                <form
                    noValidate
                    className="flex flex-row gap-2 items-baseline w-full"
                    onSubmit={handleSendMessage}
                >
                    <input
                        type="text"
                        label="Send message"
                        placeholder='Send message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="rounded-full w-full px-6 py-2 border-2 border-gray-800 focus:outline-orange-400"
                        containerprops={{
                        className: "min-w-0",
                        }}
                    />

                    <Button
                        className="flex items-center gap-3 rounded-full px-4 py-3.5"
                        onClick={handleSendMessage}
                        type='submit'
                    >
                        <FaPaperPlane />
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Message;