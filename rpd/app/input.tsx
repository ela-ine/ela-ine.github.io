import { useState } from 'react';

export default function Submit({ initialValue, handleSubmit }) {
    const [val, setVal] = useState(initialValue || '');
    
    // Event handler to capture input value
    const handleInputChange = (event) => {
        setVal(event.target.value);
    };
    
    // Event handler to handle form submission
    const onSubmit = (event) => {
        event.preventDefault()
        console.log('onsubmit', event);
        handleSubmit(val);
        // setVal('');
    };
    
    return (
        <form onSubmit={onSubmit}>
                <input type="text" value={val} onChange={handleInputChange} />
                <button type="submit">Submit</button>
        </form>
    );
}