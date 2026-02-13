import FloatingLines from './FloatingLines';
export default function VantaBackGround() {
    return (
        <div className='background'>
            <FloatingLines
                enabledWaves={["top", "middle", "bottom"]}
                // Array - specify line count per wave; Number - same count for all waves
                lineCount={7}
                // Array - specify line distance per wave; Number - same distance for all waves
                lineDistance={40}
                bendRadius={5}
                bendStrength={-0.5}
                interactive={true}
                parallax={true}
            />
        </div>
    )
}

