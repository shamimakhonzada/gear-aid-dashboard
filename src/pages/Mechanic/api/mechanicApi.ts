import axios from "axios";
import { Mechanic } from "../types/mechanicTypes";

const API_URL = "http://localhost:5000/api/mechanic";

export const fetchAllMechanics = async (): Promise<Mechanic[]> => {
  const res = await axios.get<Mechanic[]>(`${API_URL}/getAll`);
  return res.data;
};

export const createMechanic = async (
  newMechanic: Omit<Mechanic, "id" | "createdAt">
): Promise<Mechanic> => {
  const res = await axios.post<Mechanic>(`${API_URL}/create`, newMechanic);
  return res.data;
};

export const updateMechanic = async (
  id: number,
  updatedData: Omit<Mechanic, "id" | "createdAt" | "updatedAt">
): Promise<Mechanic> => {
  const res = await axios.put<Mechanic>(`${API_URL}/update/${id}`, updatedData);
  return res.data;
};

export const deleteMechanic = async (
  id: number
): Promise<{ message: string }> => {
  const res = await axios.delete<{ message: string }>(
    `${API_URL}/delete/${id}`
  );
  return res.data;
};
