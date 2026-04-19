import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { useContext, type FC, type PropsWithChildren } from "react";
import { COLORS } from "../../colors";
import { H2 } from "../../styles";
import { TableOfContentsContext } from "../toc";

const styles = StyleSheet.create({
    header: {
        fontSize: "1.4rem",
        fontWeight: "bold",
        padding: "5 0",
        color: COLORS.Primary,
    }
})

export const SectionHeader: FC<PropsWithChildren & { id: string, tocName: string }> = ({ id, tocName, children }) => {
    const { addToTableOfContents } = useContext(TableOfContentsContext);

    return <View style={{ ...styles.header, ...H2 }} >
        <Text id={id}
            bookmark={{ title: tocName, fit: false }}
            render={({ pageNumber }) => {
                addToTableOfContents({ id, title: tocName, pageNumber, level: 1 });
                return "";
            }} />
        {children}
    </View>
}