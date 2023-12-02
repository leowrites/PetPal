import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export default function ({ open, handleOpen, title, children }) {
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
