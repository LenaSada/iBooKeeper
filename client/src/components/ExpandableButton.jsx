import React, { useState } from 'react'

const ExpandableButton = ({ content, onClickFunc, btnKey, expand }) => {
    const [isExpanded, setIsExpanded] = useState(expand);

    const buttonClicked = () => {
        onClickFunc(!isExpanded, btnKey);
        setIsExpanded(!isExpanded);
    }

    return (
        <button className="flex items-center justify-between 
        pl-5 pb-2 pr-5 w-full rounded-full complaint__btn text-2xl" 
        onClick={buttonClicked}>
            <div>
                {content}
            </div>
            <div>
                {isExpanded ? <h1>&#9660;</h1> : <h1 className='text-3xl'>&#9658;</h1>}
            </div>
        </button>
    )
}

export default ExpandableButton