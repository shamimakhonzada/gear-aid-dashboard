// import { db } from "../firebase";
// import { ref, get } from "firebase/database";

// // TypeScript types
// interface UserData {
//   createdAt?: string;
//   [key: string]: any;
// }

// type UserGroup = Record<string, UserData>;

// interface UserSnapshot {
//   ["Service User"]?: UserGroup;
//   Mechanic?: UserGroup;
// }

// // Count total users
// export async function getUserCounts(): Promise<{
//   serviceUserCount: number;
//   mechanicCount: number;
// }> {
//   const snapshot = await get(ref(db, "Users"));
//   const data: UserSnapshot = snapshot.val();

//   const serviceUsers = data?.["Service User"] || {};
//   const mechanics = data?.Mechanic || {};

//   return {
//     serviceUserCount: Object.keys(serviceUsers).length,
//     mechanicCount: Object.keys(mechanics).length,
//   };
// }

// // Monthly counts (based on createdAt)
// function getMonthlyCounts(users: UserGroup): number[] {
//   const monthly = Array(12).fill(0); // Jan to Dec
//   Object.values(users).forEach((user) => {
//     if (user.createdAt) {
//       const month = new Date(user.createdAt).getMonth(); // 0 = Jan
//       monthly[month]++;
//     }
//   });
//   return monthly;
// }

// // Fetch monthly registration data
// export async function getMonthlyData(): Promise<{
//   serviceUserMonthly: number[];
//   mechanicMonthly: number[];
// }> {
//   const snapshot = await get(ref(db, "Users"));
//   const data: UserSnapshot = snapshot.val();

//   return {
//     serviceUserMonthly: getMonthlyCounts(data?.["Service User"] || {}),
//     mechanicMonthly: getMonthlyCounts(data?.Mechanic || {}),
//   };
// }

// export async function getUserTypeRatio(): Promise<{
//   serviceUsers: number;
//   mechanics: number;
// }> {
//   const snapshot = await get(ref(db, "Users"));
//   const data: any = snapshot.val();

//   const serviceUsers = Object.keys(data?.["Service User"] || {}).length;
//   const mechanics = Object.keys(data?.Mechanic || {}).length;

//   return { serviceUsers, mechanics };
// }


///


import { db } from "../firebase";
import { ref, get } from "firebase/database";

// TypeScript types
interface UserData {
  createdAt?: string;
  [key: string]: any;
}

type UserGroup = Record<string, UserData>;

interface UserSnapshot {
  ["Service User"]?: UserGroup;
  Mechanic?: UserGroup;
}

// ✅ Count total users
export async function getUserCounts(): Promise<{
  serviceUserCount: number;
  mechanicCount: number;
}> {
  const snapshot = await get(ref(db, "Users"));
  const data: UserSnapshot = snapshot.val();

  const serviceUsers = data?.["Service User"] || {};
  const mechanics = data?.Mechanic || {};

  return {
    serviceUserCount: Object.keys(serviceUsers).length,
    mechanicCount: Object.keys(mechanics).length,
  };
}

// ✅ User Type Ratio
export async function getUserTypeRatio(): Promise<{
  serviceUsers: number;
  mechanics: number;
}> {
  const snapshot = await get(ref(db, "Users"));
  const data: UserSnapshot = snapshot.val();

  const serviceUsers = Object.keys(data?.["Service User"] || {}).length;
  const mechanics = Object.keys(data?.Mechanic || {}).length;

  return { serviceUsers, mechanics };
}

// ✅ Year-wise monthly counts helper
function accumulateMonthlyByYear(users: UserGroup): Record<string, number[]> {
  const result: Record<string, number[]> = {}; // { "2024": [..12 months], ... }

  Object.values(users).forEach((user) => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      const year = String(date.getFullYear());
      const month = date.getMonth(); // 0 = Jan

      if (!result[year]) result[year] = Array(12).fill(0);
      result[year][month]++;
    }
  });

  return result;
}

// ✅ Main function: Get year-wise registration data
export async function getYearlyMonthlyData(): Promise<{
  [year: string]: {
    serviceUsers: number[];
    mechanics: number[];
  };
}> {
  const snapshot = await get(ref(db, "Users"));
  const data: UserSnapshot = snapshot.val();

  const usersMonthly = accumulateMonthlyByYear(data?.["Service User"] || {});
  const mechanicsMonthly = accumulateMonthlyByYear(data?.Mechanic || {});

  const years = new Set([
    ...Object.keys(usersMonthly),
    ...Object.keys(mechanicsMonthly),
  ]);

  const final: Record<string, { serviceUsers: number[]; mechanics: number[] }> = {};

  years.forEach((year) => {
    final[year] = {
      serviceUsers: usersMonthly[year] || Array(12).fill(0),
      mechanics: mechanicsMonthly[year] || Array(12).fill(0),
    };
  });

  return final;
}
