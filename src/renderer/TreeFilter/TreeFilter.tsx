import * as React from "react";
import styled from 'styled-components'
// @ts-ignore
import SuperTreeview from 'react-super-treeview';

import 'react-super-treeview/dist/style.css'
import genTreeFromRoutes from "./genTreeFromRoutes";
import _ from "lodash";
import isRoutesEqual from "_/utils/isRoutesEqual";
import { Route } from "_/model/Route";


export default function TreeFilter({ routes, onSelectedChange, selectedRoutes }: {
    routes: Route[],
    selectedRoutes: Route[],
    onSelectedChange: (routes: Route[]) => void
}) {
    const [tree, setTree] = React.useState<any>([])

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
                        onSelectedChange(nR)
                    }
                    else {
                        const nR =selectedRoutes.filter(r => !(isRoutesEqual(r, route)))
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
    padding:8px;
`

const Container = styled.div`
    flex: 1;
    
    color:white;
    padding:8px;
`