"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface PatientFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (patientData: Patient) => void;
  patient?: Patient | null;
  isEditing?: boolean;
}

export interface Patient {
  id?: string;
  patient_id:string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  num_dossier?: string;
}

export default function PatientForm({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  patient = null,
  isEditing = false,
}: PatientFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Patient>(
    patient || {
      patient_id:"",
      num_dossier: "",
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      gender: "",
      phone: "",
      address: "",
    },
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Patient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
      };

      const response = await fetch(`${apiUrl}/api/patient/`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("❌ Failed to create patient:", errData);
        setErrors({ general: "Failed to create patient. Check your input." });
        return;
      }

      const data = await response.json();
      onSubmit(data);
      onClose();
    } catch (err) {
      console.error("Error creating patient:", err);
      setErrors({ general: "Unexpected error occurred. Try again later." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Patient" : "Create New Patient"}
          </DialogTitle>
        </DialogHeader>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please correct the errors in the form before submitting.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-xs text-red-500">{errors.first_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-xs text-red-500">{errors.last_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                className={errors.date_of_birth ? "border-red-500" : ""}
              />
              {errors.date_of_birth && (
                <p className="text-xs text-red-500">{errors.date_of_birth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
              />
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="numDossier">Patient ID</Label>
                <Input
                  id="numDossier"
                  value={formData.num_dossier || ""}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">
                  Patient ID cannot be modified
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} className="mr-2" type="button">
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Patient" : "Create Patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}