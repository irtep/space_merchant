import React from 'react';

const Footer: React.FC = (): React.ReactElement => {

    return (
        <div style={{
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage: "linear-gradient(to right, black, black, rgb(11, 11, 11), rgb(11, 11, 11), rgb(11, 11, 11), rgb(11, 11, 11), rgb(11, 11, 11)",
            color: "white",
            borderRadius: 2,
            margin: 1,
            padding: 1
        }}>

            <p>
                Version: 0.0.7
            </p>
        </div>
    );
}

export default Footer;