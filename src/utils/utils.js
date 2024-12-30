import uniqid from "uniqid";
import gsap from "gsap";
import useStore from "./store";

export const netherPortal = () => {
    const video = document.getElementById("nether-video");
    video.style.display = "block";
  
    setTimeout(() => {
      video.style.display = "none";
    }, 1500);
};


const flashbangAudio = new Audio("/audio/csgo-flashbang.mp3");
let flashTween = null;

export const flashUser = () => {
    if(flashTween) flashTween.kill();

    flashbangAudio.currentTime = 0;
    flashbangAudio.play();
    document.querySelector(".flashbang").style.opacity = "1";

    flashTween = gsap.to(".flashbang", {
        opacity: 0,
        duration: 2,
        delay: 0.25,
    });
};

export const triggerMode = () => {
    const modes = ["impossible", "corner", "reversed"];
    const selectedMode = modes[Math.floor(Math.random() * modes.length)];
  
    // déclenche le mode sélectionné aléatoirement
    useStore.getState().addMode(selectedMode);
  
    setTimeout(() => {
      useStore.getState().removeMode(selectedMode);
    }, 1000);
};

export const wizz = () => {
    gsap.to("#board", {
      duration: 0.05,
      x: "+=30%",
      yoyo: true,
      repeat: 9,
    });
};


export const reversedControles = (e, direction, gamePaused, setGamePaused, replay, isGameOverScreenActive) => {
    if (isGameOverScreenActive) {
        if (e.keyCode === 13) { // Entrée
            replay();
        }
        if (e.keyCode === 32) { // Espace
            setGamePaused(gamePaused ? false : true);
        }
        return; // Ignore les autres touches en mode Game Over
    }

    switch (e.keyCode) {
        case 32: 
            // Espace (pause)
            setGamePaused(gamePaused ? false : true);
            break;

        case 38: 
            // Haut (inversé)
            if (direction.current !== "UP") direction.current = "DOWN";
            break;
        case 40: 
            // Bas (inversé)
            if (direction.current !== "DOWN") direction.current = "UP";
            break;
        case 37: 
            // Gauche (inversé)
            if (direction.current !== "LEFT") direction.current = "RIGHT";
            break;
        case 39: 
            // Droite (inversé)
            if (direction.current !== "RIGHT") direction.current = "LEFT";
            break;

        default:
            break;
    }

};


export const defaultControles = (e, direction, gamePaused, setGamePaused, replay, isGameOverScreenActive) => {
    if (isGameOverScreenActive) {
        if (e.keyCode === 13) { // Entrée
            replay();
        }
        if (e.keyCode === 32) { // Espace
            setGamePaused(gamePaused ? false : true);
        }
        return; // Ignore les autres touches en mode Game Over
    }

    switch (e.keyCode) {
        case 32: 
            // Espace (pause)
            setGamePaused(gamePaused ? false : true);
            break;

        case 38: 
            // Haut
            if (direction.current !== "DOWN") direction.current = "UP";
            break;
        case 40: 
            // Bas
            if (direction.current !== "UP") direction.current = "DOWN";
            break;
        case 37: 
            // Gauche
            if (direction.current !== "RIGHT") direction.current = "LEFT";
            break;
        case 39: 
            // Droite
            if (direction.current !== "LEFT") direction.current = "RIGHT";
            break;

        default:
            break;
    }

};


export const generateRandomCoordinates = (mode) => {
    const id = uniqid();

    let min = 0;
    let max = 49;

    let x, y;

    if(mode.includes("corner")){
        // logique pour générer des coordonnées uniquement sur les côtés
        const side = Math.random();

        if(side <= 0.25){
            //générer à gauche
            x = min
            y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
            y *= 10;

        } else if(side > 0.25 && side <= 0.5){
            //générer à droite
            x = max * 10;
            y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
            y *= 10;

        } else if(side > 0.5 && side <= 0.75){
            //générer en bas
            x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
            x *= 10;
            y = max * 10;

        } else if(side > 0.75){
            //générer en haut
            x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
            x *= 10;
            y = min
        }
    
    } else {
        // logique classique
        x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
        x *= 10;

        y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
        y *= 10;
    }

    return {x, y, id};
};

