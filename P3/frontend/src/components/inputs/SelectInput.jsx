import { Field } from 'formik';
export default function SelectInput({ options, name, onChange, ...rest }) {
    return (
        <Field as='select' className="rounded border-[#898989] border-[.1rem] p-[.5rem] w-[10rem] focus:outline-none"
            name={name} {...rest}>
            {
                options?.map((option) => (
                    <option value={option.value} key={option.value}>{option.label}</option>
                ))
            }
        </Field>
    )
}