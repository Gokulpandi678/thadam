import clsx from 'clsx'
import React from 'react'
import { textColors } from '../../../styles/theme'

const Header = ({
    title,
    description
}) => {
    return (
        <div>
            <h2 className={clsx('font-bold text-4xl', textColors.primary )}>
                {title}
            </h2>
            <p className='font-semibold text-lg text-gray-700'>
                {description}
            </p>
        </div>
    )
}

export default Header