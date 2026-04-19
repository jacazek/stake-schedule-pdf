import { Footer } from "../components/footer"
import { Page, Text, View, Document, StyleSheet, PDFViewer, Link } from '@react-pdf/renderer';

import "./schedule.css"
import { COLORS } from "../colors";
import { SingleColumnTOC, TableOfContents, TableOfContentsProvider } from "../components/toc";
import { H1, H4, PAGE, PARAGRAPH } from "../styles";
import { PageNumber } from "../components/page-number";
import units from "../../data/output/unit-schedule.json"
import { TitlePage } from "../components/title-page";
import { UnitCard } from "../components/unit-card";
import type { Unit } from "../components/unit-card/types";
import { SectionHeader } from "../components/section-header";
const sortedUnits: Unit[] = units.sort((a, b) => a.id > b.id ? 1 : a.id < b.name ? -1 : 0);

const styles = StyleSheet.create({
    section: {
        margin: "10 0",
        padding: ".25in",
        flexGrow: 1,
        width: "100%",
        textAlign: "center"
    },
    backToMain: {
        position: 'absolute',
        bottom: ".15in",
        right: 20,
        fontSize: ".8rem",
        textAlign: 'right',
        color: 'grey',
    },
    document: {
        fontSize: "1rem"
    },
    titelPage: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        alignItems: "center",
        textAlign: "center"
    },
    paragraph: {

    }
});


export const UnitSchedule = () => {
    return <div className="container">
        <h1>Unit schedules</h1>
        <div id="speaker-schedule">
            <PDFViewer style={{ width: 1024, height: "100%" }}>
                <TableOfContentsProvider>
                    <Document>
                        <TitlePage subtext="Unit Speaking Schedule & Ministering Interviews for 2026" />

                        <Page id="toc" size="A4" style={PAGE}>
                            <SingleColumnTOC note="Click on a unit name to see unit information." />
                            <PageNumber />
                        </Page>

                        {sortedUnits.map((unit, index) => (
                            <Page size="A4" style={PAGE}>
                                <View key={index} style={styles.section}>
                                    <UnitCard unit={unit} />
                                </View>
                                <PageNumber />
                                <View fixed style={styles.backToMain}>
                                    <Link src="#toc">Back to Contents</Link>

                                </View>
                            </Page>
                        ))}
                        <Page size="A4" style={PAGE}>
                            <View style={{ padding: ".25in" }}>
                                <SectionHeader id="instruction" tocName="Ward Speaking Branch Assignment Instructions">
                                    <Text style={{ textAlign: "center" }}>Instructions for Ward Speaking Branch Assignments</Text>
                                </SectionHeader>
                            </View>

                            <View style={{ padding: "0 .75in" }}>
                                <Text style={PARAGRAPH}>
                                    Bishoprics are responsible for providing 2 speakers from their
                                    ward for the Roxboro and Durham 5th (Spanish) Branches in
                                    your assigned month (4 speakers total - 2 speakers per branch
                                    for 1 Sunday).
                                </Text>
                                <Text style={PARAGRAPH}>
                                    It may be helpful to obtain speaker recommendations from
                                    your Ward Council.
                                </Text>
                                <Text style={PARAGRAPH}>
                                    Speakers should be invited the month prior to the assignment
                                    and can coordinate directly with the Branch President or the
                                    designated counselor on a specific date and topics.
                                </Text>
                                <Text style={PARAGRAPH}>
                                    Units may switch assigned months if agreed upon by both
                                    bishops. Please notify the stake executive secretary so that this
                                    schedule can be updated.
                                </Text>
                            </View>
                            <PageNumber />
                            <View fixed style={styles.backToMain}>
                                <Link src="#toc">Back to Contents</Link>
                            </View>
                        </Page>

                        <Page size="A4" style={PAGE}>
                            <View style={{ padding: ".25in" }}>
                                <SectionHeader id="ministering-visits-instructions" tocName="Instructions for Ministering Visits">
                                    <Text style={{ textAlign: "center" }}>Instructions for Ministering Visits</Text>
                                </SectionHeader>
                            </View>

                            <View style={{ padding: "0 .75in" }}>
                                <Text style={PARAGRAPH}>
                                    Bishops, Branch Presidents, and Elders Quorum Presidents will organize ministering visits for one of the regularly scheduled ministering interviews with a member of the stake presidency. These visits will take place after church.
                                </Text>
                                <Text style={PARAGRAPH}>
                                    Please prayerfully consider 1 - 2 members that you can visit with on this date and coordinate with them ahead of time. You will receive an email reminder about 3 weeks ahead of the scheduled date for ministering visits.
                                </Text>
                            </View>
                            <PageNumber />
                            <View fixed style={styles.backToMain}>
                                <Link src="#toc">Back to Contents</Link>
                            </View>
                        </Page>
                    </Document>
                </TableOfContentsProvider>
            </PDFViewer>
        </div>

    </div>
}
