import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url, body);

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (err) {
            const responseErrors = err?.response?.data?.errors;
            setErrors(
                <div className="alert alert-danger">
                    <h2>Oopss...</h2>
                    <ul className="my-0">
                        {responseErrors
                            ? responseErrors.map((err) => <li key={err.message}>{err.message}</li>)
                            : <li>Something went wrong. Please try again.</li>}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
}
