"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronDown, User, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PatientForm from "./PatientForm";
import PatientHistory from "@/components/PatientHistory";

export interface Patient {
  id?: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  num_dossier?: string;
}

interface DiagnosticType {
  id: string;
  name: string;
}

interface PatientSelectionHeaderProps {
  onPatientSelect?: (patient: Patient | null) => void;
  onDiagnosticTypeSelect?: (diagnosticType: DiagnosticType) => void;
  onCreatePatient?: () => void;
}

export default function PatientSelectionHeader({
  onPatientSelect = () => {},
  onDiagnosticTypeSelect = () => {},
  onCreatePatient = () => {},
}: PatientSelectionHeaderProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientPopoverOpen, setIsPatientPopoverOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Helper function to generate unique keys for patients
  const getPatientKey = (patient: Patient): string => {
    if (patient.id) return patient.id;
    if (patient.patient_id) return patient.patient_id;
    // Fallback composite key
    return `${patient.first_name}-${patient.last_name}-${patient.date_of_birth}`;
  };

  // Fetch patients
  const fetchPatients = async (): Promise<Patient[] | undefined> => {
    try {

      const response = await fetch(`${apiUrl}/api/doctor/patients/`, {
        credentials: "include",   // this sends the HttpOnly cookie
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Authentication failed. Please login again.");
        } else {
          setError("Failed to fetch patients");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPatients(data);
      setError(null);
      return data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients from API
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.first_name} ${patient.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.num_dossier?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientPopoverOpen(false);
    onPatientSelect(patient);
  };

  // Handle create new patient
  const handleCreatePatient = () => {
    setIsPatientPopoverOpen(false);
    setShowForm(true);
    onCreatePatient();
  };

  const handlePatientCreated = async (patientData: Patient) => {
    fetchPatients();
    setShowForm(false);
    setSelectedPatient(patientData);
    onPatientSelect(patientData);
  };

  return (
    <div className="mb-8 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col w-full md:w-auto gap-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Patient Selection
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select an existing patient or create a new one before proceeding with analysis
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            {/* Patient Selection */}
            <Popover
              open={isPatientPopoverOpen}
              onOpenChange={setIsPatientPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[250px] justify-between"
                >
                  {selectedPatient ? (
                    <span className="truncate">{selectedPatient.first_name} {selectedPatient.last_name}</span>
                  ) : (
                    <span>Select Patient</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-0" align="end">
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder="Search patients..."
                      className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-[300px] overflow-auto">
                  {loading ? (
                    <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                      Loading patients...
                    </div>
                  ) : error ? (
                    <div className="p-3 text-center text-red-500 dark:text-red-400">
                      {error}
                    </div>
                  ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <div
                        key={getPatientKey(patient)} // Fixed: Using unique key
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <FileText className="h-3 w-3" />
                              <span>Dossier: {patient.num_dossier}</span>
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(patient.date_of_birth)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                      No patients found
                    </div>
                  )}
                </div>
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleCreatePatient}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Patient
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Patient Form Dialog */}
        <PatientForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handlePatientCreated}
        />

        {/* Selected Patient Info */}
        {selectedPatient && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-blue-600 dark:text-blue-400 mt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Dossier: {selectedPatient.num_dossier}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date of Birth: {formatDate(selectedPatient.date_of_birth)}
                    </span>
                    {selectedPatient.email && (
                      <span className="flex items-center gap-1">
                        Email: {selectedPatient.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
                onClick={() => {
                  setSelectedPatient(null);
                  onPatientSelect(null);
                }}
              >
                Change Patient
              </Button>
            </div>
          </div>
        )}

        {/* Patient History (shown only when a patient is selected) */}
        {selectedPatient && (
          <div className="mt-6">
            <PatientHistory 
              patientId={selectedPatient.patient_id ?? selectedPatient.id} 
              patientName={`${selectedPatient.last_name} ${selectedPatient.first_name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}