import { Route } from "_/model/Route";
import unwrapRoute from "./unwrapRoute";

describe('Router unwrapped tests', () => {
    it('should properly unwrap route', () => {
        const route = ["A", "B", "C"] as Route
        expect(unwrapRoute(route)).toStrictEqual([
            ["A"],
            ["A", "B"],
            ["A", "B", "C"]
        ])
    });
});