import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Clock, BarChart2, CalendarDays } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Attendance from "@/pages/attendance";
import Reports from "@/pages/reports";

function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="link" asChild>
              <a href="/" className="font-bold">Attendance Tracker</a>
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <a href="/"><Clock className="h-4 w-4 mr-2" />Dashboard</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/attendance"><CalendarDays className="h-4 w-4 mr-2" />Attendance</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/reports"><BarChart2 className="h-4 w-4 mr-2" />Reports</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="container mx-auto py-6">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
