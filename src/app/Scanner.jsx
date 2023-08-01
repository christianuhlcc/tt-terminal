'use client'

import { useState } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({handleNameChange}) => {
    const [result, setResult] = useState("");
    const { ref } = useZxing({
        onResult(result) {
            setResult(result.getText());
            const event = {
                target: {
                    value: parseInt(result.getText(),10)
                }
            }
            handleNameChange(event)
        },
    });

    return (
        <video width={'200px'} height={'200px'} ref={ref} />
    );
};