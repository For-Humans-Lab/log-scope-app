import genTreeFromRoutes from "./genTreeFromRoutes";



describe('Tree tests', () => {
    it('should build right tree', () => {
        const routes = [
            ["A", "B"],
            ["A", "C"],
            ["A"]
        ]
        const rightTree = [
            {
                name: "A",
                isExpanded: true,
                isChecked:false,
                children: [
                    {
                        name: "B",
                        children: [],
                        isExpanded: false,
                        isChecked:false,
                    },
                    {
                        name: "C",
                        children: [],
                        isExpanded: false,
                        isChecked:false,
                    }
                ]
            }
        ]

        expect(genTreeFromRoutes(routes, [], [])).toStrictEqual(rightTree)
    });

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
                isChecked:true,
                children: [
                    {
                        name: "B",
                        children: [],
                        isExpanded: false,
                        isChecked:true,
                    },
                    {
                        name: "C",
                        children: [],
                        isExpanded: false,
                        isChecked:false,
                    }
                ]
            }
        ]

        expect(genTreeFromRoutes(routes, selections, [])).toStrictEqual(rightTree)
    });
});