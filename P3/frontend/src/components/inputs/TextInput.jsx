import { Field } from 'formik';


export default function TextInput({ label, id, name, placeholder, className, type="text", validate=null, ...rest }) {
    return (
        <Field id={id} name={name} placeholder={placeholder}
            className={`rounded border-[#898989] border-[.1rem] p-[.5rem] w-full focus:outline-none ${className}`} type={type} validate={validate} 
            {...rest}
            />
    )
}