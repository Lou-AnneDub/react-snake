import React from 'react';
import s from './StartScreen.module.scss';

const StartScreen = ({ onStart }) => {
    return (
        <div className={s.startScreen}>
            <h1>Welcome to the Snake Game</h1>
            <button onClick={onStart}>Start Game</button>
        </div>
    );
};

export default StartScreen;