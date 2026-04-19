import { useContext, useState } from 'react'
import { useSmartContactFormData } from '../../../../../hooks/useSmartContactFormData'
import { X } from 'lucide-react';
import { TextButton } from '../../../../../ui/atoms/button/Button';
import clsx from 'clsx';
import { bgColors } from '../../../../../styles/theme';
import MappedFieldsTable from './MappedFieldsTable';
import { CustomerContext } from '../../../../../context/CustomerContext';

const SmartFormPanel = () => {
    const {
        smartFormTokens,
        addToken,
        removeToken,
        errorMsg,
        inputRef,
        getMappedFields
    } = useSmartContactFormData();

    const { createNewCustomer } = useContext(CustomerContext);

    const [mappedFields, setMappedFields] = useState([]);

    const handleMapToFields = () => {
        setMappedFields(getMappedFields());
    };

    const handleUpdate = (key, value) => {
        setMappedFields(prev => ({ ...prev, [key]: value }));
    };

    const handleDelete = (key) => {
        setMappedFields(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    return (
        <div className='flex flex-col gap-5'>

            <div>
                <h3 className='text-2xl font-bold'>Smart Contact Form</h3>
                <p className='text-gray-600'>Create a contact in 3 seconds with either name, email, phone, linkedin</p>
            </div>

            <textarea
                ref={inputRef}
                className='w-full border-2 rounded p-2'
                onKeyDown={(e) => addToken(e)}
            />
            {
                errorMsg && <p className='text-red-600'>{errorMsg}</p>
            }
            <div>
                <ul className='flex gap-2 flex-wrap'>
                    {
                        smartFormTokens.map((token, i) => (
                            <li
                                key={token.value + "_" + i}
                                className={clsx('py-1 px-2 w-max rounded-2xl text-sm flex gap-1 items-center text-white', bgColors.primary)}
                            >
                                <span>{token.field} : {token.value}</span>
                                <X size={15} onClick={() => removeToken(i)} className='cursor-pointer' />
                            </li>
                        ))
                    }
                </ul>
            </div>

            {
                smartFormTokens.length > 0 && <TextButton onClick={handleMapToFields}>Map to fields</TextButton>
            }

            <MappedFieldsTable
                mappedFields={mappedFields}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />

            {
                Object.keys(mappedFields).length > 0 && <TextButton onClick={() => createNewCustomer(mappedFields)}>Add Contact</TextButton>
            }

        </div>
    )
}

export default SmartFormPanel