import { useEffect, useState } from 'react';
import useStore from '../../utils/store';
import s from './Toggle.module.scss';


const Toggle = ({ mode }) => {
    const {mode: storeMode, addMode, removeMode} = useStore();

    const handleClick = () => {
        if(storeMode.includes(mode)) {
            removeMode(mode);
        } else {
            addMode(mode);
        }
    };

    const firstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className={s.wrapper} onClick={() => handleClick()}>
            <div className={`${s.toggle} ${storeMode.includes(mode) === true ? s.toggle_active : ""}`}>
                <div 
                    className={`${s.switch} ${storeMode.includes(mode) === true ? s.switch_active : ""}`}
                ></div>
            </div>
            <span className={s.mode}>{firstLetter(mode)}</span>
        </div>
    )
}

export default Toggle;