import { Field } from 'formik';
export default function SelectInput({ options, onChange }) {
    return (
        <Field as='select' className="rounded border-[#898989] border-[.1rem] p-[.5rem] w-[10rem] focus:outline-none">>
            {
                options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))
            }
        </Field>
    )
}