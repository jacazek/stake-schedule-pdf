import { type FC } from "react";
import {
  SpeakingAssignments,
  type SpeakingAssignment,
} from "./speaking-assignments";
import {
  MinisteringInterviews,
  type MinisteringInterview,
} from "./ministering-interviews";
import { Text, View } from "@react-pdf/renderer";
import { SectionHeader } from "../section-header";

export interface Speaker {
  id: string;
  name: string;
  tocName: string;
  speakingAssignments: SpeakingAssignment[];
  ministeringInterviews: MinisteringInterview[];
}

export const SpeakerCard: FC<Speaker & { index: number }> = ({
  index,
  tocName,
  name,
  speakingAssignments,
  ministeringInterviews,
}) => {
  const id = `speaker${index}`;
  return (
    <View wrap={false}>
      <SectionHeader id={id} tocName={tocName}>
        <Text>{name}</Text>
      </SectionHeader>
      <View style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {(speakingAssignments?.length || 0) > 0 && (
          <SpeakingAssignments
            index={index}
            assignments={speakingAssignments}
          />
        )}
        {(ministeringInterviews?.length || 0) > 0 && (
          <MinisteringInterviews
            index={index}
            interviews={ministeringInterviews}
          />
        )}
      </View>
    </View>
  );
};
