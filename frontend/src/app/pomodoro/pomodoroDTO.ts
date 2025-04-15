export type PomodoroDTO = {
    id: number;
    dueTime: string;
    title: string;
    isPaused: boolean;
}

export type PomodoroDTOPost = {
    title: string;
    dueTime: string;
}