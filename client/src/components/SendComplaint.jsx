import MyDialog from './MyDialog';
import { useState } from 'react';
import { sendComplaint } from '../utils';

const SendComplaint = ({ isOpen, closeWin, user }) => {
    const [complaintSubject, setComplaintSubject] = useState('');
    const [complaintTxt, setComplaintTxt] = useState('');
    const formData = new FormData();

    const sendComplaintHelper = async () => {

    }

    const handleFileChange = async (event) => {
        try {
            formData.append('file', event.target.files[0])
        } catch (error) {
            console.error('Error appending to formData:', error);
        }
    };

    const handleSubmit = async (file) => {
        try {
            await sendComplaint(user, complaintSubject, complaintTxt, formData);
        } catch (error) {
            console.error('Error sending complaint:', error);
        }
    };

    return (
        <MyDialog isOpen={isOpen} closeWin={closeWin}>
            <h1 className='text-3xl'>What's your complaint?</h1>
            <input
            type='text'
            value={complaintSubject}
            className='bar__input m-2'
            onChange={(e) => setComplaintSubject(e.target.value)}
         />
            <textarea
                value={complaintTxt}
                className='bar__input m-2'
                rows={10}
                cols={50}
                onChange={(e) => setComplaintTxt(e.target.value)}
            />
            <input type='file' onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload</button>
        </MyDialog>
    )
}

export default SendComplaint