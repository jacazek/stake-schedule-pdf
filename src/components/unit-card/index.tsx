import { useContext, type FC, type PropsWithChildren } from "react";
import type { Unit } from "./types";
import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SectionHeader } from "../section-header";
import { Table, TableCell, TableHeader, TableRow } from "@ag-media/react-pdf-table";
import { H4, STANDARD_FONT } from "../../styles";
import { COLORS } from "../../colors";
import { formatMonth } from "../../utils/format-date";
import { Section } from "../section";
import { MinisteringEvents } from "../ministering-events";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const styles = StyleSheet.create({
    headerCell: {
        justifyContent: 'center',
    },
    speakerCell: {
        justifyContent: 'center',
    },
    conferenceNote: {
        marginBottom: "16px",
    }
})

export const UnitCard: FC<PropsWithChildren & { unit: Unit }> = ({ unit }) => {
    const id = `unit${unit.id}`;
    const name = `${unit.name} (${unit.id.toUpperCase()})`;

    console.log(unit)

    const rowData = months.map(month => ({
        month,
        stakeCounilSpeaker: unit.stakeCouncilSpeakers?.find(x => formatMonth(x.date) === month),
        providedSpeaker: unit.providingSpeakers?.find(x => formatMonth(x.date) === month),
        unitSpeaker: unit.receivingSpeakers?.find(x => formatMonth(x.date) === month),
        stakePresidencySpeaker: unit.stakePresidencySpeakers?.find(x => formatMonth(x.date) === month)
    }));
    let totalColumns = 1;
    totalColumns += +((unit.stakePresidencySpeakers?.length || 0) > 0);
    totalColumns += +((unit.providingSpeakers?.length || 0) > 0);
    totalColumns += +((unit.receivingSpeakers?.length || 0) > 0);
    const columnWidth = (1 - .13) / totalColumns;

    return <View wrap={false}>
        <SectionHeader id={id} tocName={name}>
            <Text>{name}</Text>
        </SectionHeader>
        <View style={styles.conferenceNote}>
            {unit.conferenceDate ? <>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Text
                        style={{
                            fontSize: "12px",
                            fontWeight: "normal",
                            color: COLORS.Text,
                            paddingRight: 4
                        }}
                    >
                        Unit Conference Date:
                    </Text>
                    <Text
                        style={{
                            ...STANDARD_FONT
                        }}
                    >
                        {new Date(unit.conferenceDate).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </Text>

                </View>
                <Link style={{ fontSize: "12px" }} src="https://docs.google.com/document/d/13rwCwdEoCrdJdrG6cnJ78cNzWcwUPCcJLRLWPYLpN4g/edit?usp=sharing">Unit Conference Guide</Link>
            </> : null}
        </View>
        <Section title="Speaker Schedule">
            <Table
                style={{
                    border: `1px solid ${COLORS.Border}`,
                }}

                weightings={[0.13, ...Array.from({ length: totalColumns }, () => columnWidth)]}

                tdStyle={{
                    padding: '4px',
                }}>
                <TableHeader style={{ backgroundColor: COLORS.TableHeader }}>
                    <TableCell>
                        <Text style={H4} hyphenationCallback={(word) => [word]}>
                            Month
                        </Text>
                    </TableCell>

                    <TableCell style={styles.headerCell}>
                        <Text style={{ ...H4 }} hyphenationCallback={(word) => [word]}>
                            Stake Council Speaker
                        </Text>
                    </TableCell>
                    {unit.stakePresidencySpeakers?.length ?
                        <TableCell style={styles.headerCell}>
                            <Text style={H4} hyphenationCallback={(word) => [word]}>
                                Stake Presidency Speaker
                            </Text>
                        </TableCell> : undefined}
                    {unit.providingSpeakers?.length ? (
                        <TableCell style={styles.headerCell}>
                            <Text style={H4} hyphenationCallback={(word) => [word]}>
                                Provide Speaker to Branch
                            </Text>
                        </TableCell>) : undefined}
                    {unit.receivingSpeakers?.length ? (
                        <TableCell style={styles.headerCell}>
                            <Text style={H4}>
                                Unit Providing Speakers
                            </Text>
                        </TableCell>) : undefined}
                </TableHeader>
                {rowData.map((row, index) => (
                    <TableRow style={{ backgroundColor: index % 2 ? COLORS.Secondary : "" }}>
                        <TableCell >
                            <Text style={{ fontSize: "12px", fontWeight: 550 }}>
                                {row.month}
                            </Text>
                        </TableCell>
                        <TableCell style={styles.speakerCell}>
                            <Text style={STANDARD_FONT}>
                                {row.stakeCounilSpeaker?.name}
                            </Text>
                        </TableCell>
                        {unit.stakePresidencySpeakers?.length ?
                            <TableCell style={styles.speakerCell}>
                                <Text style={STANDARD_FONT}>
                                    {row.stakePresidencySpeaker?.name}
                                </Text>
                            </TableCell> : undefined}
                        {unit.providingSpeakers?.length ? (
                            <TableCell style={styles.speakerCell}>
                                <Text style={STANDARD_FONT}>
                                    {row.providedSpeaker?.name}
                                </Text>
                            </TableCell>) : undefined}
                        {unit.receivingSpeakers?.length ? (
                            <TableCell style={styles.speakerCell}>
                                <Text style={STANDARD_FONT}>
                                    {row.unitSpeaker?.name}
                                </Text>
                            </TableCell>) : undefined}
                    </TableRow>
                ))}
            </Table>
        </Section>

        {unit.leaderMeetings?.length > 0 && unit.leaderType ?
            <MinisteringEvents title={`${unit.leaderType} - Ministering Interview`} interviews={unit.leaderMeetings} index={0} /> : undefined}
        {unit.eqpMeetings?.length > 0 ?
            <MinisteringEvents title="Elders Quorum President - Ministering Interview" interviews={unit.eqpMeetings} index={1} /> : undefined}

    </View>
}