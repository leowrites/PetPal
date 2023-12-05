import React, { useEffect, useState, useRef } from 'react';
import Page from '../components/layout/Page';
import Container from '../components/layout/Container';
import { Input, Button } from '@material-tailwind/react'
import { FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import PetApplicationCommentService from '../services/PetApplicationCommentService';
import { useUser } from '../contexts/UserContext';
import UserDetailService from '../services/UserDetailService';

const Message = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { applicationId } = useParams();
    const { user } = useUser();
    const divRef = useRef(null);

    useEffect(() => {
        PetApplicationCommentService.list(applicationId)
            .then((res) => {
                setMessages(res.data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [applicationId])

    const handleSendMessage = () => {
        PetApplicationCommentService.create(applicationId, message)
            .then((res) => {
                setMessages([...messages, res.data]);
                setMessage('');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight
        }
    }, [messages]);

    return (
        <div className="min-h-screen w-full left-0 fixed">
            <div ref={divRef} className="lg:px-48 px-8 flex flex-col gap-1 overflow-auto h-[80vh] pb-36" style={{overflowAnchor: 'auto'}}>
                {
                    messages.sort((a, b) => (new Date(a.date_created)) > (new Date(b.date_created)) ? 1 : -1).map((message) => (
                        <div className="flex flex-col gap-0">
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
            <div className="fixed bottom-20 w-full lg:px-48 px-8">
                <div className="flex flex-row gap-2 items-baseline w-full">
                    <input
                        type="text"
                        label="Send message"
                        placeholder='Send message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="rounded-full w-full px-6 py-2 border-2 border-gray-800"
                        containerProps={{
                        className: "min-w-0",
                        }}
                    />

                    <Button
                        className="flex items-center gap-3 rounded-full px-4 py-3.5"
                        onClick={handleSendMessage}
                    >
                        <FaPaperPlane />
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Message;