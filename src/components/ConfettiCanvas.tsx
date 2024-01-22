import styles from '../app/page.module.css';
import { MutableRefObject, useEffect, useRef, useState } from "react";

type Particle = {
    color : string,
    x : number,
    y : number,
    height : number,
    velocity : [number, number],
    rtl : boolean,
    offscreen : boolean
}

export default function ConfettiCanvas( { didWin } : { didWin : boolean } ){
    const canvasRef = useRef(null) as MutableRefObject<HTMLCanvasElement | null>;
    
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const setDims = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    useEffect(() => {
        setDims();
        window.addEventListener('resize', setDims);
    }, []);

    const colors = ["rgba(231,76,60,1)","rgba(230,126,34,1)","rgba(241,196,15,1)","rgba(26,188,156,1)","rgba(46,204,113,1)","rgba(52,152,219,1)","rgba(155,89,182,1)"];

    useEffect( () => {
        if(!didWin) return;

        const canvas = canvasRef.current;
        const ctx = canvas!.getContext('2d')!;

        const particles : Particle[] = [];
        const particleCount = 300;
        for(let index = 0; index < particleCount; index++){
            const rtl = index >= particleCount/2;
            particles.push({
                color : colors[Math.round(Math.random()*colors.length)],
                x : rtl ? width + 20 : -20,
                y : height * 0.8,
                height : Math.round(Math.random()*10)/10,
                velocity : [ rtl ? -Math.random()*20 : Math.random()*20, -Math.random()*30 - 10 ],
                rtl : rtl,
                offscreen : false
            });
        }

        const updateParticles = () => {
            ctx.clearRect(0,0,width,height);

            let particlesOnScreen = false;
            particles.forEach( particle => {
                if(particle.offscreen) return;
                else particlesOnScreen = true;

                ctx.beginPath();
                ctx.fillStyle = particle.color;
                ctx.ellipse( particle.x, particle.y, 6, 6*Math.abs(particle.height), 0, 0, 2*Math.PI );
                ctx.fill();
                ctx.closePath();

                if(particle.y > height + 10) particle.offscreen = true; 

                particle.x += particle.velocity[0];
                particle.y += particle.velocity[1];

                particle.height -= 0.1;
                if(particle.height == 0) particle.height -= 0.1;
                else if(particle.height <= -1) particle.height = 1;

                if(particle.rtl) particle.velocity = [ Math.min( particle.velocity[0] + 0.1, 0 ), particle.velocity[1] + 1];
                else particle.velocity = [ Math.max( particle.velocity[0] - 0.1, 0 ), particle.velocity[1] + 1];
            });


            if(particlesOnScreen) setTimeout( () => { requestAnimationFrame(updateParticles) }, 15 );
        };

        updateParticles();


    }, [didWin]);

    return didWin && <canvas ref={canvasRef} id={styles["confetti-canvas"]} width={width} height={height}></canvas>
}