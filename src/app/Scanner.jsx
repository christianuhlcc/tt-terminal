'use client'

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
      <div className="relative-video-container">
        <video width={"300px"} height={"300px"} ref={ref} />
        <p className="video-overlay">Scan your QR code here</p>
      </div>
    );
};