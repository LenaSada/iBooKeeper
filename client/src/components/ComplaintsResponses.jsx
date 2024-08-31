import ExpandableButton from './ExpandableButton'
import { useState } from 'react';
import { downloadFile, sendComplaintResponse } from '../utils';
import MyDialog from './MyDialog';

const ComplaintsResponses = ({ isOpen, closeWin, complaintsResponses, isAccountant = false }) => {
    const [expandedBtns, setExpandedBtns] = useState((new Array(complaintsResponses.length)).fill(false));
    const [timestamp, setTimestamp] = useState(Date.now());

    const [search, setSearch] = useState('');

    const expandComplaintResponse = (isExpanded, btnKey) => {
        const newExpandedBtns = [...expandedBtns];
        if (isExpanded) {
            newExpandedBtns[btnKey] = true;
        } else {
            newExpandedBtns[btnKey] = false;
        }
        setExpandedBtns(newExpandedBtns);
    }

    return (
        <MyDialog isOpen={isOpen} closeWin={closeWin}>
            <div key={timestamp}>
                <h1 className='text-3xl'>Responses</h1>
                <input
                    type='text'
                    value={search}
                    className='bar__input m-2'
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search for inquiry by User Name'
                />
                {complaintsResponses && complaintsResponses.map((response, index) => (
                    <>
                        {(!search.trim() || response.user_name.toLowerCase().includes(search.toLowerCase())) &&
                            <div key={index} className='flex flex-col pt-5 '>
                                <ExpandableButton content={`${response.complaint_subject} - ${response.date.split('T')[0]}`}
                                    onClickFunc={expandComplaintResponse} btnKey={index} expand={expandedBtns[index]} />
                                {expandedBtns[index] &&
                                    <div className='m-3'>
                                        {isAccountant &&
                                            <h1 className='font-semibold text-xl'>User Name: {response.user_name}<br></br></h1>}
                                        <h1 className='font-semibold text-xl'>{response.complaint_subject}<br></br></h1>
                                        <p>{response.complaint}</p>
                                        <div>
                                            <button className='sign-in__btn'
                                                onClick={() => { downloadFile(response.complaint_file_path) }}>
                                                {response.complaint_file_path}
                                            </button>
                                        </div>
                                        <br></br>
                                        <h1 className='font-semibold text-xl'>Response:<br></br></h1>
                                        <p>{response.response}</p>
                                        <div>
                                            <button className='sign-in__btn'
                                                onClick={() => { downloadFile(response.file_path) }}>
                                                {response.file_path}
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </>
                ))}
            </div>
        </MyDialog>
    )
}

export default ComplaintsResponses