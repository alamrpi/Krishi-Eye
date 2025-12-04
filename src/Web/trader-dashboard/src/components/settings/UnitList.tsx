"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { catalogService } from "@/services/catalogService"

export function UnitList() {
    const { data: units, isLoading } = useQuery({
        queryKey: ['units'],
        queryFn: catalogService.getUnits,
    });

    if (isLoading) return <div>Loading units...</div>;

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {units?.map((unit) => (
                        <TableRow key={unit.id}>
                            <TableCell className="font-medium">{unit.name}</TableCell>
                            <TableCell>{unit.symbol}</TableCell>
                            <TableCell>
                                <Badge variant={unit.isGlobal ? "default" : "secondary"}>
                                    {unit.isGlobal ? "Global" : "Custom"}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                    {(!units || units.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">No units found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
