"use client";

import { useState } from "react";
import { Check, Edit, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientData {
  firstName: string;
  lastName: string;
  birthDate: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  familyHistory: string;
  symptoms: string;
  medications: string;
  consultationDate: string;
  medicalHistory: string;
}

interface PatientInfoCardProps {
  patientData?: PatientData;
  onSave?: (data: PatientData) => void;
  readOnly?: boolean;
}

export default function PatientInfoCard({
  patientData = {
    firstName: "",
    lastName: "",
    birthDate: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    familyHistory: "",
    symptoms: "",
    medications: "",
    consultationDate: new Date().toISOString().slice(0, 10),
    medicalHistory: "",
  },
  onSave = () => {},
  readOnly = false,
}: PatientInfoCardProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<PatientData>(patientData);

  // Calculate age based on birth date
  function calculateAge(birthDate: string) {
    if (!birthDate) return "";

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  }

  // Handle form field changes
  const handleChange = (field: keyof PatientData, value: string) => {
    if (field === "birthDate") {
      const calculatedAge = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        birthDate: value,
        age: calculatedAge,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Save patient information
  const handleSave = () => {
    onSave(formData);
    setEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(patientData);
    setEditing(false);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg rounded-2xl overflow-hidden w-full">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white flex flex-row justify-between items-center">
        <CardTitle>Patient Information</CardTitle>
        {!readOnly && (
          <div>
            {editing ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-600 text-white hover:bg-green-700 border-green-600 rounded-lg"
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="bg-red-600 text-white hover:bg-red-700 border-red-600 rounded-lg"
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 rounded-lg"
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            First Name
          </Label>
          <Input
            disabled={!editing}
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Last Name
          </Label>
          <Input
            disabled={!editing}
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Birth Date
          </Label>
          <Input
            type="date"
            disabled={!editing}
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Age</Label>
          <Input
            disabled={true}
            value={formData.age}
            className="border-slate-300 rounded-lg bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Gender</Label>
          <Select
            disabled={!editing}
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Email Address
          </Label>
          <Input
            type="email"
            disabled={!editing}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Phone</Label>
          <Input
            disabled={!editing}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Consultation Date
          </Label>
          <Input
            type="date"
            disabled={!editing}
            value={formData.consultationDate}
            onChange={(e) => handleChange("consultationDate", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Family History
          </Label>
          <Textarea
            disabled={!editing}
            value={formData.familyHistory}
            onChange={(e) => handleChange("familyHistory", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
            placeholder="Enter family medical history relevant to neurological conditions"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Current Symptoms
          </Label>
          <Textarea
            disabled={!editing}
            value={formData.symptoms}
            onChange={(e) => handleChange("symptoms", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
            placeholder="Describe current symptoms and their duration"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Current Medications
          </Label>
          <Textarea
            disabled={!editing}
            value={formData.medications}
            onChange={(e) => handleChange("medications", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
            placeholder="List all current medications and dosages"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Medical History
          </Label>
          <Textarea
            disabled={!editing}
            value={formData.medicalHistory}
            onChange={(e) => handleChange("medicalHistory", e.target.value)}
            className="border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
            placeholder="Provide relevant medical history information"
          />
        </div>
      </CardContent>
    </Card>
  );
}
