import * as React from "react";
import styled from 'styled-components'
// @ts-ignore
import SuperTreeview from 'react-super-treeview';

import 'react-super-treeview/dist/style.css'
import genTreeFromRoutes from "./genTreeFromRoutes";
import _ from "lodash";
import isRoutesEqual from "_/utils/isRoutesEqual";
import { Route } from "_/model/Route";

import UncheckIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckIcon from '@material-ui/icons/CheckBoxOutlined'


export default function TreeFilter({ mutedRoutes, onRoutesChange, activeRoutes }: {
    mutedRoutes: Route[],
    activeRoutes: Route[],
    onRoutesChange: (active: Route[], muted: Route[]) => void,
}) {
    const [tree, setTree] = React.useState<any>([])

    React.useEffect(() => {
        setTree(genTreeFromRoutes([...mutedRoutes, ...activeRoutes], activeRoutes, []))
    }, [activeRoutes, mutedRoutes])

    function muteAll() {
        onRoutesChange([], [...activeRoutes, ...mutedRoutes])
    }

    function activateAll() {
        onRoutesChange([...activeRoutes, ...mutedRoutes], [])
    }

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
                onUpdateCb={(updatedData: any) => {
                    setTree(updatedData)
                }}
                onCheckToggleCb={(nodes: any, depth: any) => {
                    const node = nodes[0]
                    const isChecked = node.isChecked as boolean
                    console.log(node)
                    const route = node.route as string[]
                    if (isChecked) {
                        onRoutesChange([...activeRoutes, route], mutedRoutes.filter(r => !(isRoutesEqual(r, route))))
                    }
                    else {
                        onRoutesChange(activeRoutes.filter(r => !(isRoutesEqual(r, route))), [...mutedRoutes, route])
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