export interface Meeting {
  date: string;
  location: string;
  member: string;
}

export interface SpeakerAssignment {
  name: string;
  date: string;
}

export interface UnitSchedule {
  id: string;
  name: string;
  eqpMeetings: Meeting[];
  leaderMeetings: Meeting[];
  leaderType: string | null;
  stakeCouncilSpeakers: SpeakerAssignment[];
  conferenceDate: string;
  stakePresidencySpeakers: SpeakerAssignment[];
  receivingSpeakers?: SpeakerAssignment[];
  providingSpeakers?: SpeakerAssignment[];
}

export type UnitSchedules = UnitSchedule[];

export function mapUnitSchedule(
  units: Record<string, unknown>[],
  speakers: Record<string, unknown>[],
  speakingAssignments: Record<string, unknown>[],
  presidencyAssignments: Record<string, unknown>[],
  providingSpeakers: Record<string, unknown>[],
  ministering: Record<string, unknown>[],
): UnitSchedules;
