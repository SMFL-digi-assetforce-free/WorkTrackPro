import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Attendance } from "@shared/schema";

export default function ReportsPage() {
  const { data: records, isLoading } = useQuery<Attendance[]>({ 
    queryKey: ["/api/attendance"]
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Calculate daily hours
  const dailyHours = records?.reduce((acc: { date: string; hours: number }[], record) => {
    if (!record.clockOut) return acc;
    
    const date = new Date(record.clockIn).toLocaleDateString();
    const duration = (new Date(record.clockOut).getTime() - new Date(record.clockIn).getTime()) / (1000 * 60 * 60);
    
    const existingDate = acc.find(d => d.date === date);
    if (existingDate) {
      existingDate.hours += duration;
    } else {
      acc.push({ date, hours: duration });
    }
    
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daily Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#1976D2" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Average Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(dailyHours.reduce((acc, day) => acc + day.hours, 0) / dailyHours.length || 0).toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyHours.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyHours.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
