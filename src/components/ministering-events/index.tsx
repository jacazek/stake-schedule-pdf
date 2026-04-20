import type { FC } from "react";
import { formatDate } from "../../utils/format-date";
import { Text } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { Section } from "../section";
import { COLORS } from "../../colors";
import { H4, STANDARD_FONT } from "../../styles";

export interface MinisteringEvent {
  date: Date | string;
  location?: string;
}

const eventType: { [key: string]: string } = {
  "0": "Visit",
  "3": "Interview",
};

export const MinisteringEvents: FC<{
  title: string;
  interviews: MinisteringEvent[];
  index: number;
}> = ({ index, title, interviews }) => {
  return (
    <Section title={title}>
      <Table
        style={{
          border: `1px solid ${COLORS.Border}`,
        }}
        tdStyle={{
          padding: "6px",
        }}
      >
        <TH style={{ backgroundColor: COLORS.TableHeader }}>
          <TD>
            <Text style={H4}>Date</Text>
          </TD>
          <TD>
            <Text style={H4}>Type</Text>
          </TD>
          <TD>
            <Text style={H4}>Location</Text>
          </TD>
        </TH>

        {interviews.map((interview, interviewIndex) => (
          <TR
            key={`${index}-${interviewIndex}`}
            style={{
              backgroundColor: interviewIndex % 2 ? COLORS.Secondary : "",
            }}
          >
            <TD>
              <Text style={STANDARD_FONT}>{formatDate(interview.date)}</Text>
            </TD>
            <TD>
              <Text style={STANDARD_FONT}>
                {eventType[new Date(interview.date).getDay().toString()]}
              </Text>
            </TD>
            <TD>
              <Text style={STANDARD_FONT}>{interview.location}</Text>
            </TD>
          </TR>
        ))}
      </Table>
    </Section>
  );
};
