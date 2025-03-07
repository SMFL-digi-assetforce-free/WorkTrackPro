import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Attendance } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Dashboard() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState("user1");

  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userName = params.get("userName") || "Guest";

  const { data: records, isLoading } = useQuery<Attendance[]>({ 
    queryKey: ["/api/attendance"]
  });

  const clockIn = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/attendance/clock-in", {
        employeeId: selectedUser,
        token: token,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({ title: "Clocked in successfully" });
    }
  });

  const clockOut = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/attendance/clock-out/${id}`, {
        token: token,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({ title: "Clocked out successfully" });
    }
  });

  const currentRecord = records?.find(r => !r.clockOut && r.employeeId === selectedUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalHours = records?.reduce((acc, record) => {
    if (!record.clockOut || record.employeeId !== selectedUser) return acc;
    const duration = new Date(record.clockOut).getTime() - new Date(record.clockIn).getTime();
    return acc + duration / (1000 * 60 * 60);
  }, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Welcome to use Dashboard, {userName} !</h1>
        <div className="flex-1 flex flex-col items-center gap-4">
          {!currentRecord ? (
            <Button 
              size="lg" 
              onClick={() => clockIn.mutate()}
              disabled={clockIn.isPending}
            >
              <Clock className="mr-2 h-4 w-4" /> Clock In
            </Button>
          ) : (
            <Button 
              size="lg"
              variant="destructive"
              onClick={() => clockOut.mutate(currentRecord.id)}
              disabled={clockOut.isPending}
            >
              <Clock className="mr-2 h-4 w-4" /> Clock Out
            </Button>
          )}
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">魏 元</SelectItem>
              <SelectItem value="user2">Solomon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHours.toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentRecord ? "Present" : "Not Checked In"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records?.filter(r => r.employeeId === selectedUser).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalHours / 7).toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalHours * 4).toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(0, totalHours - 40).toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Late Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Early Departures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              100%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}