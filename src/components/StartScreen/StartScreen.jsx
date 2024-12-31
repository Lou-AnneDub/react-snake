import React from 'react';
import s from './StartScreen.module.scss';

const StartScreen = ({ onStart }) => {
    return (
        <div className={s.startScreen}>
            <h1>Bienvenue sur le snake ! </h1>
            <button onClick={onStart}>Commencer</button>
        </div>
    );
};

export default StartScreen;