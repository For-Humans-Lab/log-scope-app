import * as React from "react";
import styled from 'styled-components'
// @ts-ignore
import SuperTreeview from 'react-super-treeview';

import 'react-super-treeview/dist/style.css'
import genTreeFromRoutes from "./genTreeFromRoutes";
import _ from "lodash";
import isRoutesEqual from "_/utils/isRoutesEqual";


export default function TreeFilter({ routes, onSelectedChange }: {
    routes: string[][],
    onSelectedChange: (routes: string[][]) => void
}) {
    const [tree, setTree] = React.useState<any>([])
    const [selectedRoutes, setSelectedRoutes] = React.useState<string[][]>([])

    React.useEffect(() => {
        setTree(genTreeFromRoutes(routes, selectedRoutes, []))
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
                onCheckToggleCb={(nodes: any, depth: any) => {
                    const node = nodes[0]
                    const isChecked = node.isChecked as boolean
                    console.log(node)
                    const route = node.route as string[]
                    if (isChecked) {
                        const nR = [...selectedRoutes, route]
                        setSelectedRoutes(nR)
                        onSelectedChange(nR)
                    }
                    else {
                        const nR =selectedRoutes.filter(r => !(isRoutesEqual(r, route)))
                        setSelectedRoutes(nR)
                        onSelectedChange(nR)
                    }
                    
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