require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { getPoolClient } = require("./config/db");

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/petitions", async (req, res) => {
  const page = req.query["page"] ?? 1;
  const limit = req.query["limit"] ?? 5;
  const offset = (page - 1) * limit;

  try {
    const client = await getPoolClient();
    const {
      rows: [{ pagination, petitions }],
    } = await client.query(
      `
  WITH PaginatedResults AS (
    SELECT 
        p."id" AS "id",
        p."title" AS "title",
        json_build_object(
            'userProfile', json_build_object(
                'fullName', up."fullName",
                'profilePic', up."profilePic"
            )
        ) AS "user"
    FROM 
        "petitions" p
    JOIN 
        "users" u ON p."userId" = u."id"
    JOIN 
        "userProfiles" up ON u."id" = up."userId"
    ORDER BY
        p."id"
    LIMIT $1 OFFSET $2 
  ),
  TotalCount AS (
      SELECT COUNT(*) AS "totalRows"
      FROM "petitions"
  )

  SELECT 
      json_build_object(
          'rows', (SELECT COUNT(*) FROM PaginatedResults),
          'totalRows', (SELECT "totalRows" FROM TotalCount),
          'currentPage', ($2 / $1 + 1),  
          'nextPage', (SELECT "totalRows" FROM TotalCount) > ($2 + $1)  
      ) AS "pagination",
      json_agg(PaginatedResults) AS "petitions"  
  FROM 
      PaginatedResults
`,
      [limit, offset],
    );

    res.status(200).json({
      data: { petitions },
      pagination,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("running on port", PORT);
});
