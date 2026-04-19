import type { FC } from "react";
import { formatDate } from "../../utils/format-date";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import { Section } from "./section";
import { COLORS } from "../../colors";
import { FOOT_NOTE, H4, STANDARD_FONT } from "../../styles";

export interface MinisteringInterview {
    dateTime: string;
    location: string;
    note?: string;
}

export const MinisteringInterviews: FC<{ interviews: MinisteringInterview[], index: number }> = ({ index, interviews }) => {
    const note = interviews.find(x => x.note)?.note;
    const footNote = note ? (<Text style={FOOT_NOTE}>{`*${note}`}</Text>) : undefined;

    return <Section title="Ministering Interviews" footNote={footNote}>
        <Table
            style={{
                border: `1px solid ${COLORS.Border}`,
            }}

            tdStyle={{
                padding: '6px',
            }}>
            <TH style={{ backgroundColor: COLORS.TableHeader }}>
                <TD>
                    <Text style={H4}>Date</Text>
                </TD>
                <TD>
                    <Text style={H4}>Location</Text>
                </TD>
            </TH>

            {interviews.map((interview, interviewIndex) => (
                <TR key={`${index}-${interviewIndex}`} style={{ backgroundColor: interviewIndex % 2 ? COLORS.Secondary : "" }}>
                    <TD>
                        <Text style={STANDARD_FONT}>{formatDate(interview.dateTime)}</Text>
                    </TD>
                    <TD>
                        <Text style={STANDARD_FONT}>{interview.location}{interview.note ? "*" : ""}</Text>
                    </TD>
                </TR>
            ))}
        </Table>

    </Section>

};