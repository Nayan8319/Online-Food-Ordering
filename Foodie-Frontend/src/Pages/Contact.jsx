import React, { useEffect } from 'react';
import ContactSection from '../Components/ContactSection';


const Contact = () => {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, []);


    return (
        <>
            <div className='mt-5'>
                <ContactSection />

            </div>

        </>
    );
};

export default Contact;