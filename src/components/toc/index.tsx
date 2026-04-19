// TocContext.js
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { createContext, useState, useContext, type ReactNode, type FC } from 'react';
import { COLORS, SIZES } from '../../colors';
import { FOOT_NOTE, H2 } from '../../styles';

export type TocEntry = {
    title: string;
    pageNumber: number;
    level: number; // For hierarchical TOC, if needed
    id: string;
};

type TocContextProps = {
    tableOfContents: TocEntry[];
    addToTableOfContents: (entry: TocEntry) => void;
};

export const TableOfContentsContext = createContext<TocContextProps>(
    null as unknown as TocContextProps
);

export const TableOfContentsProvider = ({ children }: { children: ReactNode }) => {
    const [tableOfContents, setTableOfContents] = useState<TocEntry[]>([]);

    const addToTableOfContents = (entry: TocEntry) => {


        setTableOfContents((prevState) => {
            // Prevent duplicate entries if needed
            const existingEntry = prevState.find(
                (e) => e.title === entry.title
            );


            if (!existingEntry) {
                return [...prevState, entry];
            } else if (existingEntry?.pageNumber < entry.pageNumber) {
                return [...prevState.filter(e => e.title !== entry.title), entry];
            } else {
                return prevState;
            }


        });
    };

    return (
        <TableOfContentsContext.Provider value={{ tableOfContents, addToTableOfContents }}>
            {children}
        </TableOfContentsContext.Provider>
    );
};

const style = StyleSheet.create({
    tocEntry: {
        margin: "10 0",
        padding: "2px",
        width: "70%",

    },
    tocList: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // textAlign: "center"
    },
    tocHeader: {
        width: "100%",
        textAlign: "center",
        margin: 10,
    }
});

export const SingleColumnTOC: FC<{ note: string }> = ({ note }) => {
    const { tableOfContents } = useContext(TableOfContentsContext);

    return (<>
        <View style={style.tocHeader} fixed>
            <Text style={{ ...H2, color: COLORS.Primary }}>Table of Contents</Text>
            {note ? (<Text style={FOOT_NOTE}>{note}</Text>) : <></>}
        </View>


        <View style={style.tocList}>
            {
                tableOfContents.map((content, index) => {
                    return <Link style={style.tocEntry} key={index} src={`#${content.id}`}>
                        <Text hyphenationCallback={(word) => [word]} style={{ width: "100%" }}>
                            {content.pageNumber} - {content.title}
                        </Text>
                    </Link>;
                })
            }
        </View>
    </>);
}


export const TableOfContents: FC<{ note: string }> = ({ note }) => {
    const { tableOfContents } = useContext(TableOfContentsContext);
    const mid = Math.ceil(tableOfContents.length / 2);

    const firstHalf = tableOfContents.slice(0, mid);   // start, end (non‑inclusive)
    const secondHalf = tableOfContents.slice(mid);      // start to end of array

    return (<>
        <View style={style.tocHeader} fixed>
            <Text style={{ ...H2, color: COLORS.Primary }}>Table of Contents</Text>
            {note ? (<Text style={FOOT_NOTE}>{note}</Text>) : <></>}
        </View>

        <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={style.tocList}>
                {
                    firstHalf.map((content, index) => {
                        return <Link style={style.tocEntry} key={index} src={`#${content.id}`}>
                            <Text hyphenationCallback={(word) => [word]} style={{ width: "100%" }}>
                                {content.pageNumber} - {content.title}
                            </Text>
                        </Link>;
                    })
                }
            </View>
            <View style={style.tocList}>
                {
                    secondHalf.map((content, index) => {
                        return <Link style={style.tocEntry} key={index} src={`#${content.id}`}>
                            <Text hyphenationCallback={(word) => [word]} style={{ width: "100%" }}>
                                {content.pageNumber} - {content.title}
                            </Text>
                        </Link>;
                    })
                }
            </View>
        </View>
    </>);
}