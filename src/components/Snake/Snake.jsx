import s from './Snake.module.scss';
import useStore from '../../utils/store.jsx';

const Snake = ({ data, direction }) => {
    const getHeadRotation = () => {
        switch (direction.current) {
            case "UP":
                return "270";
            case "DOWN":
                return "90";
            case "LEFT":
                return "180";
            case "RIGHT":
                return "0";
        }
    };

    const getTailRotation = (prevSegment, currentSegment) => {
        if (prevSegment[1] > currentSegment[1]) return '90'; // up
        if (prevSegment[1] < currentSegment[1]) return '270'; // down
        if (prevSegment[0] > currentSegment[0]) return '0'; // left
        if (prevSegment[0] < currentSegment[0]) return '180'; // right
        return '0';
    };

    const getStyle = (dot, i) => {
        let background = null;
        let transform = null;

        if (data[data.length - 1] === dot) {
            background = `url('/head.png') 0 0`;

            let headRotate = '';
            headRotate = getHeadRotation();
            transform = `translate(${dot[0]}px, ${dot[1]}px) rotate(${headRotate}deg)`;
        } else if (i === 0) {
            background = `url('/tail.png') 0 0`;

            let tailRotate = '';
            tailRotate = getTailRotation(data[i + 1], dot);
            transform = `translate(${dot[0]}px, ${dot[1]}px) rotate(${tailRotate}deg)`;
        
        } else {
            background = `url('/skin.jpg') ${10 * i}px 0px`;
            transform = `translate(${dot[0]}px, ${dot[1]}px)`;
        }

        const style = {
            transform: transform,
            background: background
        }
        return style;
    }

    return (
       <>
            {data.map((dot, i)=>(
                <div 
                    key={i} 
                    className={s.snakeDot} 
                    style={ getStyle(dot, i) }
                ></div>
            ))}
       </>
    );
}

export default Snake;