import { StyleSheet } from '@react-pdf/renderer';
import { COLORS } from './colors';


export const { FOOT_NOTE, H1, H2, H3, H4, STANDARD_FONT, PAGE, PARAGRAPH } = StyleSheet.create({
    FOOT_NOTE: {
        fontSize: ".5rem",
        fontStyle: "italic",
        color: COLORS.Text
    },
    STANDARD_FONT: {
        fontSize: "12px",
        fontWeight: "normal",
        color: COLORS.Primary
    },
    H1: {
        fontSize: '2.25rem',   // 40 px @ 16 px base
        fontWeight: 700,        // bold
        // marginTop: 0,
        // marginBottom: '2px' // 12 px
    },

    H2: {
        fontSize: '1.75rem',     // 32 px @ 16 px base
        fontWeight: 600,        // semi‑bold
        // paddingTop: '4px',   // 24 px
        // paddingBottom: '4px'
    },

    H3: {
        fontSize: '1rem',  // 28 px @ 16 px base
        fontWeight: 600,
        // paddingTop: '4px',  // 20 px
        // paddingBottom: '4px'
    },
    H4: {
        fontSize: '.75rem',   // 24 px @ 16 px base
        fontWeight: 550,
        // paddingTop: '4px',     // 16 px
        // paddingBottom: '4px',
    },
    PAGE: {
        // flexDirection: 'row',
        // backgroundColor: COLORS.Secondary,

        paddingBottom: ".5in",

    },
    PARAGRAPH: {
        marginBottom: ".25in",
        fontSize: "14px",
        fontWeight: "500"
    }
})


