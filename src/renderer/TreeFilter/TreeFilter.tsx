import * as React from "react";
import styled from 'styled-components'
// @ts-ignore
import SuperTreeview from 'react-super-treeview';

import 'react-super-treeview/dist/style.css'
import genTreeFromRoutes from "./genTreeFromRoutes";
import _ from "lodash";
import isRoutesEqual from "_/utils/isRoutePartsEqual";
import { EventRoute } from "_/model/EventRoute";

import UncheckIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckIcon from '@material-ui/icons/CheckBoxOutlined'
import cloneRoutes from "_/utils/cloneRoutes";


export default function TreeFilter({ routes, onRouteUpdates: onRouteUpdate }: {
    routes: EventRoute[],
    onRouteUpdates: (routes: EventRoute[]) => void,
}) {
    const [tree, setTree] = React.useState<any>()

    function muteAll() {
        routes.forEach(r=>r.isActive = false)
        onRouteUpdate([...routes])
    }

    function activateAll() {
        routes.forEach(r=>r.isActive = true)
        onRouteUpdate([...routes])
    }

    React.useEffect(() => {
        setTree(genTreeFromRoutes(cloneRoutes(routes)))
    }, [routes])

    console.log("tree render")

    return (
        <Container>
            <Title>
                Routes
                <div style={{ flex: 1 }} />
                <MenuBarButton onClick={muteAll}>
                    <UncheckIcon style={{ fontSize: 20 }} />
                </MenuBarButton>
                <MenuBarButton onClick={activateAll}>
                    <CheckIcon style={{ fontSize: 20 }} />
                </MenuBarButton>
            </Title>
            <SuperTreeview
                data={tree}
                onCheckToggleCb={(nodes: any, depth: any) => {
                    const node = nodes[0]
                    const isChecked = node.isChecked as boolean
                    const route = routes.find(r => r.id == node.id)!
                    if (isChecked) {
                        route.isActive = true
                        onRouteUpdate([...routes])
                    }
                    else {
                        route.isActive = false
                        onRouteUpdate([...routes])
                    }
                }}

                isDeletable={() => false}
                isExpandable={() => false}
            />

        </Container>
    )
}

const MenuBarButton = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  height: ${30}px;
  min-width:${30}px;
  :hover{
    background-color: #ffffff11;
  }
`

const Title = styled.div`
    font-size:20px;
    padding:8px;
    display:flex;
    align-items:center;
    flex-direction:row;
`

const Container = styled.div`
    flex: 1;
    
    color:white;
    padding:8px;
`