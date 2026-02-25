import axios from "axios";
import { useState } from "react";

export default ({url, method, body}) => {
    const [errors, setErrors] = useState([]);

    const doRequest = async () => {
        try {
            setErrors([]);
            const response = await axios[method](url, body);
            return response.data;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h2>Oopss...</h2>
                    <ul className="my-0">
                        {err.response.data.errors.map((err) => <li key={err.message}>{err.message}</li>)}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
}
