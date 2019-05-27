import React, { Component } from 'react';

import './Logo.css'

import logoimg from './inventlogo_white.png';

class Logo extends Component {
    render() {
        return(
            <div className="Logo">
                <img src={logoimg} alt="Invent logo" />
            </div>
        )
    }
}

export default Logo;