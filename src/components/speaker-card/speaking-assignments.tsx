import type { FC } from "react";
import { formatMonth } from "../../utils/format-date";
import { Text } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";

import { Section } from "./section";
import { COLORS } from "../../colors";
import { FOOT_NOTE, H4, STANDARD_FONT } from "../../styles";

export interface SpeakingAssignment {
  date: string;
  unit: string; // should be enum of specific units
  note?: string;
}

export const SpeakingAssignments: FC<{
  assignments: SpeakingAssignment[];
  index: number;
}> = ({ index, assignments }) => {
  const footNote = assignments.some((x) => x.note) ? (
    <Text style={FOOT_NOTE}>*Please bring a speaking companion</Text>
  ) : undefined;
  return (
    <Section title="Speaking Assignments" footNote={footNote}>
      <Table
        style={{
          border: `1px solid ${COLORS.Border}`,
        }}
        tdStyle={{
          padding: "6px",
          justifyContent: "center",
        }}
      >
        <TH style={{ backgroundColor: COLORS.TableHeader }}>
          {assignments.map((assignment, assignmentIndex) => (
            <TD key={`${index}-${assignmentIndex}-header`}>
              <Text style={H4}>{formatMonth(assignment.date)}</Text>
            </TD>
          ))}
        </TH>
        <TR>
          {assignments.map((assignment, assignmentIndex) => (
            <TD key={`${index}-${assignmentIndex}`}>
              <Text style={STANDARD_FONT}>
                {assignment.unit}
                {assignment.note ? "*" : ""}
              </Text>
            </TD>
          ))}
        </TR>
      </Table>
    </Section>
  );
};
