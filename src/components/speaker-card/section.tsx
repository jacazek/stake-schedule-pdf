import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { COLORS } from "../../colors";
import { useContext, type FC, type JSX, type PropsWithChildren, type ReactElement } from "react";
import { TableOfContentsContext } from "../toc";
import { FOOT_NOTE, H2, H3, H4 } from "../../styles";

const styles = StyleSheet.create({
    header: {
        padding: "10 0",
        backgroundColor: COLORS.Accent,
        color: COLORS.Text,
        width: "100%", // make the header span the full width of the container
    },
    section: {
        borderColor: COLORS.Border,
        borderStyle: "solid",
        borderWidth: 1
    },
    sectionBody: {
        backgroundColor: COLORS.Highlight,
        color: COLORS.Text,
    }
});

export const Section: FC<PropsWithChildren & { title: string, footNote?: JSX.Element }> = ({ title, footNote, children }) => {

    return (<View style={styles.section}>
        <View style={{ ...styles.header, padding: "8px" }}>
            <Text style={H3}>{title}</Text>
        </View>
        <View style={styles.sectionBody}>
            {children}
        </View>
        {footNote && (<View style={{ padding: 4, textAlign: "left" }}>
            {footNote}
        </View>)}
    </View>)
}