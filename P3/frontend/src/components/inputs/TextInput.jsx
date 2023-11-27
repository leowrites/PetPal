import { Field } from 'formik';


export default function TextInput({ label, id, name, placeholder, className, type="text", validate=null }) {
    return (
        <Field id={id} name={name} placeholder={placeholder}
            class={`rounded border-[#898989] border-[.1rem] p-[.5rem] w-[10rem] focus:outline-none ${className}`} type={type} validate={validate} />
    )
}