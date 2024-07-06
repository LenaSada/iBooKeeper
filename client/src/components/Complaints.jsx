import ExpandableButton from './ExpandableButton'
import { useState } from 'react';
import { downloadFile, sendComplaintResponse } from '../utils';
import MyDialog from './MyDialog';

const Complaints = ({ isOpen, closeWin, complaints }) => {
    const [expandedBtns, setExpandedBtns] = useState((new Array(complaints.length)).fill(false));
    const [responses, setResponses] = useState((new Array(complaints.length)).fill(''));
    const [timestamp, setTimestamp] = useState(Date.now());

    const formData = new FormData();

    const expandComplaint = (isExpanded, btnKey) => {
        const newExpandedBtns = [...expandedBtns];
        if (isExpanded) {
            newExpandedBtns[btnKey] = true;
        } else {
            newExpandedBtns[btnKey] = false;
        }
        setExpandedBtns(newExpandedBtns);
    }

    const modifyResponses = (value, index) => {
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    }

    const sendComplaintResponseHelper = async (user_id, response, complaint, index) => {
        try {
            const data = await sendComplaintResponse(user_id, response, complaint._id, formData);
            complaints.splice(index, 1);
            if (index < complaints.length) {
                responses[index] = '';
            }
            setTimestamp(Date.now());
        } catch (error) {
            console.log("Error sending complaint:", error);
        }
    }

    const handleFileChange = async (event) => {
        try {
            formData.append('file', event.target.files[0])
        } catch (error) {
            console.error('Error appending to formData:', error);
        }
    };

    return (
        <MyDialog isOpen={isOpen} closeWin={closeWin}>
            <div key={timestamp}>
                <h1 className='text-3xl'>Users complaints</h1>
                {complaints && complaints.map((complaint, index) => (
                    <div key={index} className='flex flex-col pt-5 '>
                        <ExpandableButton content={complaint.subject} onClickFunc={expandComplaint}
                            btnKey={index} expand={expandedBtns[index]} />
                        {expandedBtns[index] &&
                            <div className='m-3'>
                                <h1 className='font-semibold text-xl'>{complaint.subject}<br></br></h1>
                                <h1>{complaint.complaint}</h1>
                                <div>
                                    <button className='sign-in__btn'
                                        onClick={() => { downloadFile(complaint.file_path) }}>
                                        {complaint.file_path}
                                    </button>
                                </div>
                                <textarea
                                    value={responses[index]}
                                    onChange={(e) => modifyResponses(e.target.value, index)}
                                    className='bar__input m-2'
                                    rows={10}
                                    cols={50}
                                />
                                <input type='file' onChange={handleFileChange} />
                                <button
                                    className='rounded-full sign-in__btn min-h-[30px] min-w-[130px]'
                                    onClick={() => {
                                        sendComplaintResponseHelper(complaint.user, responses[index],
                                            complaints[index], index)
                                    }}
                                >Send Response</button>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </MyDialog>
    )
}

export default Complaints