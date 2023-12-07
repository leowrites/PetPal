import {
    Dialog,
    DialogHeader,
    DialogBody,
} from "@material-tailwind/react";

export default function QuestionModal({ open, handleOpen, title, children }) {
    return (<Dialog
        open={open}
        size={"sm"}
        handler={handleOpen}
    >
        <DialogHeader>{title}</DialogHeader>
        <DialogBody className="pt-0">
            {children}
        </DialogBody>
    </Dialog>)
}
