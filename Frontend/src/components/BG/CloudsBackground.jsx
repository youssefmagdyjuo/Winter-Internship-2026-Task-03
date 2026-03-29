import { useEffect, useRef } from "react";
import CLOUDS from "vanta/dist/vanta.clouds.min";
import * as THREE from "three";

export default function VantaBackGround() {
    const vantaRef = useRef(null);
    const effectRef = useRef(null);

    useEffect(() => {
        if (!effectRef.current && vantaRef.current) {
            effectRef.current = CLOUDS({
                el: vantaRef.current,
                THREE: THREE,

                skyColor: 0x68b8d7,
                cloudColor: 0xadc1de,
                speed: 0.5,
            });
        }

        return () => {
            if (effectRef.current) {
                effectRef.current.destroy();
                effectRef.current = null;
            }
        };
    }, []);

    return <div ref={vantaRef} className="background" />;

}