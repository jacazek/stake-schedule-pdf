export interface Speaker {
    name: string;
    date: Date | string;
}

export interface Meeting {
    date: Date | string;
    location: string;
}

export interface Unit {
    id: string;
    name: string;
    conferenceDate?: Date | string;
    stakeCouncilSpeakers?: Speaker[],
    receivingSpeakers?: Speaker[],
    providingSpeakers?: Speaker[],
    stakePresidencySpeakers?: Speaker[],
    leaderType: "Bishop" | "Branch President" | string | null,
    leaderMeetings: Meeting[],
    eqpMeetings: Meeting[]
}