'use client'

import { useState } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({handleNameChange}) => {
    const { ref } = useZxing({
        onResult(result) {
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