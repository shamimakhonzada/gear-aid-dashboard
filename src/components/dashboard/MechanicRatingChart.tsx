import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface RatingRow {
  id: string;
  mechanicName: string;
  rating: number;
  review: string;
  status: "1 Star" | "2 Star" | "3 Star" | "4 Star" | "5 Star";
}

export default function MechanicRatingTable() {
  const [data, setData] = useState<RatingRow[]>([]);

  useEffect(() => {
    const fetchRatings = async () => {
      const db = getDatabase();
      const mechanicsRef = ref(db, "Users/Mechanic");
      const snapshot = await get(mechanicsRef);
      const mechanics = snapshot.val() || {};

      const ratingRows: RatingRow[] = [];

      Object.entries(mechanics).forEach(([mechId, mechanic]: any) => {
        const name = mechanic?.name || "Unnamed";
        const reviews = mechanic?.Reviews || {};

        if (typeof reviews === "object" && reviews !== null) {
          Object.entries(reviews).forEach(([reviewId, review]: any) => {
            const rating = Math.round(review?.rating || 0);
            if (rating >= 1 && rating <= 5) {
              ratingRows.push({
                id: `${mechId}-${reviewId}`,
                mechanicName: name,
                rating,
                review: review.review || "No comment",
                status: `${rating} Star` as RatingRow["status"],
              });
            }
          });
        }
      });

      setData(ratingRows);
    };

    fetchRatings();
  }, []);

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Mechanic Ratings & Reviews
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className=" border-gray-100 dark:border-gray-800 border-y ">
            <TableRow>
              <TableCell
                isHeader
                className="text-start text-theme-xs text-gray-500 py-4"
              >
                Mechanic
              </TableCell>
              <TableCell
                isHeader
                className="text-start text-theme-xs text-gray-500 py-4"
              >
                Rating
              </TableCell>
              <TableCell
                isHeader
                className="text-start text-theme-xs text-gray-500 py-4"
              >
                Review
              </TableCell>
              <TableCell
                isHeader
                className="text-start text-theme-xs text-gray-500 py-4"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No reviews available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                    {item.mechanicName}
                  </TableCell>
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {item.rating} / 5
                  </TableCell>
                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {item.review}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={
                        item.rating >= 4
                          ? "success"
                          : item.rating === 3
                          ? "warning"
                          : "error"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
