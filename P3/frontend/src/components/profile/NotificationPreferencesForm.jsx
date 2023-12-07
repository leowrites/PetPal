import { Form, Formik, Field } from 'formik';
import Text from '../Text'
import Button from '../inputs/Button'

export default function NotificationPreferencesForm({ user, initialValues, onSubmit, notification }) {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize>
            {({ isSubmitting }) => (
                <Form>
                    <div className="mt-3 flex flex-col justify-start items-start w-full">
                        {notification && <Text color='text-[#ff9447]'>{notification}</Text>}
                        {user.is_shelter ? (
                            <>
                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                    <Field type="checkbox" name="application_message" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                    Application Messages
                                </label>
                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                    <Field type="checkbox" name="application_status_change" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                    Application Status Changes
                                </label>
                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                    <Field type="checkbox" name="review" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                    New Reviews
                                </label>
                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                    <Field type="checkbox" name="application" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                    New Applications
                                </label>
                            </>
                        ) : (
                            <>
                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                    <Field type="checkbox" name="application_message" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                    Application Messages
                                </label>
                                <label className="flex items-center font-medium text-lg mb-2">
                                    <Field type="checkbox" name="application_status_change" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                    Application Status Changes
                                </label>
                                <label className="flex items-center font-medium text-lg mb-2">
                                    <Field type="checkbox" name="pet_listing" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                    New Pet Listings
                                </label>
                            </>
                        )}
                        <Button className='mt-6' type='submit' disabled={isSubmitting}>Submit</Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}