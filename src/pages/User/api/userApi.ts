import axios from "axios";
import { User } from "../types/userTypes";

const API_URL = "http://localhost:5000/api/user";

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>(`${API_URL}/getAll`);
  return res.data;
};

export const createUser = async (
  newUser: Omit<User, "id" | "createdAt">
): Promise<User> => {
  const res = await axios.post<User>(`${API_URL}/create`, newUser);
  return res.data;
};
