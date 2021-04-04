import * as React from "react";
import styled from 'styled-components'
// @ts-ignore
import SuperTreeview from 'react-super-treeview';

import 'react-super-treeview/dist/style.css'
import genTreeFromRoutes from "./genTreeFromRoutes";


export default function TreeFilter({ routes }: { routes: string[][] }) {
    const [tree, setTree] = React.useState<any>([])
    const [selectedRoutes, setSelectedRoutes] = React.useState<string[][]>([])

    React.useEffect(() => {
        setTree(genTreeFromRoutes(routes, selectedRoutes))
    }, [routes])

    return (
        <Container>
            <Title>
                Routes
            </Title>
            <SuperTreeview
                data={tree}
                onUpdateCb={(updatedData: any) => {
                    setTree(updatedData)
                }}
                isDeletable={() => false}
                isExpandable={() => false}
            />
        </Container>
    )
}

const Title = styled.div`
    font-size:20px;
    margin:8px;
`

const Container = styled.div`
    height:100%;
    width:100%;
    color:white;
    padding:8px;
`