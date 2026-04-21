export interface SpeakingAssignment {
  date: string;
  unit: string;
  note: string;
}

export interface MinisteringInterview {
  dateTime: string;
  location: string;
  note: string;
}

export interface Speaker {
  id: string;
  name: string;
  tocName: string;
  speakingAssignments: SpeakingAssignment[];
  ministeringInterviews: MinisteringInterview[];
}

export type SpeakerSchedule = Speaker[];

export function mapSpeakerSchedule(
  speakers: Record<string, unknown>[],
  speakingAssignments: Record<string, unknown>[],
  ministering: Record<string, unknown>[],
  units: Record<string, unknown>[],
): SpeakerSchedule;
