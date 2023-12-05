import { Input } from "@material-tailwind/react";


export default function SearchTextInput ({ label, value, icon, onChange }) {
    return (
        <div>
            <Input label={label} color="orange" icon={icon} onChange={onChange} />
        </div>
    );
};