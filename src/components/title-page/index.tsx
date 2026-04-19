import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { H1, H4, PAGE } from "../../styles";
import { COLORS } from "../../colors";
import type { FC, PropsWithChildren } from "react";

const styles = StyleSheet.create({
    titlePage: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        alignItems: "center",
        textAlign: "center"
    },
});

export const TitlePage: FC<PropsWithChildren & { subtext: string }> = ({ subtext }) => {
    return (<Page id="main" size="A4" style={PAGE}>
        <View style={styles.titlePage}>
            <Text style={{ ...H1, color: COLORS.Primary }}>Durham NC Stake</Text>
            <Text style={{ ...H4, maxWidth: "50%" }} hyphenationCallback={(word) => [word]}>{subtext}</Text>
        </View>
    </Page>);
}