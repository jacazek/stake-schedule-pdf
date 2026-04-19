import { Footer } from "../components/footer"
import { SpeakerCard, type Speaker } from "../components/speaker-card"
import { Page, Text, View, Document, StyleSheet, PDFViewer, Link } from '@react-pdf/renderer';

import "./schedule.css"
import { COLORS } from "../colors";
import { TableOfContents, TableOfContentsProvider } from "../components/toc";
import { H1, H4, PAGE, PARAGRAPH } from "../styles";
import { PageNumber } from "../components/page-number";
import speakers from "../../data/output/speaker-schedule.json";
import { TitlePage } from "../components/title-page";
import { SectionHeader } from "../components/section-header";
const sortedSpeakers: Speaker[] = speakers.sort((a, b) => a.tocName > b.tocName ? 1 : a.tocName < b.tocName ? -1 : 0);
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
    listItem: {
        fontSize: 12,
        marginBottom: 5,
    },
    listNumber: {
        paddingRight: "4px"
    },
    listContainer: {
        marginLeft: 15,
    }
});


const speakingTopics = [
    "Caring for those in need: How can we more effectively minister to each other? Share principles for strengthening new and returning members.",
    "Inviting others to \"Come Unto Christ\": Emphasize the principles of \"love share and invite\" in honoring our covenant to stand as witnesses of God. Teach how members can effectively partner with the full-time missionaries in finding and teaching.",
    "Living the Gospel of Jesus Christ: Share how consistently living the gospel brings strength blessings and joy as we walk the covenant path. How can members improve home-centered gospel instruction? Consider addressing topics of fasting service the law of tithing scripture study and principles taught in the Family Proclamation.",
    "Uniting Families for Eternity: Share how preparing for and receiving temple covenants bring eternal blessings. Focus on receiving and maintaining a current temple recommend; sacrificing to attend the temple on a regular basis; and participating in family history.",
    "Personal Revelation: How can we qualify for and learn to be guided by the influence of the Holy Ghost? Emphasize the importance of prayer scripture study obedience and the guidance of modern-day prophets.",
    "Honoring the Sabbath: How we can draw closer to the Lord through Sabbath day observance and church participation. Emphasize being guided by revelation in directing our activities as a \"sign\" of our covenants with the Lord.",
    "Self-reliance: Teach how we can become temporally and spiritually self-reliant in providing for ourselves and our families. How does being self-reliant help us better serve and care for others?"
];


export const SpeakerSchedule = () => {
    return <div className="container">
        <h1>Speaker schedules</h1>
        <div id="speaker-schedule">
            <PDFViewer style={{ width: 1024, height: "100%" }}>
                <TableOfContentsProvider>
                    <Document>

                        <TitlePage subtext="Stake Council Speaking Schedule & Ministering Interviews for 2026" />

                        <Page id="toc" size="A4" style={PAGE}>
                            <TableOfContents note="Click on the name to view assignment details." />
                            <PageNumber />
                        </Page>

                        <Page size="A4" style={PAGE}>

                            {sortedSpeakers.map((speaker, index) => (
                                <View key={index} style={styles.section}>
                                    <SpeakerCard  {...speaker} index={index} />
                                </View>
                            ))}
                            <PageNumber />
                            <View fixed style={styles.backToMain}>
                                <Link src="#toc">Back to Contents</Link>

                            </View>
                        </Page>
                        <Page size="A4" style={PAGE}>
                            <View style={{ padding: ".5in" }}>
                                <SectionHeader id="speaking-instruction" tocName="Speaking Assignment Instructions">
                                    <Text
                                        style={{ textAlign: "center" }}
                                        hyphenationCallback={(word) => [word]}
                                    >
                                        Instructions for SP, HC, and Stake Organization Speaking Assignments
                                    </Text>
                                </SectionHeader>
                            </View>

                            <View style={{ padding: "0 .75in" }}>
                                <Text style={PARAGRAPH}>
                                    Stake Organizations should assign a member of their presidency for the
                                    speaking assignment.
                                </Text>
                                <Text style={PARAGRAPH}>
                                    Speakers should reach out to the bishop/ branch president 1 month before their
                                    assignment to coordinate the date and topic.
                                </Text>
                                <Text style={PARAGRAPH}>
                                    For months where multiple speakers are assigned you may speak on the same
                                    day if the bishop/ branch president approves and if your schedule permits.
                                </Text>
                            </View>
                            <PageNumber />
                            <View fixed style={styles.backToMain}>
                                <Link src="#toc">Back to Contents</Link>

                            </View>
                        </Page>
                        <Page size="A4" style={PAGE}>
                            <View style={{ padding: ".5in" }}>
                                <SectionHeader id="speaking-topics" tocName="Speaking Assignment Topics">
                                    <Text style={{ textAlign: "center" }} hyphenationCallback={(word) => [word]}>
                                        Topics for Stake Council Speaking Assignments
                                    </Text>
                                </SectionHeader>
                            </View>

                            <View style={{ padding: "0 .75in" }}>
                                <Text style={PARAGRAPH}>
                                    When scheduling your speaking assignment with a member of the unit
                                    bishopric/branch presidency if they do not provide you with a specific topic
                                    please prayerfully consider what the members may need. You may also choose
                                    from the following topics that the stake presidency has identified as priorities.
                                    Focus on teaching eternal truths bearing testimony of the Savior and extending
                                    inspired invitations.
                                </Text>

                                <View style={styles.listContainer}>
                                    <View style={{ display: "flex", flexDirection: "column" }}>
                                        {speakingTopics.map((topic, index) => {
                                            return <>
                                                <View style={{ ...styles.listItem, position: "relative" }}>
                                                    <Text style={{ ...PARAGRAPH, margin: 0, ...styles.listNumber, position: "absolute", left: -15 }}>{`${index + 1}.`}</Text>
                                                    <Text style={{ ...PARAGRAPH, margin: 0 }}>
                                                        {topic}
                                                    </Text>
                                                </View>
                                            </>
                                        })}
                                    </View>
                                </View>
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
