export type PomodoroDTO = {
    sessionId: number;
    finishingTimeStamp: string;
    title: string;
    isPaused: boolean;
}

export type PomodoroDTOPost = {
    title: string;
    dueTime: string;
}