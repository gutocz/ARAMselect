import React, { useEffect, useState } from 'react';
import api from '../services/api';

const HelloWorld = () => {
    const [message] = useState('');

    useEffect(() => {
        api.get('/')
            .then((response) => console.log(response.data))
            .catch((error) => console.error(error));
    }, []);

    return <div>{message}</div>;
};

export default HelloWorld;
