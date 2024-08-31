import MyDialog from './MyDialog';
import { useState } from 'react';
import { sendComplaint } from '../utils';
import Alert from '@mui/material/Alert';

const SendComplaint = ({ isOpen, closeWin, user }) => {
    const [complaintSubject, setComplaintSubject] = useState('');
    const [complaintTxt, setComplaintTxt] = useState('');
    const formData = new FormData();
    const [isSent, setIsSent] = useState(false);

    const handleFileChange = async (event) => {
        try {
            formData.append('file', event.target.files[0])
        } catch (error) {
            console.error('Error appending to formData:', error);
        }
    };

    const handleSubmit = async (file) => {
        try {
            const data = await sendComplaint(user, complaintSubject, complaintTxt, formData);
            if (data === 'Saved') {
                setIsSent(true);
            } else {

            }
        } catch (error) {
            console.error('Error sending complaint:', error);
        }
    };

    return (
        <MyDialog isOpen={isOpen} closeWin={closeWin}>
            {!isSent &&
                <>
                    <h1 className='text-3xl'>What's your inquiry?</h1>
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
                </>
            }
            {isSent &&
                <>
                    <Alert className='flex justify-center items-center'
                        severity="success">Inquiry Sent.</Alert>
                    <button onClick={() => { setIsSent(false) }}>Send New Inquiry</button>
                </>
            }
        </MyDialog>
    )
}

export default SendComplaint