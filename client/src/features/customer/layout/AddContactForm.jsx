import React, { useContext, useState } from 'react'
import { CustomerContext } from '../../../context/CustomerContext';
import { useFullContactForm } from '../../../hooks/useFullContactForm';
import { useMeetingLogs } from '../../../hooks/useMeetingLogs';
import FullContactForm from '../component/form/FullContactForm';
import { useAddProfilePic } from '../../../service/useCustomerApi';

const AddContactForm = () => {
    const { createNewCustomer } = useContext(CustomerContext);
    const { form, errors, handleChange, validate, reset } = useFullContactForm();
    const { log, errors: logErrors, handleChange: logChange, getLogsPayload, reset: resetLog } = useMeetingLogs();
    const [profileFile, setProfileFile] = useState(null);

    const { mutateAsync: addProfilePic } = useAddProfilePic();

    const handleSubmit = async () => {
        if (!validate()) return;

        const logsPayload = getLogsPayload();
        if (logsPayload === null) return;

        const payload = {
            ...form,
            ...(logsPayload ? { logs: logsPayload } : {}),
        };

        try {
            const customer = await createNewCustomer(payload);
            console.log(profileFile)
            console.log(customer)
            if (profileFile) {
                await addProfilePic({
                    id: customer?.data?.result?.id,
                    file: profileFile
                });
            }

            reset();
            resetLog();
            setProfileFile(null);

        } catch (err) {
            console.error(err);
        }
    };

    console.log(form)

    return (
        <div className="h-[84vh] overflow-y-auto flex flex-col gap-6 p-2">
            {/* <div>
                <h3 className="text-2xl font-bold">Detailed Contact Form</h3>
                <p className="text-gray-600">Create a contact with all details</p>
            </div> */}
            <FullContactForm
                form={form}
                errors={errors}
                handleChange={handleChange}
                onSubmit={handleSubmit}
                submitLabel="Save Contact"
                log={log}
                logErrors={logErrors}
                logChange={logChange}
                setProfileFile={setProfileFile}
                profileFile={profileFile}
            />

        </div>
    )
}

export default AddContactForm