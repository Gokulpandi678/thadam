import { TextButton } from "../../../../ui/atoms/button/Button";
import FormField from "./FormField";
import FormSection from "./FormSection";
import MeetingLog from "./MeetingLog";
import ProfilePicture from "./ProfilePicture";
import RoleSelect from "./RoleSelect";

const FullContactForm = ({
    form,
    errors,
    handleChange,
    onSubmit,
    logChange,
    logErrors,
    log,
    submitLabel = "Save Contact",
    profileFile,
    setProfileFile,
    existingProfileUrl,
}) => {
    const formData = (key) => ({
        value: form[key],
        onChange: (val) => handleChange(key, val),
        error: errors[key],
    });

    const isAddForm = submitLabel === "Save Contact";

    return (
        <div className="flex flex-col gap-3">

            <div className={`${isAddForm ? 'flex' : 'flex-col'} gap-4`}>

                <div className="flex flex-col flex-1 gap-3">
                    <FormSection title="Personal Info">
                        <FormField label="First Name" {...formData("firstName")} required />
                        <FormField label="Last Name" {...formData("lastName")} />
                        <FormField label="Primary Email" type="email" {...formData("primaryEmail")} />
                        <FormField label="Secondary Email" type="email" {...formData("secondaryEmail")} />
                        <FormField label="Primary Contact" type="tel" {...formData("primaryContactNo")} />
                        <FormField label="Secondary Contact" type="tel" {...formData("secondaryContactNo")} />
                        <ProfilePicture
                            file={profileFile}
                            setFile={setProfileFile}
                            existingUrl={existingProfileUrl}
                        />
                    </FormSection>

                    <FormSection title="Address">
                        <FormField label="Street" {...formData("addressStreet")} />
                        <FormField label="Number" {...formData("addressNumber")} />
                        <FormField label="City" {...formData("addressCity")} />
                        <FormField label="State" {...formData("addressState")} />
                        <FormField label="Postcode" {...formData("addressPostcode")} />
                        <FormField label="Country" {...formData("addressCountry")} />
                    </FormSection>


                </div>

                <div className="flex flex-col flex-1 gap-3">
                    <FormSection title="Work">
                        <FormField label="Company" {...formData("company")} />
                        <RoleSelect
                            value={form.role}
                            onChange={handleChange}
                            error={errors.role}
                        />
                        <FormField label="Designation" {...formData("designation")} />
                    </FormSection>

                    <FormSection title="Social Profiles">
                        <FormField label="LinkedIn" type="url" {...formData("socialLinkedin")} />
                        <FormField label="Twitter" type="url" {...formData("socialTwitter")} />
                        <FormField label="YouTube" type="url" {...formData("socialYoutube")} />
                    </FormSection>

                    <FormSection title="Other">
                        <FormField label="Last Contacted Date" type="date" {...formData("lastContactedDate")} />
                        <FormField label="Referred By" {...formData("referredBy")} />
                    </FormSection>
                    {isAddForm && (
                        <MeetingLog
                            log={log}
                            errors={logErrors}
                            handleChange={logChange}
                        />
                    )}

                </div>

            </div>

            <div className="flex justify-end pt-1">
                <TextButton
                    onClick={onSubmit}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium cursor-pointer"
                >
                    {submitLabel}
                </TextButton>
            </div>

        </div>
    );
};

export default FullContactForm;