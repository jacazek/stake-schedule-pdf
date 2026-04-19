import { StyleSheet, Text } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    pageNumber: {
        position: 'absolute',
        fontSize: ".8rem",
        bottom: ".15in",
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});

export const PageNumber = () => (
    <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
        )}
        fixed />
)