import { EventRoute } from "_/model/EventRoute";
import genTreeFromRoutes from "./genTreeFromRoutes";

describe('Tree tests', () => {
    it('should build right tree', () => {
        const routes = [
            {
                isActive: false,
                parts: ["A", "B"]
            },
            {
                isActive: false,
                parts:   ["A", "C"]
            },
            {
                isActive: false,
                parts: ["A"]
            },
        ] as EventRoute[]
        const rightTree = [
            {
                name: "A",
                id:"A",
                isExpanded: true,
                isChecked: false,
                route: ["A"],
                children: [
                    {
                        name: "B",
                        id:"A > B",
                        children: [],
                        isExpanded: false,
                        isChecked: false,
                        route: ["A", "B"],
                    },
                    {
                        name: "C",
                        id:"A > C",
                        children: [],
                        isExpanded: false,
                        isChecked: false,
                        route: ["A", "C"],
                    }
                ]
            }
        ]

        expect(genTreeFromRoutes(routes)).toStrictEqual(rightTree)
    });
/* 
    it('should check right routes', () => {
        const routes = [
            ["A", "B"],
            ["A", "C"],
            ["A"]
        ]
        const selections = [
            ["A", "B"],
            ["A"]
        ]
        const rightTree = [
            {
                name: "A",
                isExpanded: true,
                isChecked: true,
                route: ["A"],
                children: [
                    {
                        name: "B",
                        children: [],
                        isExpanded: false,
                        isChecked: true,
                        route: ["A", "B"],
                    },
                    {
                        name: "C",
                        children: [],
                        isExpanded: false,
                        isChecked: false,
                        route: ["A", "C"],
                    }
                ]
            }
        ]

        expect(genTreeFromRoutes(routes, selections, [])).toStrictEqual(rightTree)
    }); */
});