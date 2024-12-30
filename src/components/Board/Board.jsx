/* --- Problème détecté --- */
// Lorsqu'on active un mode avant de lancer la partie, le snake bug 
// Mais si on active un mode après avoir lancé la partie, le snake ne bug pas
// J'ai tout de même laisser le code en commentaire pour que vous puissiez voir ce que j'ai essayé de faire

import { useEffect, useState, useRef } from "react"; 
import gsap from "gsap";
import Snake from "../Snake/Snake";
import Item from "../Item/Item";
import GameOver from "../GameOver/GameOver";
import PauseScreen from "../PauseScreen/PauseScreen";
//import StartScreen from "../StartScreen/StartScreen";
import s from "./Board.module.scss";
import { defaultControles, flashUser, generateRandomCoordinates, triggerMode, reversedControles, wizz, netherPortal } from "../../utils/utils";
import useStore from "../../utils/store";

const Board = () => {
        const { mode, removeMode} = useStore();

        const [gamePaused, setGamePaused] = useState(false);

        // const [startScreen, setStartScreen] = useState(true);
        const [isRestarting, setIsRestarting] = useState(false);

        const[snakeData, setSnakeData] = useState([
            [0, 0],
            [10, 0],
        ]);

        const [trapArray, setTrapArray] = useState([]);
        const [foodArray, setFoodArray] = useState([]);
        const [bonusArray, setBonusArray] = useState([]);
        const [bombArray, setBombArray] = useState([]);

        const [gameOver, setGameOver] = useState(false);
        const [speed, setSpeed] = useState(0.2);
        const [score, setScore] = useState(0);
        const [highScore, setHighScore] = useState(() => {
            return localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
        });

        const timer = useRef(0);
        const foodTimer = useRef(0);
        const trapTimer = useRef(0);
        const bonusTimer = useRef(0);
        const direction = useRef("RIGHT");
        const canChangeDirection = useRef(true);

        const gameIsOver = () => {
            gsap.ticker.remove(gameLoop);
            setGameOver(true);

            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("highScore", score);
            }
        };

        /*const handleStart = () => {
            setStartScreen(false);
            gsap.ticker.add(gameLoop);
        };*/

        const isOutOfBorder = (head) => {
            if(head[0] >= 500 || head[1] >= 500 || head[0] < 0 || head[1] < 0){
                return true;
            } else {
                return false;
            }
        };

        const hasEatenItem = ({ getter, setter }) => {
            const head = snakeData[snakeData.length - 1];
        
            // comparer les coordonnées de la tête du snake avec LES item
            const item = getter.find(
              (_item) => _item.x === head[0] && _item.y === head[1]
            );
        
            if (item) {
              // si y'a match on renvoie true
              // mettre à jour le tableau des items disponibles
              const newItemArray = getter.filter((_item) => _item !== item);
        
              setter(newItemArray);
        
              return true;
            } else {
              return false;
            }
        };
        

        const moveSnake = () => {
            let newSnakeData = [...snakeData];
            let head = newSnakeData[newSnakeData.length - 1];

            switch (direction.current) {
                case 'UP':
                    head = [head[0], head[1] - 10];
                    break;
                case 'DOWN':
                    head = [head[0], head[1] + 10];
                    break;
                case 'LEFT':
                    head = [head[0] - 10, head[1]];
                    break;
                case 'RIGHT':
                    head = [head[0] + 10, head[1]];
                    break;
            
                default:
                    break;
            }

            newSnakeData.push(head);
            newSnakeData.shift();

            const snakeCollapsed = hasCollapsed(head);
            const outOfBorder = isOutOfBorder(head);
            const snakeAteFood = hasEatenItem({
                getter: foodArray,
                setter: setFoodArray,
            });
            const snakeAteTrap = hasEatenItem({
                getter: trapArray,
                setter: setTrapArray,
            });
            const snakeAteBonus = hasEatenItem({
                getter: bonusArray,
                setter: setBonusArray,
            });

            if(outOfBorder || snakeCollapsed) {
                gameIsOver();
            } else {
                if(snakeAteTrap === true) {
                    const effects = [flashUser, triggerMode, wizz, netherPortal];

                    const selectedEffect =
                      effects[Math.floor(Math.random() * effects.length)];
            
                    selectedEffect();
                }

                if (snakeAteFood === true) {
                    //agrandir le snake
                    newSnakeData.unshift([]);
                    setScore(score + 1);

                    if(speed > 0.05) {
                        setSpeed(speed - 0.02);
                    }
                }

                if (snakeAteBonus === true && score > 10) {
                    setSpeed(speed + 0.02);
                    setScore(score + 2);
                }

                setSnakeData(newSnakeData);

            }
        };

        const hasCollapsed = (head) => {
            let snake = [...snakeData];

            // retire la dernière case du tableau
            snake.pop();

            //comparer les coordonnées de head avec les autres points du snake
            for (let i = 0; i < snake.length; i++) {
                if(head[0] === snake[i][0] && head[1] === snake[i][1]) {
                    return true;
                }
            }

            return false;
        };
        
        
        const onKeyDown = (e) => {
            // Empêcher les actions inutiles si le jeu est terminé
            if (gameOver) {
                if (e.keyCode === 13) { // Entrée
                    replay();
                }
                return; // Bloquer toutes les autres touches
            }

            if (gamePaused) {
                if (e.keyCode === 32) { // Espace
                    setGamePaused(false);
                }
                if (e.keyCode === 13) { // Entrée
                    replay();
                }
                return; // Bloquer toutes les autres touches
            }
        
            if (!canChangeDirection.current) return;
            canChangeDirection.current = false;
        
            if (mode.includes("reversed")) {
                reversedControles(e, direction, gamePaused, setGamePaused, replay, gameOver);
            } else {
                defaultControles(e, direction, gamePaused, setGamePaused, replay, gameOver);
            }
        };
        

        const addItem = ({getter, setter}) => {
            const coordinates = generateRandomCoordinates(mode);
            const array = [...foodArray, ...trapArray, ...bonusArray];

            //test pour savoir si un item est déjà existant à cet endroit
            const itemAlreadyExistsHere = array.some(
            (item) => item.x === coordinates.x && coordinates.y === item.y
            );

            // si ça existe déjà, rappeler la fonction
            if (itemAlreadyExistsHere) {
            addItem({ getter, setter });
            return;
            }
            
            setter((oldArray) => [...oldArray, coordinates]);
        };

        const gameLoop = (time, deltaTime, frame) => {
            timer.current += deltaTime * 0.001;
            foodTimer.current += deltaTime * 0.001;
            trapTimer.current += deltaTime * 0.001;
            bonusTimer.current += deltaTime * 0.001;


            if(gamePaused || gameOver){
                return;
            } else {
                if (mode.includes("impossible") && timer.current > 0.02) {
                    // Mode impossible avec une vitesse très rapide
                    timer.current = 0;
                    moveSnake();
                    canChangeDirection.current = true;
                } else if (timer.current > speed) {
                    timer.current = 0;
                    moveSnake();
                    canChangeDirection.current = true;
                }

                // Gestion de l'apparition de la nourriture
                if(foodTimer.current > 2 && foodArray.length < 5) {
                    foodTimer.current = 0;
                    addItem({ 
                        getter: foodArray, 
                        setter: setFoodArray 
                    });
                }

                // Gestion de l'apparition des pièges
                if(trapTimer.current > 3 && trapArray.length < 5) {
                    trapTimer.current = 0;
                    addItem({
                        getter: trapArray, 
                        setter: setTrapArray
                    });
                }

                // Gestion de l'apparition des bonus
                if (score > 10 && bonusArray.length < 1 && bonusTimer.current > 10) {
                    bonusTimer.current = 0;
                    addItem({
                        getter: bonusArray,
                        setter: setBonusArray,
                    });
                }
            }
        };

        const replay = () => {
            if (isRestarting) return; // Empêche les appels multiples et donc le bug si on clique rapidement sur les touches en mourant.
            setIsRestarting(true);

            setGameOver(false);
            setGamePaused(false);
            setSpeed(0.2);
            setScore(0);

            setSnakeData([
                [0, 0],
                [10, 0]
            ]);
            setFoodArray([]);
            setTrapArray([]);
            setBonusArray([]);

            direction.current = "RIGHT";
            timer.current = 0;
            foodTimer.current = 0;

            // Débloque après un court délai
            setTimeout(() => setIsRestarting(false), 500);
        };

        const quitPause = () => {
            setGamePaused(false);
        }


        useEffect(() => {
            window.addEventListener("keydown", onKeyDown);
        
            gsap.ticker.add(gameLoop);

            /*if(!startScreen) {
                gsap.ticker.add(gameLoop);
            } else {
                gsap.ticker.remove(gameLoop);
            }*/

            return () => {
                window.removeEventListener("keydown", onKeyDown);
                gsap.ticker.remove(gameLoop);
            };
        }, [snakeData, gamePaused, gameOver]);
        
        
        
        
    

    return (
        <>
            {/* startScreen && <StartScreen onStart={handleStart} /> */}

            {/* !startScreen && (
                <>*/}
                    {gameOver ? <GameOver replay={replay} /> : gamePaused ? <PauseScreen quitPause={quitPause} replay={replay} /> : null}
                    <div id="board" className={s.board}>
                        <Snake data={snakeData} direction={direction} />

                        <span className={s.score}>Score: {score}</span>
                        <span className={s.highScore}>High Score: {highScore}</span>

                        {foodArray.map((coordinates) => 
                            <Item key={coordinates.id} coordinates={coordinates} type={"food"}/>
                        )} 

                        {trapArray.map((coordinates) => 
                            <Item key={coordinates.id} coordinates={coordinates} type={"trap"}/>
                        )}   

                        {bonusArray.map((coordinates) => 
                            <Item key={coordinates.id} coordinates={coordinates} type={"bonus"}/>
                        )}
                    </div>
                {/*</>)*/}
        </>
    );
};

export default Board;