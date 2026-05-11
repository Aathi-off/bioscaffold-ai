import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

import Welcome from "@/pages/Welcome";
import Main from "@/pages/Main";
import InputForm from "@/pages/InputForm";
import Results from "@/pages/Results";
import Optimize from "@/pages/Optimize";
import Visualize from "@/pages/Visualize";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes with navbar */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Navbar />
                <Main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/input"
            element={
              <ProtectedRoute>
                <Navbar />
                <InputForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Navbar />
                <Results />
              </ProtectedRoute>
            }
          />

          <Route
            path="/optimize"
            element={
              <ProtectedRoute>
                <Navbar />
                <Optimize />
              </ProtectedRoute>
            }
          />

          <Route
            path="/visualize"
            element={
              <ProtectedRoute>
                <Navbar />
                <Visualize />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Navbar />
                <About />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;