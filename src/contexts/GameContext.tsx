import { createContext, useContext , type SetStateAction, type ReactNode, useState, type Dispatch} from "react";
export interface GameContextType {
    score: number
    setScore: Dispatch<SetStateAction<number>>
    timer: number
    setTimer: Dispatch<SetStateAction<number>>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider = ({children}:{children: ReactNode}) => {
    const [score, setScore] = useState<number>(0)
    const [timer, setTimer] = useState<number>(120)
    const [matched, setMatched] = useState<Set>(new Set())
    


    return (
        <GameContext.Provider
            value={{ 
                score,
                setScore,
                timer,
                setTimer
            }}
        
        >{children}</GameContext.Provider>
    )
}

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if(!context){
        throw new Error("useGame must be used within a GameProvider")
    }
    return context
}