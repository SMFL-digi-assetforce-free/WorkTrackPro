import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { Attendance } from "@shared/schema";

export default function AttendancePage() {
  const { data: records, isLoading } = useQuery<Attendance[]>({ 
    queryKey: ["/api/attendance"]
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Records</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.map((record) => {
                const clockIn = new Date(record.clockIn);
                const clockOut = record.clockOut ? new Date(record.clockOut) : null;
                const duration = clockOut ? 
                  (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60) : 
                  null;

                return (
                  <TableRow key={record.id}>
                    <TableCell>{format(clockIn, "PP")}</TableCell>
                    <TableCell>{format(clockIn, "p")}</TableCell>
                    <TableCell>
                      {clockOut ? format(clockOut, "p") : "-"}
                    </TableCell>
                    <TableCell>
                      {duration ? `${duration.toFixed(1)}h` : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
